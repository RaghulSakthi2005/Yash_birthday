"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

// A 🏎️ racing car that zooms left→right every 10-15s
// Plus a trail of speed lines behind it
export default function RacingCar() {
  const [visible, setVisible] = useState(false);
  const [top, setTop]         = useState("72%");

  const pathname = usePathname();

  useEffect(() => {
    // Random vertical lane between 55% and 80%
    const schedule = () => {
      const delay = 10000 + Math.random() * 8000; // 10-18s gap
      return setTimeout(() => {
        setTop(`${55 + Math.random() * 22}%`);
        setVisible(true);
        // Hide after animation completes (1.6s)
        setTimeout(() => {
          setVisible(false);
          schedule(); // schedule next pass
        }, 1700);
      }, delay);
    };
    const id = schedule();
    return () => clearTimeout(id);
  }, []);

  if (pathname === "/tree") return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="racing-car"
          initial={{ x: "-14vw", opacity: 0 }}
          animate={{ x: "110vw", opacity: [0, 1, 1, 0.6] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.2, 0.8, 0.8, 1] }}
          style={{
            position: "fixed",
            top,
            left: 0,
            zIndex: 45,
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            gap: 0,
          }}
        >
          {/* Speed trail lines */}
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: [0, 0.7, 0] }}
              transition={{ duration: 1.0, delay: i * 0.06, ease: "easeOut" }}
              style={{
                position: "absolute",
                right: 28 + i * 24,
                top: "50%",
                transform: "translateY(-50%)",
                width: 80 - i * 20,
                height: 2,
                background: `linear-gradient(90deg, transparent, rgba(232,197,71,${0.7 - i * 0.2}))`,
                transformOrigin: "right",
                borderRadius: 2,
              }}
            />
          ))}

          {/* The car */}
          <span style={{ fontSize: 42, lineHeight: 1, filter: "drop-shadow(0 0 12px rgba(232,197,71,0.8))" }}>
            🏎️
          </span>

          {/* Dog riding shotgun (tiny) */}
          <motion.span
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 0.35, ease: "easeInOut" }}
            style={{ fontSize: 20, lineHeight: 1, marginLeft: -8, marginBottom: 6 }}
          >
            🐶
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
