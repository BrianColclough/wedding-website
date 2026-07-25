"use client";

import { useCallback, useState } from "react";

type Quote = {
  id: number;
  text: string;
  said_by: string;
  said_on: string | null;
  context: string | null;
  active: boolean;
};

type Speaker = { name: string; count: number };

export default function QuoteAdminPage() {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [text, setText] = useState("");
  const [saidBy, setSaidBy] = useState("");
  const [saidOn, setSaidOn] = useState("");
  const [context, setContext] = useState("");

  // Reads go through the PIN-gated route, not a browser Supabase client:
  // wsi_quotes has no anon policy, and adding one would expose every answer.
  const load = useCallback(
    async (withPin: string) => {
      setBusy(true);
      setError(null);
      try {
        const res = await fetch(`/api/who-said-it/quotes?pin=${encodeURIComponent(withPin)}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "could not load quotes");
          return false;
        }
        setQuotes(data.quotes as Quote[]);
        setSpeakers(data.speakers as Speaker[]);
        setUnlocked(true);
        return true;
      } catch {
        setError("could not reach the server");
        return false;
      } finally {
        setBusy(false);
      }
    },
    []
  );

  const add = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/who-said-it/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, text, saidBy, saidOn, context }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "could not add the quote");
        return;
      }
      setText("");
      setContext("");
      await load(pin);
    } catch {
      setError("could not reach the server");
    } finally {
      setBusy(false);
    }
  }, [pin, text, saidBy, saidOn, context, load]);

  const toggle = useCallback(
    async (id: number, active: boolean) => {
      setBusy(true);
      try {
        await fetch("/api/who-said-it/quotes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin, id, active }),
        });
        await load(pin);
      } finally {
        setBusy(false);
      }
    },
    [pin, load]
  );

  if (!unlocked) {
    return (
      <div className="wsi-root wsi-phone">
        <div className="wsi-stack">
          <header className="wsi-head">
            <p className="wsi-eyebrow">Quote book</p>
            <h1 className="wsi-title">Admin</h1>
          </header>
          <div className="wsi-card wsi-flat">
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div className="wsi-field">
                <label className="wsi-label" htmlFor="wsi-admin-pin">
                  Host PIN
                </label>
                <input
                  id="wsi-admin-pin"
                  className="wsi-input"
                  type="password"
                  value={pin}
                  autoComplete="off"
                  onChange={(event) => setPin(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && pin) void load(pin);
                  }}
                />
              </div>
              {error && <p className="wsi-error">{error}</p>}
              <button
                className="wsi-btn"
                type="button"
                disabled={!pin || busy}
                onClick={() => void load(pin)}
              >
                {busy ? "Checking…" : "Unlock"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeCount = quotes.filter((quote) => quote.active).length;

  return (
    <div className="wsi-root wsi-phone">
      <div className="wsi-stack" style={{ maxWidth: 900 }}>
        <header className="wsi-head">
          <p className="wsi-eyebrow">
            {activeCount} active of {quotes.length}
          </p>
          <h1 className="wsi-title">Quote book</h1>
        </header>

        {error && <p className="wsi-error">{error}</p>}

        <div className="wsi-card wsi-flat">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="wsi-field">
              <label className="wsi-label" htmlFor="wsi-q-text">
                The quote
              </label>
              <input
                id="wsi-q-text"
                className="wsi-input"
                value={text}
                onChange={(event) => setText(event.target.value)}
              />
            </div>

            <div className="wsi-field">
              <label className="wsi-label" htmlFor="wsi-q-who">
                Who said it
              </label>
              <input
                id="wsi-q-who"
                className="wsi-input"
                value={saidBy}
                list="wsi-speakers"
                onChange={(event) => setSaidBy(event.target.value)}
              />
              <datalist id="wsi-speakers">
                {speakers.map((speaker) => (
                  <option key={speaker.name} value={speaker.name} />
                ))}
              </datalist>
            </div>

            <div className="wsi-field">
              <label className="wsi-label" htmlFor="wsi-q-when">
                When (optional, e.g. 7/25/26)
              </label>
              <input
                id="wsi-q-when"
                className="wsi-input"
                value={saidOn}
                onChange={(event) => setSaidOn(event.target.value)}
              />
            </div>

            <div className="wsi-field">
              <label className="wsi-label" htmlFor="wsi-q-ctx">
                Context (optional)
              </label>
              <input
                id="wsi-q-ctx"
                className="wsi-input"
                value={context}
                onChange={(event) => setContext(event.target.value)}
              />
            </div>

            <button
              className="wsi-btn wsi-btn-mint"
              type="button"
              disabled={!text || !saidBy || busy}
              onClick={() => void add()}
            >
              {busy ? "Saving…" : "Add it to the book"}
            </button>
          </div>
        </div>

        <p className="wsi-note">
          Speakers with 3+ quotes get used as wrong answers:{" "}
          {speakers
            .filter((speaker) => speaker.count >= 3)
            .map((speaker) => speaker.name)
            .join(", ")}
        </p>

        <ul className="wsi-board">
          {quotes.map((quote) => (
            <li key={quote.id} className="wsi-board-row" style={{ gridTemplateColumns: "1fr auto" }}>
              <span style={{ minWidth: 0 }}>
                <span className="wsi-board-name" style={{ whiteSpace: "normal" }}>
                  {quote.said_by}
                </span>
                <span
                  style={{
                    display: "block",
                    fontStyle: "italic",
                    opacity: quote.active ? 0.85 : 0.4,
                    textDecoration: quote.active ? "none" : "line-through",
                  }}
                >
                  {quote.text}
                </span>
              </span>
              <button
                className="wsi-link"
                type="button"
                style={{ color: "#1b1230", borderBottomColor: "#1b1230" }}
                disabled={busy}
                onClick={() => void toggle(quote.id, !quote.active)}
              >
                {quote.active ? "Retire" : "Restore"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
