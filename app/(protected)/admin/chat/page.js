"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminChatDashboard() {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/chat/history");
      const data = await res.json();
      setHistory(data);
      setLoading(false);
    } catch (e) {
      console.error("Failed to fetch history");
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const sendManualReply = async () => {
    if (!input.trim()) return;
    const text = input;
    setInput("");

    try {
      await fetch("/api/chat/history", {
        method: "PUT",
        body: JSON.stringify({ text })
      });
      fetchHistory();
    } catch (e) {
      alert("Failed to send reply");
    }
  };

  return (
    <div style={{ background: "#050505", minHeight: "100vh", color: "#fff", fontFamily: "var(--font)" }}>
      {/* Sidebar/Nav Placeholder */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em" }}>Chat Control Center</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Monitoring conversations with Yashh!!</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ padding: "8px 16px", background: "rgba(74, 222, 128, 0.1)", color: "#4ade80", borderRadius: 100, fontSize: 12, border: "1px solid rgba(74, 222, 128, 0.2)" }}>
              Live Tracking Active
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
          {/* Chat Logs Container */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24, height: "60vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>Conversation Log</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{history.length} messages</span>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>Loading history...</div>
              ) : (
                history.map((msg) => (
                  <div key={msg.id} style={{ alignSelf: msg.from === "me" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 4, textAlign: msg.from === "me" ? "right" : "left" }}>
                      {msg.from === "me" ? (msg.isManual ? "YOU (Manual)" : "AI (Raghul)") : "Yashika"} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ 
                      padding: "12px 18px", 
                      borderRadius: 16, 
                      fontSize: 14,
                      background: msg.from === "me" ? (msg.isManual ? "#e8c547" : "rgba(255,255,255,0.08)") : "rgba(255,255,255,0.03)",
                      color: msg.from === "me" && msg.isManual ? "#000" : "#fff",
                      border: "1px solid",
                      borderColor: msg.from === "me" ? (msg.isManual ? "#e8c547" : "rgba(255,255,255,0.1)") : "rgba(255,255,255,0.05)"
                    }}>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
              <div ref={scrollRef} />
            </div>

            {/* Manual Reply Input */}
            <div style={{ padding: 24, borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}>
              <div style={{ display: "flex", gap: 12 }}>
                <input 
                  value={input} 
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendManualReply()}
                  placeholder="Intercept chat & reply as yourself..." 
                  style={{ flex: 1, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 20px", color: "#fff", outline: "none" }}
                />
                <button 
                  onClick={sendManualReply}
                  style={{ padding: "0 24px", background: "#e8c547", color: "#000", border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>
                  Send Manual Reply
                </button>
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 12 }}>
                💡 Manual replies will appear in Yashika's chat instantly. Use this to jump in personally!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
