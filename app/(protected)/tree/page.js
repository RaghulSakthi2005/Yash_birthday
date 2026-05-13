"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function TreePage() {
  return (
    <div style={{ background: "#ffe", height: "100dvh", width: "100%", overflow: "hidden" }}>
      <style>{`
        /* Hide global pets and car on this exact page so they don't block the canvas interaction */
        .pet-wrap, .racing-car-wrapper { display: none !important; }
        /* Prevent scrollbars from layout padding */
        body { overflow: hidden !important; }
        main { padding-bottom: 0 !important; height: 100dvh; }
      `}</style>
      
      {/* The iframe holding the old click-me tree */}
      <motion.iframe
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        src="/birthday/birthday.html"
        style={{
          width: "100%",
          height: "100vh",
          border: "none",
          display: "block"
        }}
        title="Birthday Tree"
      />
      
      <div style={{ position: "absolute", bottom: 40, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 50, pointerEvents: "none" }}>
        <Link href="/soul" style={{ pointerEvents: "auto", padding: "16px 40px", fontSize: "16px", borderRadius: "100px", background: "#e8c547", color: "#000", fontWeight: "700", textDecoration: "none", boxShadow: "0 10px 30px rgba(232,197,71,0.4)" }}>Continue to Soul ✨</Link>
      </div>
    </div>
  );
}
