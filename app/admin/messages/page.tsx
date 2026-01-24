import { createClient } from "@/utils/supabase/server";

export const revalidate = 0;

export default async function MessagesDashboard() {
  const supabase = await createClient();

  const { data: messages, error } = await supabase
    .from("Guest List")
    .select("first_name, last_name, message, created_at")
    .not("message", "is", null)
    .neq("message", "")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching messages:", error);
    return (
      <div className="min-h-screen bg-black text-white p-8 pt-24 flex justify-center">
        <div className="text-red-400 bg-red-900/20 p-4 rounded-lg border border-red-500/30">
          Error loading messages. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-periwinkle-300 via-white to-periwinkle-300 mb-8">
          Guest Messages
        </h1>

        {messages && messages.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-periwinkle-500/30 transition-all backdrop-blur-sm shadow-lg hover:shadow-periwinkle-900/10 group"
              >
                <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-3">
                  <h3 className="text-xl font-semibold text-periwinkle-200 group-hover:text-periwinkle-100 transition-colors">
                    {msg.first_name} {msg.last_name}
                  </h3>
                  {msg.created_at && (
                    <span className="text-xs text-gray-500 font-mono">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed italic">
                  &quot;{msg.message}&quot;
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <p className="text-gray-400 text-lg">No messages found yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
