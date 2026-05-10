"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

const PARAGRAPHS = [
  "Hey, Yashh!!.",
  "I've been trying to figure out how to say this for a while now —",
  "and I still don't think I have the right words.",
  "But I'm going to try anyway, because you deserve at least that much.",
  "You handle things most people would crumble under.",
  "The family, the responsibilities, the bike, the car, the world —",
  "all of it, quietly, without making it anyone else's burden.",
  "That kind of strength isn't given. It's built.",
  "And I've watched you build it, piece by piece, without asking for applause.",
  "You understand people before they finish their sentences.",
  "You know when to stay and when to walk forward.",
  "There's a kind of rare clarity in that.",
  "You have so much inside you —",
  "things you want to say, feelings you carry quietly —",
  "and you hold most of it together on your own.",
  "I see that.",
  "I genuinely admire who you are, Yashh!!.",
  "Not who you're becoming — who you already are, right now.",
  "She likes flowers, but she doesn't know she's a garden herself.",
  "can lose anything but not you and i afraid of losing u",
  "நீ என் வாழ்க்கையில் வந்த பிறகு தான், நானாகவே வாழ ஆரம்பித்தேன். என் வாழ்வின் அழகிய மாற்றம் நீ!",
  "Happy Birthday.",
  "— Raghul",
];

const CinematicLine = ({ text, i }) => {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  
  const opacity = useTransform(scrollYProgress, [0.2, 0.38, 0.62, 0.78], [0, 1, 1, 0]);
  const blurRaw = useTransform(scrollYProgress, [0.15, 0.38, 0.62, 0.85], [16, 0, 0, 16]);
  const scale = useTransform(scrollYProgress, [0.1, 0.45, 0.55, 0.9], [0.92, 1, 1, 1.06]);
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const isSignature = text.startsWith("— ");
  const isOpener = text === "Hey, Yashh!!.";
  const isHappy = text.startsWith("Happy");

  return (
    <div ref={ref} style={{ 
      height: "80vh",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "0 20px" 
    }}>
      <motion.p
        style={{
          opacity, scale, y,
          filter: useTransform(blurRaw, b => `blur(${b}px)`),
          fontFamily: isSignature || isOpener || isHappy ? "var(--font-heading)" : "var(--font-body)",
          fontSize: isOpener || isHappy
            ? "clamp(28px, 5vw, 52px)"
            : isSignature
            ? "clamp(20px, 3vw, 32px)"
            : "clamp(18px, 3.2vw, 34px)",
          fontWeight: isOpener || isHappy ? 600 : isSignature ? 400 : 300,
          fontStyle: isSignature || isOpener || isHappy ? "italic" : "normal",
          color: isSignature
            ? "rgba(232,197,71,0.8)"
            : isOpener || isHappy
            ? "rgba(255,255,255,0.95)"
            : "rgba(255,255,255,0.8)",
          textAlign: "center",
          maxWidth: 860,
          lineHeight: 1.65,
          letterSpacing: isOpener ? "0.04em" : isSignature ? "0.08em" : "0.01em",
          textShadow: isOpener || isHappy
            ? "0 4px 40px rgba(255,255,255,0.25)"
            : "0 4px 20px rgba(255,255,255,0.1)"
        }}
      >
        {text}
      </motion.p>
    </div>
  );
};

