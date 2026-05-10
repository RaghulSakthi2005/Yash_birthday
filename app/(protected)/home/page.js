"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import Link from "next/link";
import FadingVideo from "@/components/FadingVideo";
import BlurText from "@/components/BlurText";
import initialFramesData from "../../../data/frames.json";

const CHAPTERS = [
  { year: "Drive", title: "Breaking the Comfort Zone", body: "You never settled for what was easy. While others stayed comfortable, you carved your own path. Whether it was learning to drive the car and ride the bike, or stepping up when things got hard, your independence has always been your superpower." },
  { year: "Anchor", title: "Shouldering the World", body: "Responsibility isn't something you were just handed; it's a role you embraced. You became the anchor for your family, handling everything on your own with a grace that makes the heaviest burdens look entirely effortless." },
  { year: "Grace", title: "Understanding & Moving On", body: "You navigate life with an incredible, mature empathy. You deeply understand your friends, and when the time comes, you know exactly how to gracefully move forward without letting anything hold you back." },
  { year: "Silent", title: "The Quiet Resilience", body: "I know you have a thousand things you want to say, yet you so often choose to handle everything internally. You carry the world in silence, facing life's chaos with a quiet, unyielding strength." },
  { year: "Twenty", title: "The Strongest Ever", body: "To the girl I admire more than words can express: you are the strongest person I know. Your growth, your resilience, and your ability to do it all on your own is breathtaking. This is your true story." },
];

const PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  id: i, left: `${(i * 17.3) % 100}%`, top: `${(i * 11.7 + 5) % 90}%`,
  size: (i % 3) + 1.5, delay: `${(i * 0.37) % 4}s`, dur: `${3 + (i % 4)}s`,
  opacity: 0.1 + (i % 10) * 0.025,
}));

const BUBBLES = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  left: `${(i * 23.7) % 100}%`,
  size: 50 + (i % 5) * 30, // 50px to 170px
  delay: (i % 7) * 2, // 0 to 12s delay
  dur: 20 + (i % 5) * 8, // 20 to 52s float duration
  opacity: 0.05 + (i % 3) * 0.03, // 0.05 to 0.11 opacity
}));

function Chapter({ ch, i }) {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({ 
    target: ref, 
    offset: ["start center", "center center"] 
  });

  const { scrollYProgress: exitProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(exitProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);
  const y = useTransform(exitProgress, [0.1, 0.3], [80, 0]);

  const nodeScale = useTransform(scrollYProgress, [0, 1], [0.5, 1.5]);
  const nodeOpacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
  const nodeGlow = useTransform(scrollYProgress, [0, 1], ["0px 0px 0px rgba(232,197,71,0)", "0px 0px 20px rgba(232,197,71,0.8)"]);

  const isRight = i % 2 === 1;
  // Each card gets a slightly unique organic tilt
  const tilt = ["-0.8deg", "0.5deg", "-0.4deg", "1deg", "-0.6deg"][i % 5];
  const accentWidths = [42, 28, 60, 36, 50];
  const pullQuotes = [
    "strength isn't always loud.",
    "she carries whole worlds.",
    "she knows when to walk forward.",
    "some battles are fought in silence.",
    "twenty years of being herself.",
  ];

  return (
    <motion.div ref={ref}
      className="chapter-item"
      style={{ 
        display: "flex", 
        justifyContent: isRight ? "flex-start" : "flex-end",
        width: "50%",
        marginLeft: isRight ? "50%" : "0",
        padding: isRight ? "0 0 0 60px" : "0 60px 0 0",
        position: "relative",
        opacity,
        y,
        marginBottom: 180,
      }}>
      
      {/* Spine node */}
      <motion.div className="chapter-node" style={{
        position: "absolute",
        [isRight ? "left" : "right"]: -8,
        top: "50%", width: 16, height: 16, borderRadius: "50%",
        background: "#e8c547", scale: nodeScale, opacity: nodeOpacity,
        boxShadow: nodeGlow, zIndex: 20, transform: "translateY(-50%)"
      }} />

      <motion.div className="chapter-connector" style={{
        position: "absolute",
        [isRight ? "left" : "right"]: 0,
        top: "50%", width: 40, height: 1,
        background: "linear-gradient(90deg, rgba(232,197,71,0.5), transparent)",
        transform: isRight ? "translateY(-50%)" : "translateY(-50%) rotate(180deg)",
        opacity: nodeOpacity
      }} />

      {/* Organic, human-feel layout */}
      <motion.div
        className="chapter-content"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          position: "relative", zIndex: 10, width: "100%", maxWidth: 460,
          transform: `rotate(${tilt})`,
          padding: "4px 0",
        }}>

        {/* Giant transparent watermark word */}
        <div className="chapter-watermark hidden md:block" style={{
          position: "absolute", top: -30,
          [isRight ? "right" : "left"]: -20,
          fontSize: "clamp(90px, 13vw, 180px)", fontWeight: 900,
          letterSpacing: "-0.07em", color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.035)",
          lineHeight: 1, pointerEvents: "none", userSelect: "none",
          zIndex: 0, whiteSpace: "nowrap",
          transform: `rotate(${isRight ? 3 : -2}deg)`
        }}>
          {ch.year}
        </div>

        <div style={{
          fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase",
          color: "rgba(232,197,71,0.45)", marginBottom: 12, fontWeight: 500
        }}>
          № {String(i + 1).padStart(2, "0")}
        </div>

        <h3 style={{
          fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 800,
          color: "#f5f0e8", lineHeight: 1.1, letterSpacing: "-0.03em",
          marginBottom: 18,
          paddingLeft: [0, 4, 0, 8, 2][i % 5],
        }}>
          {ch.title}
        </h3>

        <div style={{
          width: accentWidths[i % 5], height: 1.5,
          background: i % 2 === 0
            ? "linear-gradient(90deg, #e8c547 40%, transparent)"
            : "linear-gradient(90deg, #ff6b81 40%, transparent)",
          marginBottom: 18, borderRadius: 1,
          marginLeft: [0, 2, 0, 6, 1][i % 5],
        }} />

        <p style={{
          color: "rgba(245,240,232,0.62)", fontSize: "clamp(13px, 2.5vw, 15px)", lineHeight: 1.95,
          fontWeight: 300, maxWidth: 390, letterSpacing: "0.005em"
        }}>
          {ch.body}
        </p>

        <div style={{
          marginTop: 22,
          paddingLeft: 14,
          borderLeft: `1.5px solid ${i % 2 === 0 ? "rgba(232,197,71,0.2)" : "rgba(255,107,129,0.2)"}`,
          color: "rgba(245,240,232,0.28)",
          fontSize: 12, fontStyle: "italic", lineHeight: 1.75,
          letterSpacing: "0.03em",
          transform: `translateX(${[0, 4, -2, 6, 0][i % 5]}px)`
        }}>
          "{pullQuotes[i % 5]}"
        </div>
      </motion.div>
    </motion.div>
  );
}

