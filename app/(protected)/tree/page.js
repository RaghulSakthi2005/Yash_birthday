"use client";
import { motion } from "framer-motion";

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
    </div>
  );
}