export default function LetterPage() {
  const containerRef = useRef(null);
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.02, 0.07, 0.02]);

  // Auto-play logic
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // 1. Initial play attempt (muted)
    audio.volume = 0.45;
    audio.muted = true;
    audio.play().catch(() => {
      console.log("Autoplay blocked, waiting for interaction");
    });

    // 2. Handler to unmute and sync state
    const handleUnmute = () => {
      if (audio.muted) {
        audio.muted = false;
        setIsMuted(false);
        // Ensure it's playing (in case play() was blocked initially)
        audio.play().catch(() => {});
      }
    };

    // 3. Global listeners for first interaction
    window.addEventListener("click", handleUnmute, { once: true });
    window.addEventListener("scroll", handleUnmute, { once: true });
    window.addEventListener("touchstart", handleUnmute, { once: true });

    // 4. Cleanup
    return () => {
      audio.pause();
      window.removeEventListener("click", handleUnmute);
      window.removeEventListener("scroll", handleUnmute);
      window.removeEventListener("touchstart", handleUnmute);
    };
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Toggle state and DOM together
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    audio.muted = newMuteState;
    
    if (!newMuteState) {
      audio.play().catch(() => {});
    }
  };

  return (
    <div ref={containerRef} style={{ background: "#000", minHeight: "100vh", position: "relative" }}>
      
      {/* Background Audio — place your song at public/audio/letter-song.mp3 */}
      <audio ref={audioRef} src="/audio/letter-song.mp3" type="audio/mpeg" loop preload="auto" />

      {/* Floating Mute Toggle */}
      <motion.button
        onClick={toggleMute}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: "fixed", bottom: 28, left: 28, zIndex: 100,
          width: 48, height: 48, borderRadius: "50%",
          background: isMuted ? "rgba(255,255,255,0.06)" : "rgba(232,197,71,0.15)",
          border: `1px solid ${isMuted ? "rgba(255,255,255,0.1)" : "rgba(232,197,71,0.3)"}`,
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: 20,
          boxShadow: !isMuted ? "0 0 20px rgba(232,197,71,0.15)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        {isMuted ? "🔇" : "🎵"}
      </motion.button>

      {/* Animated sound bars when playing */}
      {!isMuted && (
        <div style={{
          position: "fixed", bottom: 82, left: 38, zIndex: 99,
          display: "flex", gap: 2, alignItems: "flex-end", height: 12,
        }}>
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ height: ["4px", "12px", "6px", "10px", "4px"] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15, ease: "easeInOut" }}
              style={{ width: 2, borderRadius: 1, background: "rgba(232,197,71,0.6)" }}
            />
          ))}
        </div>
      )}

      {/* Deep cinematic background glow */}
      <motion.div style={{ 
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", 
        width: "120vw", height: "120vh", borderRadius: "50%", 
        background: "radial-gradient(circle, rgba(232,197,71,1) 0%, transparent 60%)", 
        opacity: bgOpacity, pointerEvents: "none", zIndex: 0 
      }} />

      {/* Cinematic Film Grain Overlay */}
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
        pointerEvents: "none", zIndex: 1
      }} />

      <div style={{ position: "relative", zIndex: 10 }}>
        
        {/* Cinematic Letter Cover Section */}
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <p className="label" style={{ color: "rgba(232,197,71,0.5)", marginBottom: 24, letterSpacing: "0.4em" }}>private transmission</p>
            <h1 style={{ 
              fontSize: "clamp(48px, 10vw, 120px)", 
              fontFamily: "var(--font-heading)", 
              fontStyle: "italic",
              color: "#fff",
              lineHeight: 1,
              marginBottom: 16
            }}>
              For Yashh!!
            </h1>
            <p className="body-md" style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>
              A story that words can barely hold.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 3, delay: 2 }}
            style={{ position: "absolute", bottom: "10%" }}
          >
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(255,255,255,0.3)" }}>
              scroll to open
            </p>
          </motion.div>
        </div>
        
        {PARAGRAPHS.map((text, i) => (
          <CinematicLine key={i} text={text} i={i} />
        ))}

        {/* Footer Nav */}
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: "20vh" }}>
          <p style={{ color: "rgba(255,255,255,0.2)", marginBottom: 40, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: 12 }}>end of tape</p>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", zIndex: 20 }}>
            <Link href="/gallery" className="btn-ghost" style={{ padding: "20px 48px", borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)" }}>Memories 🖼️</Link>
            <Link href="/lands" className="btn-gold" style={{ padding: "20px 48px", background: "rgba(232,197,71,0.9)", color: "#000" }}>Lands 🌍</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