function ParallaxFrames({ scrollYProgress, frames, setFrames, isEditMode }) {
  const handleUpload = async (e, id) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("id", id);
    formData.append("file", file);
    
    const res = await fetch("/api/frames", { method: "POST", body: formData });
    if (res.ok) {
      const data = await res.json();
      // Force reload the image by appending a timestamp query string
      setFrames(prev => prev.map(f => f.id === id ? { ...data.frame, src: `${data.frame.src}?t=${Date.now()}` } : f));
    }
  };

  const handlePositionChange = async (e, id) => {
    const objectPosition = e.target.value;
    setFrames(prev => prev.map(f => f.id === id ? { ...f, objectPosition } : f));
    
    const formData = new FormData();
    formData.append("id", id);
    formData.append("objectPosition", objectPosition);
    await fetch("/api/frames", { method: "POST", body: formData });
  };

  return (
    <div className="hidden md:block" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 5, overflow: "hidden" }}>
      {frames.map((frame, index) => {
        const yRange = useTransform(scrollYProgress, [0, 1], [0, -1200 * frame.speed]);
        
        return (
          <motion.div
            key={frame.id}
            className="parallax-frame"
            style={{
              position: "absolute",
              top: frame.position.top,
              left: frame.position.left,
              right: frame.position.right,
              rotate: frame.rotate,
              scale: frame.scale,
              y: yRange,
              pointerEvents: isEditMode ? "auto" : "none"
            }}
          >
            <div className="frame-content">
              {frame.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={frame.src} alt={frame.alt} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: frame.objectPosition || "center", transition: "object-position 0.3s ease" }} 
                  onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                  onLoad={(e) => { e.target.style.display='block'; e.target.nextSibling.style.display='none'; }}
                />
              ) : null}
              <div className="frame-placeholder" style={{ display: frame.src ? 'none' : 'flex' }}>
                <span>{isEditMode ? "Upload Image" : "Upload to public/frames/"}</span>
              </div>
            </div>

            {/* Edit Mode Controls */}
            {isEditMode && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 6, zIndex: 10, backdropFilter: "blur(4px)" }}>
                <label className="btn-gold" style={{ cursor: "pointer", fontSize: 11, padding: "8px 16px", background: "rgba(232,197,71,0.2)", border: "1px solid #e8c547", color: "#fff", borderRadius: 100 }}>
                  Upload New
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleUpload(e, frame.id)} />
                </label>
                <select 
                  value={frame.objectPosition || "center"} 
                  onChange={(e) => handlePositionChange(e, frame.id)}
                  style={{ background: "rgba(0,0,0,0.8)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 4, padding: "6px 10px", fontSize: 11, outline: "none", cursor: "pointer" }}
                >
                  <option value="center">Center</option>
                  <option value="top">Top Focus</option>
                  <option value="bottom">Bottom Focus</option>
                  <option value="left">Left Focus</option>
                  <option value="right">Right Focus</option>
                  <option value="50% 20%">High Center Focus</option>
                  <option value="50% 80%">Low Center Focus</option>
                </select>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export default function StoryPage() {
  const containerRef = useRef(null);
  const [frames, setFrames] = useState(initialFramesData);
  const [isEditMode, setIsEditMode] = useState(false);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y20    = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const scale  = useTransform(scrollYProgress, [0, 0.5], [1, 0.7]);
  const opac   = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const blur   = useTransform(scrollYProgress, [0.1, 0.35], [0, 12]);
  
  // New deep parallax layers
  const yParticles = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const yHeroText = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yOrbs = useTransform(scrollYProgress, [0, 1], [0, -300]);

  const timelineRef = useRef(null);
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"]
  });
  const spineHeight = useTransform(timelineProgress, [0, 1], ["0%", "100%"]);

  // Advanced Mouse Tracking Spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const spotlightY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    mouseX.set(clientX - window.innerWidth / 2);
    mouseY.set(clientY - window.innerHeight / 2);
  };


  return (
    <div ref={containerRef} style={{ background: "var(--bg)", position: "relative", overflowX: "hidden" }}>

      {/* Floating Parallax Orbs */}
      <motion.div style={{ position: "absolute", top: "10%", left: "80%", width: 400, height: 400, background: "rgba(232,197,71,0.02)", filter: "blur(60px)", borderRadius: "50%", y: yOrbs, pointerEvents: "none", zIndex: 0 }} />
      {/* ── CINEMATIC BIRTHDAY HERO ── */}
      <section className="min-h-screen relative overflow-hidden bg-black flex flex-col items-center justify-center">
        {/* Background Video */}
        <FadingVideo
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Hero content layer */}
        <motion.div 
          style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 clamp(16px, 5vw, 24px)", display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 900 }}
        >
          {/* Badge / Label */}
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ delay: 0.4, ease: "easeOut" }}
            className="liquid-glass rounded-full px-4 py-1.5 flex items-center gap-2 mb-8"
          >
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/60">✦ turning twenty ✦</span>
          </motion.div>

          {/* Headline */}
          <div style={{ marginBottom: 40, perspective: 1000 }}>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.9 }}
              style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 300, lineHeight: 1.1,
                letterSpacing: "0.02em", color: "#fff", margin: "0 auto 8px", fontFamily: "var(--font-heading)" }}
            >
              Twenty years of
            </motion.h1>
            
            {/* Staggered Cinematic Letter Reveal */}
            <motion.h1
              className="font-heading italic"
              style={{ fontSize: "clamp(36px, 8vw, 100px)", fontWeight: 800, lineHeight: 1.05,
                letterSpacing: "-0.04em",
                background: "linear-gradient(135deg, #fff 0%, #fde8d8 40%, #e8c547 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                textShadow: "0 10px 40px rgba(232,197,71,0.3)",
                display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.2em" }}
            >
              {"being extraordinary".split(" ").map((word, wordIndex) => (
                <span key={wordIndex} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                  {word.split("").map((char, charIndex) => (
                    <motion.span
                      key={charIndex}
                      initial={{ opacity: 0, y: 40, rotateX: -90 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{ delay: 0.9 + (wordIndex * 6 + charIndex) * 0.05, duration: 0.8, type: "spring", bounce: 0.4 }}
                      style={{ display: "inline-block" }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 1.8, duration: 1 }}
            style={{ fontSize: "clamp(14px, 3vw, 17px)", color: "rgba(245,240,232,0.6)", fontWeight: 300, marginBottom: 48, letterSpacing: "0.02em", maxWidth: 500, padding: "0 8px", fontFamily: "var(--font-body)" }}>
            A story written in moments, memories, and magic.
          </motion.p>

          {/* Ultra-Minimalist Borderless CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 2.1 }}
          >
            <a 
              href="#chapters" 
              className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white/0 backdrop-blur-sm text-white font-medium text-sm tracking-[0.15em] uppercase transition-all hover:bg-white/10 hover:scale-105 active:scale-95"
            >
              Begin the Journey
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </a>
          </motion.div>
        </motion.div>
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
          style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}
            style={{ width: 1, height: 36, background: "linear-gradient(to bottom, rgba(232,197,71,0.5), transparent)" }} />
        </motion.div>
      </section>


      {/* ── PARALLAX FRAMES ── */}
      <ParallaxFrames scrollYProgress={scrollYProgress} frames={frames} setFrames={setFrames} isEditMode={isEditMode} />

      {/* ── EDIT MODE TOGGLE ── */}
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
        {isEditMode ? "Finish Editing" : "Edit Frames"}
      </button>

      {/* ── CHAPTERS ── */}
      <section id="chapters" className="chapters-section" style={{ position: "relative", padding: "140px clamp(24px, 8vw, 140px)", overflow: "hidden" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 10 }}>
          <div style={{ marginBottom: "clamp(80px, 15vw, 160px)", textAlign: "center" }}>
            <p className="label" style={{ color: "rgba(232,197,71,0.5)", marginBottom: 16 }}>the journey</p>
            <h2 style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", marginBottom: 24 }}>
              Chapters of You
            </h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              style={{ fontSize: "clamp(14px, 3vw, 18px)", color: "rgba(232,197,71,0.8)", fontStyle: "italic", maxWidth: 600, margin: "0 auto", lineHeight: 1.6, fontWeight: 300 }}
            >
              "சிரிப்பால் உலகை வெல்லும் உனக்குள், எத்தனை எத்தனை வலிகள்... ஆனாலும் யாருக்காகவும் காத்திருக்காத உன் தைரியம் என் பெரும் வியப்பு!"
            </motion.p>
          </div>
          
          {/* Glowing Central Spine */}
          <div ref={timelineRef} style={{ position: "relative", paddingBottom: 100 }}>
            {/* Spine track */}
            <div className="timeline-spine" style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, transform: "translateX(-50%)", background: "rgba(255,255,255,0.05)" }} />
            {/* Animated filled spine */}
            <motion.div className="timeline-spine-fill" style={{ position: "absolute", left: "50%", top: 0, width: 2, height: spineHeight, transform: "translateX(-50%)", background: "linear-gradient(to bottom, #e8c547, #ffb7c5, #22d3ee)", boxShadow: "0 0 20px rgba(232,197,71,0.5)" }} />

            {CHAPTERS.map((ch, i) => <Chapter key={i} ch={ch} i={i} />)}
          </div>
        </div>

        {/* ── THOUGHTFUL QUOTE SECTION ── */}
        <div style={{ maxWidth: 900, margin: "160px auto 100px", padding: "0 24px", position: "relative", zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="liquid-glass-strong"
            style={{
              padding: "clamp(40px, 8vw, 80px) clamp(24px, 6vw, 60px)",
              borderRadius: "32px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Dramatic Quote Marks */}
            <div style={{ position: "absolute", top: -20, left: 10, fontSize: "clamp(120px, 20vw, 240px)", color: "rgba(255,255,255,0.03)", fontFamily: "Georgia, serif", lineHeight: 1, pointerEvents: "none" }}>&ldquo;</div>
            <div style={{ position: "absolute", bottom: -80, right: 10, fontSize: "clamp(120px, 20vw, 240px)", color: "rgba(255,255,255,0.03)", fontFamily: "Georgia, serif", lineHeight: 1, pointerEvents: "none" }}>&rdquo;</div>
            
            <motion.p 
              initial={{ opacity: 0, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.5, delay: 0.2 }}
              viewport={{ once: true }}
              style={{ fontSize: "clamp(15px, 3vw, 18px)", color: "rgba(245,240,232,0.6)", fontWeight: 300, fontStyle: "italic", letterSpacing: "0.06em", textTransform: "lowercase" }}
            >
              born too late to see the dinosaurs,<br className="hidden sm:block" />
              too early to see flying cars...
            </motion.p>
            
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
              style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, rgba(232,197,71,0.6), transparent)", margin: "32px auto", transformOrigin: "center" }} 
            />

            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.8 }}
              viewport={{ once: true }}
              style={{ fontSize: "clamp(26px, 5vw, 44px)", color: "#fff", fontWeight: 400, fontFamily: "var(--font-heading)", fontStyle: "italic", lineHeight: 1.25 }}
            >
              but just in time to meet the <br/>
              <span style={{ 
                background: "linear-gradient(135deg, #e8c547, #ffb7c5, #ff6b81)", 
                WebkitBackgroundClip: "text", 
                WebkitTextFillColor: "transparent",
                fontWeight: 600,
                padding: "0 4px"
              }}>most amazing person (You)</span>.
            </motion.h3>
          </motion.div>
        </div>

        <div style={{ textAlign: "center", position: "relative", zIndex: 10, paddingBottom: 40 }}>
          <Link href="/letter" className="btn-gold" style={{ padding: "clamp(14px, 3vw, 20px) clamp(28px, 6vw, 48px)", fontSize: "clamp(13px, 3vw, 16px)", letterSpacing: "0.05em" }}>Continue to the Letter 💌</Link>
        </div>
      </section>
    </div>
  );
}
