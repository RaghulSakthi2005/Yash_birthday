"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import initialLandsData from "@/data/lands.json";

export default function LandsPage() {
  const [active, setActive] = useState(null);
  const [lands, setLands] = useState(initialLandsData);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleUpload = async (e, id) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("id", id);
    formData.append("file", file);
    
    const res = await fetch("/api/lands", { method: "POST", body: formData });
    if (res.ok) {
      const data = await res.json();
      setLands(prev => prev.map(l => l.id === id ? { ...data.land, img: `${data.land.img}?t=${Date.now()}` } : l));
    }
  };

  const handlePositionChange = async (e, id) => {
    const objectPosition = e.target.value;
    setLands(prev => prev.map(l => l.id === id ? { ...l, objectPosition } : l));
    
    const formData = new FormData();
    formData.append("id", id);
    formData.append("objectPosition", objectPosition);
    await fetch("/api/lands", { method: "POST", body: formData });
  };

  return (
    <div style={{ background: "#06060f", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ padding: "120px clamp(24px, 6vw, 80px) 60px", maxWidth: 1200, margin: "0 auto" }}>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="label" style={{ color: "rgba(232,197,71,0.5)", marginBottom: 16 }}>
          ✦ your world in letters ✦
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{ fontSize: "clamp(36px, 5vw, 68px)", fontWeight: 800, letterSpacing: "-0.03em",
            color: "#fff", marginBottom: 20, lineHeight: 1.05 }}>
          Letter of <span style={{ fontStyle: "italic", background: "linear-gradient(135deg, #4ade80, #22d3ee, #8ab4f8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Yashh!!</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ fontSize: 16, color: "rgba(245,240,232,0.45)", fontWeight: 300, maxWidth: 540 }}>
          Seven letters. Seven pieces of you. Each one holds a story written just for you. Click any letter to explore.
        </motion.p>
      </div>

      {/* Picture strip */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        style={{ position: "relative", margin: "0 0 60px", overflow: "hidden", borderRadius: 0, display: "flex", height: "clamp(240px, 35vw, 520px)" }}>
        
        {lands.map((land, i) => (
          <div key={i} style={{ flex: 1, position: "relative", height: "100%" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={land.img} alt={land.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: land.objectPosition || "center", transition: "object-position 0.3s ease" }} />
            
            {/* Edit Mode Controls */}
            {isEditMode && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, zIndex: 60, backdropFilter: "blur(4px)" }}>
                <label className="btn-gold" style={{ cursor: "pointer", fontSize: 11, padding: "8px 16px", background: "rgba(232,197,71,0.2)", border: "1px solid #e8c547", color: "#fff", borderRadius: 100 }}>
                  Upload
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleUpload(e, land.id)} />
                </label>
                <select 
                  value={land.objectPosition || "center"} 
                  onChange={(e) => handlePositionChange(e, land.id)}
                  style={{ background: "rgba(0,0,0,0.8)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 4, padding: "6px 10px", fontSize: 11, outline: "none", cursor: "pointer", maxWidth: "90%" }}
                >
                  <option value="center">Center</option>
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>
            )}
          </div>
        ))}
        
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(6,6,15,0.9) 100%)" }} />

        {/* Letter overlays on the images */}
        <div style={{ position: "absolute", inset: 0, display: "flex" }}>
          {lands.map((land, i) => (
            <div key={i} onClick={() => setActive(i)}
              style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "center",
                paddingBottom: 24, cursor: "pointer", transition: "background 0.25s ease",
                background: active === i ? `rgba(0,0,0,0.5)` : "transparent",
                borderRight: i < 6 ? "1px solid rgba(255,255,255,0.08)" : "none",
              }}>
              <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}
                style={{ width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: active === i ? land.color : "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(8px)", color: active === i ? "#000" : "#fff",
                  fontWeight: 800, fontSize: 20, border: `2px solid ${active === i ? land.color : "rgba(255,255,255,0.2)"}`,
                  transition: "all 0.3s ease", boxShadow: active === i ? `0 0 24px ${land.color}66` : "none",
                }}>
                {land.letter}
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Active land detail */}
      <div style={{ padding: "0 clamp(24px, 6vw, 80px) 80px", maxWidth: 1200, margin: "0 auto" }}>
        <AnimatePresence mode="wait">
          {active !== null ? (
            <motion.div key={active}
              initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card"
              style={{ padding: "40px 44px", borderColor: `${lands[active].color}33`,
                boxShadow: `0 0 60px ${lands[active].color}11` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
                <span style={{ fontSize: 40 }}>{lands[active].emoji}</span>
                <div>
                  <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
                    color: lands[active].color, marginBottom: 4, fontWeight: 600 }}>
                    {lands[active].place}
                  </p>
                  <h3 style={{ fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 8 }}>
                    {lands[active].name}
                  </h3>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", padding: "4px 12px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.1)" }}>
                     <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Located in:</span>
                     <span style={{ fontSize: 11, color: "#fff", fontWeight: 700 }}>{lands[active].location}</span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 17, lineHeight: 1.85, color: "rgba(245,240,232,0.7)", fontWeight: 300, maxWidth: 600 }}>
                {lands[active].story}
              </p>
            </motion.div>
          ) : (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 14, letterSpacing: "0.15em",
                textTransform: "uppercase", padding: "40px 0" }}>
              ✦ click a letter to reveal its land ✦
            </motion.p>
          )}
        </AnimatePresence>

        <div style={{ marginTop: 40, textAlign: "center" }}>
           <p style={{ fontSize: 13, fontStyle: "italic", color: "rgba(232,197,71,0.4)", letterSpacing: "0.05em", maxWidth: 700, margin: "0 auto" }}>
             "if ur happy smiling around me without the self consiousness of the thirdd person around then seeing it makes me happy"
           </p>
        </div>

        <div style={{ marginTop: 60, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/playlist" className="btn-gold">Continue to Playlist 🎵</Link>
        </div>
      </div>

      {/* Edit Toggle for Lands */}
      <button 
        onClick={() => setIsEditMode(!isEditMode)}
        style={{ 
          position: "fixed", bottom: 24, right: 24, zIndex: 100, 
          background: isEditMode ? "#e8c547" : "rgba(255,255,255,0.05)", 
          color: isEditMode ? "#000" : "#fff", 
          border: "1px solid", borderColor: isEditMode ? "#e8c547" : "rgba(255,255,255,0.1)", 
          borderRadius: "100px", padding: "10px 24px", cursor: "pointer", 
          backdropFilter: "blur(10px)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600,
          boxShadow: isEditMode ? "0 0 20px rgba(232,197,71,0.5)" : "none",
          transition: "all 0.3s ease"
        }}
      >
        {isEditMode ? "Finish Editing" : "Edit Lands"}
      </button>
    </div>
  );
}
