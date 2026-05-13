"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const INITIAL_MESSAGES = [
  { from: "me", text: "hey yashh!! i built this space just for you. say anything.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
];

export default function ChatPage() {
  const [msgs, setMsgs] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  const send = async (text) => {
    const t = (text || input).trim();
    if (!t) return;
    setInput("");
    
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Optimistic UI update
    const newMsgs = [...msgs, { from: "them", text: t, time: now }];
    setMsgs(newMsgs);
    setTyping(true);

    // LOG USER MESSAGE
    fetch("/api/chat/history", {
      method: "POST",
      body: JSON.stringify({ message: t, from: "them", time: now })
    });

    try {
      // Send the conversation history so the bot has context
      const apiMessages = newMsgs.map(m => ({
        role: m.from === "me" ? "assistant" : "user",
        content: m.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages })
      });

      const data = await res.json();
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // LOG AI REPLY
      fetch("/api/chat/history", {
        method: "POST",
        body: JSON.stringify({ message: data.reply, from: "me", time: aiTime })
      });

      setTyping(false);
      setMsgs(m => [...m, { from: "me", text: data.reply, time: aiTime }]);
    } catch (err) {
      setTyping(false);
      const errTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMsgs(m => [...m, { from: "me", text: "My connection dropped for a sec, sorry! 😭", time: errTime }]);
    }
  };

  // POLLING FOR MANUAL REPLIES
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/chat/history");
        const history = await res.json();
        
        // Find manual replies that aren't in our current msgs
        const manualReplies = history.filter(h => h.isManual);
        
        setMsgs(prev => {
          const newManuals = manualReplies.filter(mr => !prev.some(p => p.text === mr.text && p.from === "me"));
          if (newManuals.length > 0) {
            return [...prev, ...newManuals.map(nm => ({ 
              from: "me", 
              text: nm.text,
              time: nm.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }))];
          }
          return prev;
        });
      } catch (e) {}
    };

    const interval = setInterval(poll, 3000); // Check every 3 seconds
    return () => clearInterval(interval);
  }, [msgs]);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{ padding: "80px clamp(20px, 5vw, 60px) 0", maxWidth: 740, margin: "0 auto", width: "100%" }}>
        <p className="label" style={{ color: "rgba(232,197,71,0.5)", marginBottom: 16 }}>💬 a space just for you</p>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 8 }}>
          Chat with me
        </h1>
        <p style={{ fontSize: 14, color: "rgba(245,240,232,0.35)", fontWeight: 300 }}>
          I built a version of me that's always here. Say anything.
        </p>
      </motion.div>

      {/* Chat window */}
      <div style={{ flex: 1, maxWidth: 740, margin: "0 auto", width: "100%",
        padding: "32px clamp(20px, 5vw, 60px) 0", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Status bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 20px",
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 100 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80",
              boxShadow: "0 0 8px #4ade80", animation: "breathe 2s ease-in-out infinite" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em" }}>Yash · online</span>
          </div>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            {today}
          </span>
        </div>

        {/* Messages */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, minHeight: 300 }}>
          <AnimatePresence>
            {msgs.map((m, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: "flex", flexDirection: "column", alignItems: m.from === "me" ? "flex-end" : "flex-start" }}>
                <div className={m.from === "me" ? "chat-bubble-me" : "chat-bubble-them"} style={{ color: "#fff" }}>
                  {m.text}
                </div>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 4 }}>
                  {m.time}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {typing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="chat-bubble-them" style={{ padding: "14px 18px", display: "flex", gap: 4, alignItems: "center" }}>
                  {[0,1,2].map(j => (
                    <motion.span key={j} animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, delay: j * 0.15, duration: 0.6 }}
                      style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.5)", display: "block" }} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div style={{ maxWidth: 740, margin: "24px auto 0", width: "100%",
        padding: "0 clamp(20px, 5vw, 60px) 40px" }}>
        
        <div style={{ display: "flex", gap: 12 }}>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Say something…"
            style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 100, padding: "14px 22px", color: "#fff", fontSize: 14,
              fontFamily: "var(--font)", outline: "none", transition: "border-color 0.25s" }}
            onFocus={e => e.target.style.borderColor = "rgba(232,197,71,0.35)"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
          />
          <motion.button onClick={() => send()} whileTap={{ scale: 0.93 }} whileHover={{ scale: 1.04 }}
            className="btn-gold" style={{ padding: "14px 28px", borderRadius: 100, flexShrink: 0 }}>
            Send →
          </motion.button>
        </div>

        <div style={{ marginTop: 40, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "center" }}>
          <Link href="/gallery" className="btn-gold" style={{ padding: "14px 32px", borderRadius: 100 }}>Continue to Memories 🖼</Link>
        </div>
      </div>
    </div>
  );
}
