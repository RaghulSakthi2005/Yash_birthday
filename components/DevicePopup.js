"use client";
import { useState, useEffect } from "react";

export default function DevicePopup() {
  const [show, setShow] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Only show on screens narrower than 1024px
    const isMobileOrTablet = window.innerWidth < 1024;
    // Don't annoy — only show once per session
    const alreadyDismissed = sessionStorage.getItem("device-popup-dismissed");

    if (isMobileOrTablet && !alreadyDismissed) {
      // Small delay so the page loads first
      const timer = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setClosing(true);
    sessionStorage.setItem("device-popup-dismissed", "true");
    setTimeout(() => setShow(false), 500);
  };

  if (!show) return null;

  return (
    <div
      onClick={dismiss}
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        opacity: closing ? 0 : 1,
        transition: "opacity 0.5s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 28,
          padding: "44px 36px 36px",
          maxWidth: 380,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15)",
          backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
          transform: closing ? "scale(0.9) translateY(20px)" : "scale(1) translateY(0)",
          transition: "transform 0.5s ease, opacity 0.5s ease",
          opacity: closing ? 0 : 1,
        }}
      >
        {/* Laptop icon */}
        <div style={{ fontSize: 48, marginBottom: 20, lineHeight: 1 }}>💻</div>

        <h3 style={{
          fontSize: 20, fontWeight: 700, color: "#fff",
          marginBottom: 10, letterSpacing: "-0.02em", lineHeight: 1.3,
        }}>
          Best on a laptop
        </h3>

        <p style={{
          fontSize: 14, color: "rgba(255,255,255,0.55)", fontWeight: 300,
          lineHeight: 1.7, marginBottom: 28, letterSpacing: "0.01em",
        }}>
          This experience was crafted with cinematic animations, parallax effects, and interactive elements that shine on a larger screen.
        </p>

        <button
          onClick={dismiss}
          style={{
            background: "linear-gradient(135deg, #e8c547, #c9a227)",
            color: "#0a0a0f", border: "none", borderRadius: 100,
            padding: "13px 36px", fontSize: 12, fontWeight: 700,
            letterSpacing: "0.15em", textTransform: "uppercase",
            cursor: "pointer", fontFamily: "var(--font)",
            boxShadow: "0 8px 24px rgba(232,197,71,0.25)",
          }}
        >
          Got it, continue
        </button>

        <p style={{
          marginTop: 16, fontSize: 11, color: "rgba(255,255,255,0.25)",
          letterSpacing: "0.05em", fontStyle: "italic",
        }}>
          tap anywhere to dismiss
        </p>
      </div>
    </div>
  );
}
