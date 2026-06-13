"use client";

import { ArrowUp, Bot, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Msg {
  from: "bot" | "user";
  text: string;
}

const QUICK = ["Track my order", "Return policy", "Find my size"];

/** Hover tooltip shown to the left of a floating button. */
function Tooltip({ text }: { text: string }) {
  return (
    <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100">
      {text}
    </span>
  );
}

/** Fixed bottom-right: chatbot assistant + scroll-to-top. */
export default function FloatingActions() {
  const [chatOpen, setChatOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { from: "bot", text: "Hi! 👋 I'm your shopping assistant. How can I help?" },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatOpen]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [
      ...m,
      { from: "user", text: t },
      { from: "bot", text: "Thanks! A team member will follow up shortly. Meanwhile, check Help & contact." },
    ]);
    setInput("");
  };

  return (
    <>
      {/* Chat panel */}
      {chatOpen && (
        <div className="fixed bottom-36 right-4 z-50 flex h-[440px] w-[330px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl lg:bottom-24">
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-semibold">Assistant</span>
            </div>
            <button onClick={() => setChatOpen(false)} aria-label="close chat">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto bg-light p-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <span
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    m.from === "user"
                      ? "rounded-br-sm bg-primary text-white"
                      : "rounded-bl-sm bg-white text-secondary shadow-sm"
                  }`}
                >
                  {m.text}
                </span>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Quick replies */}
          <div className="flex flex-wrap gap-1.5 border-t border-gray-100 px-3 pt-2">
            {QUICK.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="rounded-full border border-gray-200 px-2.5 py-1 text-xs text-secondary hover:bg-light"
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              className="h-10 flex-1 rounded-full border border-gray-200 px-4 text-sm focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              aria-label="send"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Floating buttons */}
      <div className="fixed bottom-20 right-4 z-50 flex flex-col items-center gap-3 lg:bottom-6">
        {/* Go to top — above the assistant; always mounted so the assistant
            never shifts, fades/scales in smoothly on scroll. */}
        <div
          className={`group relative transition-all duration-300 ${
            showTop ? "opacity-100 translate-y-0" : "pointer-events-none translate-y-2 opacity-0"
          }`}
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Go to top"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-secondary text-white shadow-lg transition-transform hover:scale-110"
          >
            <ArrowUp size={20} />
          </button>
          <Tooltip text="Back to top" />
        </div>

        {/* Assistant — anchored at the bottom */}
        <div className="group relative">
          <button
            onClick={() => setChatOpen((o) => !o)}
            aria-label="Open assistant"
            className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110"
          >
            {chatOpen ? <X size={22} /> : <Bot size={24} />}
          </button>
          <Tooltip text="Chat with assistant" />
        </div>
      </div>
    </>
  );
}
