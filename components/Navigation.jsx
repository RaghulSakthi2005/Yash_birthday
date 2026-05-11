"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { num: "01", label: "Story", href: "/home", emoji: "✦" },
  { num: "02", label: "Letter", href: "/letter", emoji: "💌" },
  { num: "03", label: "Lands", href: "/lands", emoji: "🌍" },
  { num: "04", label: "Playlist", href: "/playlist", emoji: "🎵" },
  { num: "05", label: "Chat", href: "/chat", emoji: "💬" },
  { num: "06", label: "Memories", href: "/gallery", emoji: "🖼" },
  { num: "07", label: "The Tree", href: "/tree", emoji: "🌳" },
  { num: "08", label: "Soul", href: "/soul", emoji: "✨" },
];

const SPEED_LINES = [8, 22, 38, 54, 68, 82];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);
  // Block scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ── Hamburger button ── */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        style={{
          position: "fixed", top: 28, right: 32, zIndex: 1000,
          width: 52, height: 52, borderRadius: "50%",
          background: open ? "rgba(232,197,71,0.15)" : "rgba(255,255,255,0.06)",
          border: `1px solid ${open ? "rgba(232,197,71,0.4)" : "rgba(255,255,255,0.1)"}`,
          backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 6,
          cursor: "pointer", transition: "all 0.3s ease",
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
      >
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            animate={{
              rotate: i === 0 ? (open ? 45 : 0) : i === 2 ? (open ? -45 : 0) : 0,
              translateY: i === 0 ? (open ? 12 : 0) : i === 2 ? (open ? -12 : 0) : 0,
              opacity: i === 1 ? (open ? 0 : 1) : 1,
              width: i === 1 ? (open ? 0 : 22) : 22,
            }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "block", height: 2, borderRadius: 2,
              background: open ? "#e8c547" : "rgba(255,255,255,0.8)",
              transformOrigin: "center",
            }}
          />
        ))}
      </motion.button>

      {/* ── Full-screen overlay ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="nav-overlay"
            initial={{ clipPath: "circle(0% at calc(100% - 58px) 54px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 58px) 54px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 58px) 54px)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed", inset: 0, zIndex: 900,
              background: "radial-gradient(ellipse at 80% 20%, rgba(20,15,40,0.98) 0%, rgba(8,6,16,0.99) 100%)",
              backdropFilter: "blur(32px)",
              display: "flex", alignItems: "center",
            }}
          >
            {/* Speed lines (racing effect) */}
            {SPEED_LINES.map((top, i) => (
              <motion.div
                key={i}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: [0, 0.6, 0] }}
                transition={{ duration: 0.8, delay: i * 0.06, ease: "easeOut" }}
                style={{
                  position: "absolute", top: `${top}%`, left: 0, right: 0,
                  height: 1,
                  background: `linear-gradient(90deg, transparent, rgba(232,197,71,${0.15 + i * 0.04}), transparent)`,
                  transformOrigin: "left",
                }}
              />
            ))}

            {/* Gold checker strip on left */}
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0, width: 6,
              background: "repeating-linear-gradient(180deg, #e8c547 0px, #e8c547 12px, transparent 12px, transparent 24px)",
              opacity: 0.4,
            }} />

            {/* Nav content */}
            <div style={{ width: "100%", padding: "0 clamp(40px, 10vw, 160px)", paddingTop: 80 }}>

              {/* Label */}
              <motion.p
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="label"
                style={{ color: "rgba(232,197,71,0.5)", marginBottom: 48 }}
              >
                navigate ✦ explore
              </motion.p>

              {/* Items */}
              <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {NAV_ITEMS.map((item, i) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      transition={{ delay: 0.18 + i * 0.055, ease: [0.22, 1, 0.36, 1] }}
                      onHoverStart={() => setHovered(i)}
                      onHoverEnd={() => setHovered(null)}
                      style={{ position: "relative" }}
                    >
                      <Link href={item.href} style={{ textDecoration: "none" }}>
                        <motion.div
                          animate={{ x: hovered === i ? 12 : 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          style={{
                            display: "flex", alignItems: "baseline", gap: 20,
                            padding: "12px 0",
                            borderBottom: "1px solid rgba(255,255,255,0.04)",
                            cursor: "pointer",
                          }}
                        >
                          {/* Number */}
                          <span style={{
                            fontSize: 11, fontWeight: 600, letterSpacing: "0.15em",
                            color: isActive ? "#e8c547" : "rgba(232,197,71,0.35)",
                            minWidth: 28, fontVariantNumeric: "tabular-nums",
                            transition: "color 0.25s",
                          }}>
                            {item.num}
                          </span>

                          {/* Label */}
                          <span style={{
                            fontSize: "clamp(28px, 4.5vw, 52px)", fontWeight: 700,
                            letterSpacing: "-0.02em", lineHeight: 1.1,
                            color: isActive ? "#e8c547" : hovered === i ? "#fff" : "rgba(255,255,255,0.75)",
                            transition: "color 0.2s",
                          }}>
                            {item.label}
                          </span>

                          {/* Speed line on hover */}
                          <AnimatePresence>
                            {hovered === i && (
                              <motion.div
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: 1, opacity: 1 }}
                                exit={{ scaleX: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                style={{
                                  flex: 1, height: 1,
                                  background: "linear-gradient(90deg, rgba(232,197,71,0.6), transparent)",
                                  transformOrigin: "left",
                                  alignSelf: "center",
                                  marginLeft: 8,
                                }}
                              />
                            )}
                          </AnimatePresence>

                          {/* Emoji */}
                          <motion.span
                            animate={{ opacity: hovered === i ? 1 : 0.3, scale: hovered === i ? 1.2 : 1 }}
                            style={{ fontSize: 18, marginLeft: "auto" }}
                          >
                            {item.emoji}
                          </motion.span>
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Bottom Quote */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                style={{ marginTop: 80, textAlign: "center" }}
              >
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, fontStyle: "italic", letterSpacing: "0.1em" }}>
                  "Proud to say that i know Yash in my Life"
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
