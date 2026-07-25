-- ============================================================================
-- Who Said It? — multiplayer quote game
--
-- Schema, row-level security, game-state functions, and the quote seed.
-- Safe to re-run: every statement is idempotent and the seed uses
-- ON CONFLICT DO NOTHING.
--
-- Apply with:  node scripts/apply-who-said-it.mjs
-- or paste into the Supabase dashboard SQL editor.
--
-- SECURITY MODEL (the important part)
--   The correct answer lives in wsi_rounds, which has NO anon policy. It
--   reaches a browser only via GET /api/who-said-it/state, and only once the
--   room's phase is 'revealed'. wsi_rooms and wsi_players are anon-readable
--   because they drive the live roster and leaderboard and contain no answers.
--   Nothing is anon-writable at all — every write goes through a server route
--   holding the service-role key.
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- tables ----

create table if not exists wsi_quotes (
  id         bigserial primary key,
  text       text not null,
  said_by    text not null,
  said_on    text,
  context    text,
  active     boolean not null default true,
  created_at timestamptz not null default now(),
  unique (text, said_by)
);

create table if not exists wsi_rooms (
  code         text primary key,
  phase        text not null default 'lobby'
               check (phase in ('lobby', 'question', 'revealed', 'final')),
  round_index  int not null default 0,
  total_rounds int not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Separate table so the host token hash is never one column-list mistake away
-- from an anon-readable row.
create table if not exists wsi_room_secrets (
  code            text primary key references wsi_rooms(code) on delete cascade,
  host_token_hash text not null
);

-- Server-only: holds the answer.
create table if not exists wsi_rounds (
  code        text not null references wsi_rooms(code) on delete cascade,
  round_index int not null,
  quote_id    bigint not null references wsi_quotes(id),
  options     text[] not null,
  answer      text not null,
  scored_at   timestamptz,
  primary key (code, round_index)
);

-- Anon-readable. answered_round is just an int and score is a total, so this
-- leaks nothing about the current answer.
create table if not exists wsi_players (
  id             uuid primary key default gen_random_uuid(),
  code           text not null references wsi_rooms(code) on delete cascade,
  name           text not null,
  score          int not null default 0,
  answered_round int,
  joined_at      timestamptz not null default now(),
  unique (code, name)
);

-- Server-only: a player's choice plus is_correct would leak the answer.
create table if not exists wsi_guesses (
  code        text not null references wsi_rooms(code) on delete cascade,
  round_index int not null,
  player_id   uuid not null references wsi_players(id) on delete cascade,
  choice      text not null,
  is_correct  boolean,
  primary key (code, round_index, player_id)
);

create index if not exists wsi_players_code_idx  on wsi_players (code);
create index if not exists wsi_guesses_round_idx on wsi_guesses (code, round_index);
create index if not exists wsi_quotes_active_idx on wsi_quotes (active) where active;

-- ------------------------------------------------------------------- RLS ----

alter table wsi_quotes       enable row level security;
alter table wsi_rooms        enable row level security;
alter table wsi_room_secrets enable row level security;
alter table wsi_rounds       enable row level security;
alter table wsi_players      enable row level security;
alter table wsi_guesses      enable row level security;

-- Exactly two read policies, and no write policy anywhere.
-- wsi_quotes, wsi_rounds, wsi_guesses and wsi_room_secrets deliberately get no
-- policy at all, which denies anon by default. Do not add a SELECT policy to
-- wsi_quotes — that would put every quote and its attribution one fetch away
-- from any player mid-game.

drop policy if exists wsi_rooms_anon_read on wsi_rooms;
create policy wsi_rooms_anon_read on wsi_rooms
  for select to anon, authenticated using (true);

drop policy if exists wsi_players_anon_read on wsi_players;
create policy wsi_players_anon_read on wsi_players
  for select to anon, authenticated using (true);

-- Belt and braces. Supabase grants anon broad table privileges in public by
-- default and relies on RLS to gate the rows, so if RLS were ever switched off
-- on one of these the answers would be readable. Removing the grant outright
-- means there are two independent things standing in the way, not one.
revoke all on table wsi_quotes       from anon, authenticated;
revoke all on table wsi_rounds       from anon, authenticated;
revoke all on table wsi_guesses      from anon, authenticated;
revoke all on table wsi_room_secrets from anon, authenticated;

-- These two must stay readable — Realtime subscribes as the anon role.
revoke all on table wsi_rooms   from anon, authenticated;
revoke all on table wsi_players from anon, authenticated;
grant select on table wsi_rooms   to anon, authenticated;
grant select on table wsi_players to anon, authenticated;

-- Why the revoke-then-grant above rather than a bare grant: Supabase's defaults
-- hand anon insert/update/delete on public tables. RLS already stops those
-- writes (no policy covers them), but a forged PATCH then comes back 204 having
-- matched zero rows, which reads like success. Dropping the grant makes it fail
-- outright, and leaves two independent defences instead of one.

-- ------------------------------------------------------- state functions ----
-- Each host action is one atomic, idempotent statement. All are guarded on the
-- current phase so a double-tap on a laggy laptop can't advance twice.

create or replace function wsi_start(p_code text)
returns void language sql security definer set search_path = public as $fn$
  update wsi_rooms
     set phase = 'question', round_index = 0, updated_at = now()
   where code = p_code and phase = 'lobby';
$fn$;

create or replace function wsi_reveal(p_code text, p_round int)
returns void language plpgsql security definer set search_path = public as $fn$
begin
  -- Claim this round's scoring exactly once. A second or concurrent call finds
  -- scored_at already set, skips the scoring, and only re-applies the phase
  -- flip. This claim is what makes Reveal safe to mash.
  update wsi_rounds
     set scored_at = now()
   where code = p_code and round_index = p_round and scored_at is null;

  if found then
    update wsi_guesses g
       set is_correct = (g.choice = r.answer)
      from wsi_rounds r
     where g.code = p_code
       and g.round_index = p_round
       and r.code = g.code
       and r.round_index = g.round_index;

    update wsi_players p
       set score = p.score + 1
     where p.code = p_code
       and exists (
             select 1
               from wsi_guesses g
              where g.code = p_code
                and g.round_index = p_round
                and g.player_id = p.id
                and g.is_correct
           );
  end if;

  update wsi_rooms
     set phase = 'revealed', updated_at = now()
   where code = p_code;
end;
$fn$;

-- round_index/total_rounds are read from the OLD row on the right-hand side, so
-- this single statement decides "next round" vs "game over" server-side. The
-- phase guard makes a second click a no-op instead of skipping a quote.
create or replace function wsi_next(p_code text)
returns void language sql security definer set search_path = public as $fn$
  update wsi_rooms
     set round_index = case when round_index + 1 >= total_rounds
                            then round_index else round_index + 1 end,
         phase       = case when round_index + 1 >= total_rounds
                            then 'final' else 'question' end,
         updated_at  = now()
   where code = p_code and phase = 'revealed';
$fn$;

-- Clears play state and returns the room to the lobby. The caller then builds a
-- fresh deck, since option generation lives in application code.
create or replace function wsi_reset(p_code text)
returns void language plpgsql security definer set search_path = public as $fn$
begin
  delete from wsi_guesses where code = p_code;
  delete from wsi_rounds  where code = p_code;
  update wsi_players
     set score = 0, answered_round = null
   where code = p_code;
  update wsi_rooms
     set phase = 'lobby', round_index = 0, updated_at = now()
   where code = p_code;
end;
$fn$;

-- These are SECURITY DEFINER, so leaving them executable by anon would let any
-- player force a reveal or skip a round. Only the service role may call them.
revoke all on function wsi_start(text)       from public, anon, authenticated;
revoke all on function wsi_reveal(text, int) from public, anon, authenticated;
revoke all on function wsi_next(text)        from public, anon, authenticated;
revoke all on function wsi_reset(text)       from public, anon, authenticated;

-- -------------------------------------------------------------- realtime ----
-- Both screens subscribe to these two tables and treat any change as "refetch
-- state". REPLICA IDENTITY FULL is needed for DELETE payloads and for filtering
-- on a non-primary-key column (wsi_players.code).

alter table wsi_rooms   replica identity full;
alter table wsi_players replica identity full;

do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    raise notice 'publication supabase_realtime not found — enable Realtime in the dashboard, then re-run';
    return;
  end if;

  if not exists (select 1 from pg_publication_tables
                  where pubname = 'supabase_realtime' and tablename = 'wsi_rooms') then
    alter publication supabase_realtime add table wsi_rooms;
  end if;

  if not exists (select 1 from pg_publication_tables
                  where pubname = 'supabase_realtime' and tablename = 'wsi_players') then
    alter publication supabase_realtime add table wsi_players;
  end if;
end $$;

-- ------------------------------------------------------------------ seed ----
-- 128 quotes from the original prototype, generated rather than retyped.
-- Speaker names normalized: Mom -> Monica (30 quotes), Dad -> Kevin (4).
-- Verified that "Mom"/"Dad" appeared only in the attribution field and never
-- inside a quote's text or context, so no wording was altered.

insert into wsi_quotes (text, said_by, said_on, context) values
  ($wsi$Being a thot is fine, but being a thot for Drake is not$wsi$, $wsi$Brian$wsi$, $wsi$4/1/25$wsi$, null),
  ($wsi$I need to get my life together…all I know is that I’m wearing these pants$wsi$, $wsi$Alexis$wsi$, $wsi$4/8/25$wsi$, null),
  ($wsi$I’m an uncultured swan$wsi$, $wsi$Alexis$wsi$, $wsi$4/10/25$wsi$, null),
  ($wsi$It’s expensive to live$wsi$, $wsi$Brian$wsi$, $wsi$4/12/25$wsi$, null),
  ($wsi$Why don’t you come down the stairs like someone who’s not mentally insane?$wsi$, $wsi$Brian$wsi$, $wsi$4/18/25$wsi$, null),
  ($wsi$Do I wanna look cute and elegant or do I wanna look like a baddie$wsi$, $wsi$Alexis$wsi$, $wsi$5/1/25$wsi$, null),
  ($wsi$Mustard is god’s…condimentation…?$wsi$, $wsi$Monica$wsi$, $wsi$5/11/25$wsi$, null),
  ($wsi$I’ll just get drunk and then I’ll be okay$wsi$, $wsi$Alexis$wsi$, $wsi$5/12/25$wsi$, null),
  ($wsi$Oh my god I have glitter all over my hand…that’s good though I guess$wsi$, $wsi$Alexis$wsi$, $wsi$5/13/25$wsi$, null),
  ($wsi$Everything 🤗👐🏻$wsi$, $wsi$Monica$wsi$, $wsi$5/13/25$wsi$, null),
  ($wsi$Blame it on the sea lions$wsi$, $wsi$Alexis$wsi$, $wsi$5/14/25$wsi$, null),
  ($wsi$That’s because you live in hell$wsi$, $wsi$Brian$wsi$, $wsi$5/14/25$wsi$, $wsi$Replying to: I never see any wildlife in my neighborhood$wsi$),
  ($wsi$I’m going to the bar$wsi$, $wsi$Monica$wsi$, $wsi$5/15/25$wsi$, $wsi$Announced in the elevator$wsi$),
  ($wsi$I’d love to have a pet cow but not a pet shrimp$wsi$, $wsi$Monica$wsi$, $wsi$5/18/25$wsi$, null),
  ($wsi$I did not make fun of you…I laughed at you$wsi$, $wsi$Brian$wsi$, $wsi$5/25/25$wsi$, null),
  ($wsi$Do not throw my pork chops$wsi$, $wsi$Monica$wsi$, $wsi$5/30/25$wsi$, null),
  ($wsi$The kids love the Ciroc$wsi$, $wsi$Monica$wsi$, $wsi$5/30/25$wsi$, null),
  ($wsi$I’m not drunk… I’m just wet and slippery$wsi$, $wsi$Pat$wsi$, $wsi$6/13/25$wsi$, null),
  ($wsi$The 80’s were a blur$wsi$, $wsi$Joe$wsi$, $wsi$6/14/25$wsi$, null),
  ($wsi$Durham is really gay$wsi$, $wsi$Mere$wsi$, $wsi$6/14/25$wsi$, null),
  ($wsi$There must be something there. I’m…black$wsi$, $wsi$Kevin$wsi$, $wsi$6/14/25$wsi$, null),
  ($wsi$I didn’t think about drinking beer when I went to Chuck E. Cheese$wsi$, $wsi$Kevin$wsi$, $wsi$6/14/25$wsi$, null),
  ($wsi$It’s not a bachelorette trip without rabies$wsi$, $wsi$Payton$wsi$, $wsi$6/20/25$wsi$, null),
  ($wsi$There’s no sexy way to suck your thumb$wsi$, $wsi$Rebekah$wsi$, $wsi$6/21/25$wsi$, null),
  ($wsi$Top hat has to stay on$wsi$, $wsi$Rebekah$wsi$, $wsi$6/21/25$wsi$, null),
  ($wsi$It’s like Willy Wonka and the condom factory$wsi$, $wsi$Brian$wsi$, $wsi$6/25/25$wsi$, null),
  ($wsi$When I was a kid my diet consisted of hot dogs and Kraft mac and cheese$wsi$, $wsi$Alexis$wsi$, $wsi$6/27/25$wsi$, null),
  ($wsi$If Alexis is planning the event, the first stop is coffee$wsi$, $wsi$Brian$wsi$, $wsi$6/29/25$wsi$, null),
  ($wsi$Look, there’s the prison!$wsi$, $wsi$Brian$wsi$, $wsi$7/3/25$wsi$, null),
  ($wsi$Oh I wanna go there$wsi$, $wsi$Alexis$wsi$, $wsi$7/3/25$wsi$, $wsi$Replying to: Look, there’s the prison!$wsi$),
  ($wsi$This was the first weekend that we went to the beach and I didn’t get obliterated$wsi$, $wsi$Alexis$wsi$, $wsi$7/5/25$wsi$, null),
  ($wsi$You’re my trailer park fuck buddy$wsi$, $wsi$Alexis$wsi$, $wsi$7/11/25$wsi$, null),
  ($wsi$Cheese wiz ruined my childhood$wsi$, $wsi$Brian$wsi$, $wsi$7/12/25$wsi$, null),
  ($wsi$I’ve had rice everywhere$wsi$, $wsi$Brian$wsi$, $wsi$7/14/25$wsi$, $wsi$Replying to: You’ve had rice in your leg hair?$wsi$),
  ($wsi$The fifth wheel is like the … penis?$wsi$, $wsi$Alexis$wsi$, $wsi$7/18/25$wsi$, null),
  ($wsi$I had a job last year$wsi$, $wsi$Alexis$wsi$, $wsi$7/22/25$wsi$, null),
  ($wsi$You can’t stop the cash$wsi$, $wsi$Monica$wsi$, $wsi$7/22/25$wsi$, null),
  ($wsi$I took two Excedrins and a Mountain Dew this morning$wsi$, $wsi$Matt$wsi$, $wsi$7/23/25$wsi$, null),
  ($wsi$Cardamommy$wsi$, $wsi$Monica$wsi$, $wsi$7/24/25$wsi$, null),
  ($wsi$Footgettinhot?$wsi$, $wsi$Monica$wsi$, $wsi$7/24/25$wsi$, null),
  ($wsi$Tricuits…hotdogs…coffee$wsi$, $wsi$Monica$wsi$, $wsi$7/24/25$wsi$, null),
  ($wsi$I’ll put your ashes in my tiny home$wsi$, $wsi$Monica$wsi$, $wsi$7/25/25$wsi$, null),
  ($wsi$Well you don’t wanna be naked in the snow…ya know?$wsi$, $wsi$Brewery waitress$wsi$, $wsi$7/25/25$wsi$, null),
  ($wsi$Just making sure it’s not the hoe’s$wsi$, $wsi$Alexis$wsi$, $wsi$7/25/25$wsi$, $wsi$While going through Brian’s phone$wsi$),
  ($wsi$It’s ACE rent a car$wsi$, $wsi$Brian$wsi$, $wsi$7/25/25$wsi$, $wsi$Replying to: Just making sure it’s not the hoe’s$wsi$),
  ($wsi$Men…maybe they’re not so smart…$wsi$, $wsi$Monica$wsi$, $wsi$7/25/25$wsi$, null),
  ($wsi$I’m like a surgeon$wsi$, $wsi$Joe$wsi$, $wsi$8/2/25$wsi$, null),
  ($wsi$Brian’s an instigator…that’s what I like about him$wsi$, $wsi$Deidra$wsi$, $wsi$8/2/25$wsi$, null),
  ($wsi$I was sexi Lexi…at least that’s what I called myself$wsi$, $wsi$Alexis$wsi$, $wsi$8/2/25$wsi$, null),
  ($wsi$Aren’t most Jonathon’s gay?$wsi$, $wsi$Tony$wsi$, $wsi$8/15/25$wsi$, null),
  ($wsi$I’ve been drinking…but I know what I’m doing$wsi$, $wsi$Carrie$wsi$, $wsi$8/15/25$wsi$, null),
  ($wsi$Tennisshoeyish$wsi$, $wsi$Deidra$wsi$, $wsi$8/16/25$wsi$, null),
  ($wsi$We’re LTL… Limiting The Lips$wsi$, $wsi$Deidra$wsi$, $wsi$8/16/25$wsi$, null),
  ($wsi$I think I got bourbon in my eyes$wsi$, $wsi$Joe$wsi$, $wsi$8/16/25$wsi$, null),
  ($wsi$We’re both working, we’re both getting dicked down…let me rephrase that$wsi$, $wsi$Alexis$wsi$, $wsi$8/19/25$wsi$, null),
  ($wsi$Wait, what’s the opposite of Mormon?$wsi$, $wsi$Alexis$wsi$, $wsi$8/22/25$wsi$, null),
  ($wsi$Where’d you get the bowl from?$wsi$, $wsi$Christy$wsi$, $wsi$8/23/25$wsi$, null),
  ($wsi$Andrea…I have a lesbian cousin$wsi$, $wsi$Matt$wsi$, $wsi$8/23/25$wsi$, null),
  ($wsi$Mormon magic$wsi$, $wsi$Alexis$wsi$, $wsi$8/29/25$wsi$, null),
  ($wsi$You know Beatbox drinks? Those drinks that get you trashed after one$wsi$, $wsi$Monica$wsi$, $wsi$8/30/25$wsi$, null),
  ($wsi$I’m gonna throw a fork at you$wsi$, $wsi$Monica$wsi$, $wsi$8/30/25$wsi$, null),
  ($wsi$So that’s how you say water…I’ve only heard you order alcohol$wsi$, $wsi$Lane$wsi$, $wsi$9/6/25$wsi$, null),
  ($wsi$Mass produced puppies…like bred$wsi$, $wsi$Alexis$wsi$, $wsi$9/7/25$wsi$, null),
  ($wsi$Do you think I have autism?$wsi$, $wsi$Brian$wsi$, $wsi$9/8/25$wsi$, null),
  ($wsi$Sometimes going to Walmart gives me anxiety$wsi$, $wsi$Monica$wsi$, $wsi$9/11/25$wsi$, null),
  ($wsi$Imagine getting fucked by the Eiffel towel$wsi$, $wsi$Alexis$wsi$, $wsi$9/11/25$wsi$, null),
  ($wsi$Wait you peed on the wall at Optimist Hall?$wsi$, $wsi$Alexis$wsi$, $wsi$9/13/25$wsi$, null),
  ($wsi$Is it Scrappy?$wsi$, $wsi$Christy$wsi$, $wsi$9/26/25$wsi$, null),
  ($wsi$I’m a Jew for Jesus$wsi$, $wsi$Matt Neighbor$wsi$, $wsi$9/26/25$wsi$, null),
  ($wsi$Little Caesar’s is like eating cardboard$wsi$, $wsi$Brian$wsi$, $wsi$10/7/25$wsi$, null),
  ($wsi$Deidra…I swiped two mayonnaises$wsi$, $wsi$Joe$wsi$, $wsi$10/7/25$wsi$, null),
  ($wsi$Somebody’s grandma died and they said we’re gonna air b&b this shit$wsi$, $wsi$Deidra$wsi$, $wsi$10/8/25$wsi$, null),
  ($wsi$I’ll have that$wsi$, $wsi$Monica$wsi$, $wsi$10/8/25$wsi$, $wsi$After the waitress said: Number2dealer$wsi$),
  ($wsi$That’s a juicy lime$wsi$, $wsi$Deidra$wsi$, $wsi$10/8/25$wsi$, null),
  ($wsi$She been smoking weed$wsi$, $wsi$Joe$wsi$, $wsi$10/8/25$wsi$, null),
  ($wsi$I can’t smoke weed…my lungs$wsi$, $wsi$Deidra$wsi$, $wsi$10/8/25$wsi$, $wsi$Replying to: She been smoking weed$wsi$),
  ($wsi$I have no games on my phone, except fruit ninja$wsi$, $wsi$Monica$wsi$, $wsi$10/8/25$wsi$, null),
  ($wsi$I don’t wanna cry while I’m eating$wsi$, $wsi$Kevin$wsi$, $wsi$10/18/25$wsi$, null),
  ($wsi$That man forgot…I had 6+3 equals 9$wsi$, $wsi$Kevin$wsi$, $wsi$10/18/25$wsi$, null),
  ($wsi$I don’t wanna eat anything that glows in the dark$wsi$, $wsi$Brian$wsi$, $wsi$10/25/25$wsi$, null),
  ($wsi$He’s like…a wholesome fuckboy$wsi$, $wsi$Alexis$wsi$, $wsi$10/25/25$wsi$, null),
  ($wsi$No. She’s just dramatic$wsi$, $wsi$Brian$wsi$, $wsi$10/29/25$wsi$, $wsi$Replying to: Wait is she British?$wsi$),
  ($wsi$I know you wouldn’t leave me because you’d be too broke$wsi$, $wsi$Brian$wsi$, $wsi$10/30/25$wsi$, null),
  ($wsi$No. I’ve had two$wsi$, $wsi$Matt Briley$wsi$, $wsi$10/31/25$wsi$, $wsi$Asked whether he’d had a drink yet$wsi$),
  ($wsi$We’re gonna DoorDash balls$wsi$, $wsi$Monica$wsi$, $wsi$10/31/25$wsi$, null),
  ($wsi$Did you have to tip?$wsi$, $wsi$Brielle$wsi$, $wsi$10/31/25$wsi$, $wsi$Replying to: It’s 7 thousand dollars for the fake boobs$wsi$),
  ($wsi$Too much weenie and pee pee$wsi$, $wsi$Monica$wsi$, $wsi$10/31/25$wsi$, null),
  ($wsi$They’re playing Lana Del Rey right now$wsi$, $wsi$Dylan$wsi$, $wsi$11/13/25$wsi$, $wsi$At a bar$wsi$),
  ($wsi$I hope I’m cute when I’m pregnant$wsi$, $wsi$Alexis$wsi$, $wsi$11/14/25$wsi$, null),
  ($wsi$I’d suck your toes if my life depended on it$wsi$, $wsi$Alexis$wsi$, $wsi$11/15/25$wsi$, null),
  ($wsi$My dog is autistic$wsi$, $wsi$Matt Neighbor$wsi$, $wsi$11/23/25$wsi$, null),
  ($wsi$I feel like juicy on the ass gives me trailer park vibes$wsi$, $wsi$Brian$wsi$, $wsi$11/26/25$wsi$, null),
  ($wsi$Doesn’t it feel very Alice in Wonderlandy?$wsi$, $wsi$Alexis$wsi$, $wsi$11/26/25$wsi$, null),
  ($wsi$It’s a porta-potty night$wsi$, $wsi$Chris Sr.$wsi$, $wsi$11/26/25$wsi$, null),
  ($wsi$I endured the porta-potty…it was revolting$wsi$, $wsi$Deidra$wsi$, $wsi$11/26/25$wsi$, null),
  ($wsi$You have to be drunk to be with me?$wsi$, $wsi$Joe$wsi$, $wsi$11/26/25$wsi$, null),
  ($wsi$Tequila kills viruses$wsi$, $wsi$Deidra$wsi$, $wsi$11/27/25$wsi$, null),
  ($wsi$Brown ale – it’s English, brown, it’s an ale$wsi$, $wsi$Chris$wsi$, $wsi$11/27/25$wsi$, null),
  ($wsi$Wait em out…we’ll play their game$wsi$, $wsi$Joe$wsi$, $wsi$11/27/25$wsi$, null),
  ($wsi$He’s a monster baby$wsi$, $wsi$Deidra$wsi$, $wsi$11/27/25$wsi$, null),
  ($wsi$There’s a lot of Jesus people in my hall…and I just can’t deal with it$wsi$, $wsi$Deidra$wsi$, $wsi$11/27/25$wsi$, null),
  ($wsi$I could eat the whole burrito…but I won’t be happy about it$wsi$, $wsi$Brian$wsi$, $wsi$11/27/25$wsi$, null),
  ($wsi$You’d never meet an ugly Brandy$wsi$, $wsi$Joe$wsi$, $wsi$11/28/25$wsi$, null),
  ($wsi$I know a non-stripper ugly Brandy$wsi$, $wsi$Mack$wsi$, $wsi$11/28/25$wsi$, $wsi$Replying to: You’d never meet an ugly Brandy$wsi$),
  ($wsi$You are me$wsi$, $wsi$Joe$wsi$, $wsi$11/28/25$wsi$, null),
  ($wsi$Weird things are happening to my body$wsi$, $wsi$Alexis$wsi$, $wsi$12/6/25$wsi$, null),
  ($wsi$It’s drug lingo$wsi$, $wsi$Joe$wsi$, $wsi$12/6/25$wsi$, null),
  ($wsi$I can’t imagine Luke as my father figure$wsi$, $wsi$Brian$wsi$, $wsi$12/6/25$wsi$, null),
  ($wsi$I don’t take medication I usually just suffer$wsi$, $wsi$Alexis$wsi$, $wsi$12/6/25$wsi$, null),
  ($wsi$Where were you when I made you feel embarrassed for not wearing underwear?$wsi$, $wsi$Deidra$wsi$, $wsi$12/6/25$wsi$, null),
  ($wsi$A work meeting$wsi$, $wsi$Joe$wsi$, $wsi$12/6/25$wsi$, $wsi$Replying to: Where were you when I made you feel embarrassed for not wearing underwear?$wsi$),
  ($wsi$Pat loves to pee$wsi$, $wsi$Monica$wsi$, $wsi$12/10/25$wsi$, null),
  ($wsi$We’re a pickle family$wsi$, $wsi$Monica$wsi$, $wsi$12/10/25$wsi$, null),
  ($wsi$He’s got that gay energy swag$wsi$, $wsi$Alexis$wsi$, $wsi$12/12/25$wsi$, null),
  ($wsi$I hate a fake peach$wsi$, $wsi$Deidra$wsi$, $wsi$12/20/25$wsi$, null),
  ($wsi$We. Do. Not. Smoke.$wsi$, $wsi$Monica$wsi$, $wsi$12/20/25$wsi$, null),
  ($wsi$Squirrels are just horrible$wsi$, $wsi$Joe$wsi$, $wsi$12/20/25$wsi$, null),
  ($wsi$Lamb and goat are friends and they’re just the same thing. If you eat them bad things will happen$wsi$, $wsi$Liv$wsi$, $wsi$12/20/25$wsi$, null),
  ($wsi$It’s like I’m looking at Benjamin Franklin$wsi$, $wsi$Monica$wsi$, $wsi$12/31/25$wsi$, null),
  ($wsi$I feel like I should be president$wsi$, $wsi$Monica$wsi$, $wsi$12/31/25$wsi$, null),
  ($wsi$Born a snitch, always a snitch$wsi$, $wsi$Alexis$wsi$, $wsi$12/31/25$wsi$, null),
  ($wsi$I thought your brother was gonna marry an Asian girl$wsi$, $wsi$Monica$wsi$, $wsi$12/31/25$wsi$, null),
  ($wsi$It’s a black tie wedding$wsi$, $wsi$Monica$wsi$, $wsi$12/31/25$wsi$, null),
  ($wsi$I’m not wearing a black tie$wsi$, $wsi$Matt$wsi$, $wsi$12/31/25$wsi$, $wsi$Replying to: It’s a black tie wedding$wsi$),
  ($wsi$I was thinking about having a drag queen$wsi$, $wsi$Monica$wsi$, $wsi$12/31/25$wsi$, null),
  ($wsi$I’m gonna message my drag queen$wsi$, $wsi$Monica$wsi$, $wsi$12/31/25$wsi$, null),
  ($wsi$You should have drag queens on your phone too$wsi$, $wsi$Monica$wsi$, $wsi$12/31/25$wsi$, null),
  ($wsi$Why do you have a headache buddy?$wsi$, $wsi$Monica$wsi$, $wsi$12/31/25$wsi$, null)
on conflict (text, said_by) do nothing;
