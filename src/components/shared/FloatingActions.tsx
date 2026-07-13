"use client";

import { ArrowUp, Bot, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Msg {
  from: "bot" | "user";
  text: string;
}

const QUICK = ["Track my order", "Return policy", "Find my size"];

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
      {/* Chat panel — smooth open/close */}
      <div
        className={`fixed bottom-36 right-4 z-50 flex h-[440px] w-[330px] max-w-[calc(100vw-2rem)] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-300 ease-out lg:bottom-24 ${
          chatOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "pointer-events-none scale-95 opacity-0 translate-y-3"
        }`}
      >
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

      {/* Assistant — placed 20% up, hidden while chat is open (panel has its own close) */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          aria-label="Open shopping consultant"
          className="fixed bottom-[30%] right-4 z-50 cursor-pointer rounded-2xl bg-primary/20 px-3.5 py-1.5 text-center text-sm font-semibold leading-tight text-primary backdrop-blur-md transition-transform hover:scale-105 hover:bg-primary/30"
        >
          Shopping <br /> Consultant
        </button>
      )}

      {/* Go to top — bottom-right; fades in on scroll */}
      <div
        className={`fixed bottom-12.5 right-4 z-50 transition-all duration-300 ${
          showTop && !chatOpen
            ? "opacity-100 translate-y-0"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Go to top"
          className="flex cursor-pointer items-center gap-1.5 rounded-full bg-primary/20 px-3.5 py-1.5 text-sm font-semibold text-primary whitespace-nowrap backdrop-blur-md transition-transform hover:scale-105 hover:bg-primary/30"
        >
          <ArrowUp size={16} /> Back to top
        </button>
      </div>
    </>
  );
}
