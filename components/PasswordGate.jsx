"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
const Player = dynamic(() => import("@lottiefiles/react-lottie-player").then(m => m.Player), { ssr: false });

const CORRECT_PASSWORD = "15052006";

// Known working public Lottie URLs
const DOG_SRC = "/animations/dog.json";

// Orbs pre-seeded
const ORB_SEEDS = [
  [15, 80, 2, 12, 10], [30, 90, 1.5, 15, 14], [45, 85, 2.5, 18, 12],
  [60, 95, 1.8, 14, 16], [75, 80, 2.2, 16, 11], [85, 90, 1.5, 10, 15],
  [10, 50, 2.1, 13, 13], [25, 40, 1.6, 11, 17], [40, 60, 2.4, 17, 10],
  [55, 35, 1.9, 14, 14], [70, 55, 2.3, 12, 18], [90, 45, 1.7, 15, 12],
  [5, 20, 2.0, 16, 11], [20, 15, 1.4, 10, 15], [35, 25, 2.6, 18, 9],
  [50, 10, 1.8, 13, 16], [65, 30, 2.2, 11, 13], [80, 15, 1.5, 14, 14],
  [95, 25, 2.5, 17, 10]
];

const HandwrittenName = () => (
  <motion.svg
    viewBox="0 0 300 120"
    className="handwriting-svg"
    style={{ width: 220, height: "auto", marginBottom: 10 }}
  >
    <defs>
      <linearGradient id="handwriting-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#ffb7c5" />
        <stop offset="100%" stopColor="#e8c547" />
      </linearGradient>
    </defs>
    <motion.path
      d="M40,80 Q20,80 20,50 Q20,20 45,20 Q70,20 70,50 L70,100 Q70,120 45,120 Q20,120 20,100 M85,85 Q70,85 70,68 Q70,50 88,50 Q105,50 105,68 L105,85 Q105,90 115,85 M125,85 Q145,85 145,72 Q145,60 132,60 Q120,60 120,48 Q120,35 140,35 M160,15 L160,85 Q160,65 180,65 Q200,65 200,85 M215,50 L215,85 M215,32 A2,2 0 1,1 216,32 M230,15 L230,85 M230,65 L255,45 M230,70 L255,90 M275,85 Q260,85 260,68 Q260,50 278,50 Q295,50 295,68 L295,85 Q295,90 305,85"
      fill="none"
      strokeWidth="3.5"
      strokeLinecap="round"
      className="handwriting-path"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{
        duration: 3.5,
        ease: [0.45, 0, 0.55, 1],
        delay: 1.0
      }}
    />
  </motion.svg>
);

// Confetti burst - made elegant and soft
function burst(x, y) {
  const colors = ["#ffb7c5", "#ffd98a", "#fde8d8", "#ffffff", "#ff8fab"];
  const confettiContainer = document.body;
  for (let i = 0; i < 40; i++) {
    const el = document.createElement("div");
    el.className = "confetti-piece";
    const angle = (Math.PI * 2 / 40) * i + (Math.random() - 0.5) * 0.4;
    const dist = Math.random() * 200 + 50;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const dur = (Math.random() * 0.8 + 1.2).toFixed(2);
    const size = Math.floor(Math.random() * 6 + 4);
    el.style.cssText = `
      left:${x}px; top:${y}px;
      background:${color};
      width:${size}px; height:${size}px;
      border-radius: 50%;
      box-shadow: 0 0 10px ${color};
      animation-duration:${dur}s;
      transform:translate(${Math.cos(angle) * dist}px,${Math.sin(angle) * dist}px) scale(${Math.random() * 1.5});
      opacity:0;
      transition: transform ${dur}s cubic-bezier(0.25, 1, 0.5, 1), opacity ${dur}s ease-out;
    `;
    confettiContainer.appendChild(el);
    requestAnimationFrame(() => {
      el.style.opacity = "0.8";
      setTimeout(() => el.remove(), parseFloat(dur) * 1000 + 100);
    });
  }
}

