import { Send } from "lucide-react";

const Chat = ({
  messages,
  prompt,
  setPrompt,
  handleUpdate,
  updateLoading,
  thinkingSteps,
  thinkingIndex,
}) => {
  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] ${
              m.role === "user" ? "ml-auto" : "mr-auto"
            }`}
          >
            <div
              className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-white text-black"
                  : "bg-white/5 border border-white/10 text-zinc-200"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {updateLoading && (
          <div className="max-w-[85%] mr-auto">
            <div className="px-4 py-2.5 rounded-2xl text-xs bg-white/5 border border-white/10 text-zinc-400 italic">
              {thinkingSteps[thinkingIndex]}
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-white/10">
        <div className="flex gap-2">
          <input
            placeholder="Describe Changes..."
            className="flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-sm outline-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            className="px-4 py-3 rounded-2xl bg-white text-black"
            onClick={handleUpdate}
            disabled={updateLoading}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Chat;