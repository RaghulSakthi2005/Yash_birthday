"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Load Lottie player client-side only
const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then(m => m.Player),
  { ssr: false }
);

// Per-page pet config: position and size variations
const PAGE_CONFIG = {
  "/home":      { dogSide: "left",  dogSize: 180, dogBottom: -20 },
  "/letter":    { dogSide: "left",  dogSize: 130, dogBottom: -10 },
  "/lands":     { dogSide: "left",  dogSize: 160, dogBottom: -15 },
  "/quotes":    { dogSide: "right", dogSize: 150, dogBottom: -10 },
  "/chat":      { dogSide: "left",  dogSize: 140, dogBottom: -10 },
  "/countdown": { dogSide: "left",  dogSize: 170, dogBottom: -20 },
  "/deserves":  { dogSide: "left",  dogSize: 160, dogBottom: -15 },
  "/gallery":   { dogSide: "left",  dogSize: 150, dogBottom: -10 },
};
const DEFAULT_CFG = { dogSide: "left", dogSize: 160, dogBottom: -20 };

export default function FloatingPets() {
  const pathname   = usePathname();
  const dogCtrl = useAnimation();

  const cfg = PAGE_CONFIG[pathname] || DEFAULT_CFG;

  // Occasional happy bounce on page change
  useEffect(() => {
    dogCtrl.set({ y: 0, rotate: 0, scale: 1 });
    dogCtrl.start({ y: [0, -28, 4, -14, 0], scale: [1, 1.1, 0.97, 1.05, 1], transition: { duration: 0.8, ease: "easeOut" } });
  }, [pathname]);

  // Periodic idle reactions (every ~8s)
  useEffect(() => {
    const reactions = [
      // Dog wag
      () => dogCtrl.start({ rotate: [0, -5, 5, -4, 3, 0], transition: { duration: 0.6 } }),
      // Peek up
      () => dogCtrl.start({ y: -12, transition: { duration: 0.3, yoyo: 1, repeat: 1 } }),
    ];
    const id = setInterval(() => {
      const fn = reactions[Math.floor(Math.random() * reactions.length)];
      fn();
    }, 7500 + Math.random() * 4000);
    return () => clearInterval(id);
  }, [dogCtrl]);

  const petStyle = (side, size, bottom, offset = 0) => ({
    position: "fixed",
    bottom: bottom,
    [side]: `clamp(-10px, ${2 + offset}vw, 60px)`,
    zIndex: 40,
    width: size,
    pointerEvents: "none",
    userSelect: "none",
  });

  if (pathname === "/tree") return null;

  return (
    <>
      {/* ── DOG ── */}
      <motion.div
        animate={dogCtrl}
        initial={{ y: 80, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, type: "spring", stiffness: 90, damping: 18 }}
        style={petStyle(cfg.dogSide, cfg.dogSize, cfg.dogBottom)}
      >
        <Player
          src="/animations/dog.json"
          autoplay loop
          style={{ width: "100%", height: "auto" }}
        />
      </motion.div>
    </>
  );
}