export default function PasswordGate() {
  const [password, setPassword] = useState("");
  const [status,      setStatus]      = useState("idle");   // idle | wrong | correct | leaving
  const [message,     setMessage]     = useState("");
  const [isShaking,   setIsShaking]   = useState(false);
  const [petState,    setPetState]    = useState("idle");   // idle | sad | happy
  const [mounted,     setMounted]     = useState(false);

  const inputRef   = useRef(null);
  const dogRef     = useRef(null);
  const btnRef     = useRef(null);

  useEffect(() => {
    setMounted(true);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (petState === "happy") {
      dogRef.current?.setPlayerSpeed?.(1.5);
    } else if (petState === "sad") {
      dogRef.current?.setPlayerSpeed?.(0.5);
    } else {
      dogRef.current?.setPlayerSpeed?.(0.8);
    }
  }, [petState]);

  const handleUnlock = useCallback(() => {
    if (status !== "idle") return;

    if (password === CORRECT_PASSWORD) {
      setStatus("correct");
      setMessage("Perfect. Welcome in ❤️");
      setPetState("happy");
      document.cookie = "hbd_unlocked=9f3a2b7e; path=/; max-age=3600; SameSite=Lax";
      if (btnRef.current) {
        const r = btnRef.current.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + r.height / 2);
      }
      setTimeout(() => {
        setStatus("leaving");
        setTimeout(() => { window.location.href = "/home"; }, 1200);
      }, 1600);
    } else {
      setStatus("wrong");
      setMessage("That doesn't seem right...");
      setPetState("sad");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
      setTimeout(() => {
        setPetState("idle");
        setStatus("idle");
        setMessage("");
      }, 2000);
    }
  }, [password, status]);

  const handleKey = (e) => { if (e.key === "Enter") handleUnlock(); };

  // ── Pet movement variants
  const petLeftVariants = {
    idle: { y: 0, rotate: 0, scale: 1, transition: { type: "spring", stiffness: 60, damping: 20 } },
    sad: { y: 15, rotate: -5, scale: 0.95, transition: { type: "spring", stiffness: 100, damping: 15 } },
    happy: { y: -30, rotate: 5, scale: 1.05, transition: { type: "spring", stiffness: 150, damping: 15 } },
    leaving: { y: -80, opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } },
  };
  const petRightVariants = {
    idle: { y: 0, rotate: 0, scale: 1, transition: { type: "spring", stiffness: 60, damping: 20 } },
    sad: { y: 15, rotate: 5, scale: 0.95, transition: { type: "spring", stiffness: 100, damping: 15 } },
    happy: { y: -30, rotate: -5, scale: 1.05, transition: { type: "spring", stiffness: 150, damping: 15 } },
    leaving: { y: -80, opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } },
  };

  const currentPetState = status === "leaving" ? "leaving" : petState;

  return (
    <div className={`scene ${status === "leaving" ? "leaving" : ""}`}>

      {/* ── Aurora Background ── */}
      <div className="aurora-bg" />

      {/* ── Floating Orbs ── */}
      {ORB_SEEDS.map(([left, top, scale, delay, dur], i) => (
        <motion.div
          key={i}
          className="drifting-orb"
          initial={{ y: top + "vh", x: left + "vw", opacity: 0, scale: 0 }}
          animate={{
            y: [top + "vh", (top - 30) + "vh"],
            x: [left + "vw", (left + (Math.random() * 10 - 5)) + "vw"],
            opacity: [0, 0.4, 0],
            scale: [0, scale, 0]
          }}
          transition={{
            duration: dur,
            repeat: Infinity,
            delay: delay,
            ease: "easeInOut"
          }}
          style={{ width: 100, height: 100, marginLeft: -50, marginTop: -50 }}
        />
      ))}

      {/* ── Dog — bottom left ── */}
      <motion.div
        className="pet-wrap left"
        variants={petLeftVariants}
        animate={currentPetState}
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: 240, marginBottom: -40 }}
      >
        <div className="pet-glow" />
        <Player
          ref={dogRef}
          src={DOG_SRC}
          autoplay
          loop
          style={{ width: "100%", height: "auto", filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))" }}
        />
      </motion.div>

      {/* ── Main Premium Card ── */}
      <motion.div
        className="premium-glass-card"
        initial={{ opacity: 0, scale: 0.95, y: 30, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          For Your Eyes Only
        </motion.p>

        {mounted && <HandwrittenName />}

        <motion.p
          className="subtext-premium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          I made something special, just for you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "100%" }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className={`password-container ${isShaking ? "shake" : ""}`}
          style={{ width: "100%", position: "relative" }}
        >
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKey}
            placeholder="enter the secret"
            className="elegant-input"
            autoComplete="off"
            spellCheck="false"
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {message ? (
            <motion.p
              key={message}
              className={`status-msg ${status === "correct" ? "success" : "error"}`}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.3 }}
            >
              {message}
            </motion.p>
          ) : (
            <div className="status-msg" />
          )}
        </AnimatePresence>

        <motion.button
          ref={btnRef}
          onClick={handleUnlock}
          className={`unlock-btn-premium ${status === "correct" ? "glow-ring" : ""}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          whileTap={{ scale: 0.98 }}
        >
          {status === "correct" ? "Opening..." : "Unlock"}
        </motion.button>

        <motion.p
          className="hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 1 }}
        >
          hint: it's something we both know
        </motion.p>
      </motion.div>

      {/* Signature */}
      <motion.p
        className="signature"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1.5 }}
      >
        made with ♡ for yash
      </motion.p>
    </div>
  );
}
