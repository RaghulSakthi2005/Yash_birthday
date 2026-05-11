"use client";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const QUOTE_PARTS = [
  {
    title: "SOLITUDE",
    text: "I know how many things you handled all by yourself in life…",
    subtext: "Without anyone fully understanding you, without telling anyone everything you felt, you carried your pain quietly.",
    color: "bg-[#e8c547]",
    img: "/soul_strength.png",
    size: "col-span-12 md:col-span-8 md:row-span-2"
  },
  {
    title: "STRENGTH",
    text: "Everyone sees you as a strong girl…",
    subtext: "But what I see is a heart that learned how to stay silent even when it was hurting.",
    color: "bg-[#ff6b81]",
    size: "col-span-12 md:col-span-4"
  },
  {
    title: "WEIGHT",
    text: "Anxiety, heartbreaks, panic attacks, sleepless nights...",
    subtext: "You carried all of that weight inside you and still said, “I’m okay.”",
    color: "bg-white",
    size: "col-span-12 md:col-span-4"
  },
  {
    title: "BLOOM",
    text: "You bloomed in darkness nobody saw.",
    subtext: "You survived battles nobody heard about.",
    color: "bg-[#00d4ff]",
    img: "/soul_bloom.png",
    size: "col-span-12 md:col-span-6"
  },
  {
    title: "SOFTNESS",
    text: "Deep inside, there’s also a softer side of you…",
    subtext: "A side that quietly waits for someone to hold you close and care for you gently. A side that doesn't need to be strong for everyone else. A side that is allowed to just be. You are safe here.",
    color: "bg-white",
    size: "col-span-12 md:col-span-6",
    isFramed: true
  },
  {
    title: "KINDNESS",
    text: "You still chose kindness and love.",
    subtext: "Instead of becoming cold. That’s what makes you truly special.",
    color: "bg-[#ffb7c5]",
    size: "col-span-12 md:col-span-5"
  },
  {
    title: "DESERVING",
    text: "You deserve someone who understands you.",
    subtext: "The parts of you that never found the words to speak.",
    color: "bg-[#e8c547]",
    size: "col-span-12 md:col-span-7"
  }
];

const FILLER_PHOTOS = [
  { src: "/gallery/photos/10.jpg", size: "col-span-12 md:col-span-3", rotate: -3 },
  { src: "/gallery/photos/12.jpg", size: "col-span-12 md:col-span-4", rotate: 2 },
  { src: "/gallery/photos/15.jpg", size: "col-span-12 md:col-span-2", rotate: -5 },
  { src: "/gallery/photos/16.jpg", size: "col-span-12 md:col-span-3", rotate: 4 },
];

const DECORATIVE_BLOCKS = [
  { text: "BIRTHDAY EDITION", color: "bg-black text-white" },
  { text: "RESILIENCE", color: "bg-[#ff6b81] text-black" },
  { text: "01", color: "bg-white text-black" },
  { text: "★", color: "bg-[#e8c547] text-black text-3xl" },
  { text: "SOUL.", color: "bg-black text-gold" },
];

function InteractiveCard({ part, index }) {
  return (
    <motion.div
      drag
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      whileHover={{ scale: 1.02, rotate: index % 2 === 0 ? 0.5 : -0.5, zIndex: 50 }}
      whileDrag={{ scale: 1.05, zIndex: 100 }}
      className={`${part.size} relative group cursor-grab active:cursor-grabbing`}
    >
      <div className={`h-full ${part.color} border-4 border-black p-6 md:p-10 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden relative`}>
        
        {/* Editorial Frames for sections */}
        {part.isFramed && (
          <>
            <div className="absolute top-4 left-4 border-l-2 border-t-2 border-black w-8 h-8 opacity-20" />
            <div className="absolute top-4 right-4 border-r-2 border-t-2 border-black w-8 h-8 opacity-20" />
            <div className="absolute bottom-4 left-4 border-l-2 border-b-2 border-black w-8 h-8 opacity-20" />
            <div className="absolute bottom-4 right-4 border-r-2 border-b-2 border-black w-8 h-8 opacity-20" />
          </>
        )}

        <div className="space-y-6 relative z-10">
          <div className="flex justify-between items-start">
            <span className="font-black text-[10px] uppercase tracking-[0.4em] border-2 border-black px-2 py-0.5 bg-white">
              CODE_{index + 100}
            </span>
            <h4 className="text-2xl font-black italic opacity-20 uppercase">{part.title}</h4>
          </div>
          
          <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-[0.9] text-black">
            {part.text}
          </h3>
        </div>

        <div className="space-y-4 mt-6 relative z-10">
          {part.img && (
            <div className="w-full h-40 border-2 border-black overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700">
               <img src={part.img} alt="Brutalist Art" className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" />
            </div>
          )}
          <p className="text-base md:text-lg font-bold leading-tight text-black/80 italic">
            {part.subtext}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function PhotoBlock({ photo, index }) {
  return (
    <motion.div
      drag
      dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
      style={{ rotate: photo.rotate }}
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 60 }}
      className={`${photo.size} min-h-[300px] border-4 border-black bg-white p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-grab active:cursor-grabbing overflow-hidden group relative`}
    >
      {/* Editorial Edit Frames for Photos */}
      <div className="absolute top-4 left-4 border-l-2 border-t-2 border-black w-6 h-6 opacity-30 z-20" />
      <div className="absolute top-4 right-4 border-r-2 border-t-2 border-black w-6 h-6 opacity-30 z-20" />
      <div className="absolute bottom-4 left-4 border-l-2 border-b-2 border-black w-6 h-6 opacity-30 z-20" />
      <div className="absolute bottom-4 right-4 border-r-2 border-b-2 border-black w-6 h-6 opacity-30 z-20" />
      
      {/* Technical Metadata Stickers */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black text-white text-[7px] px-2 py-0.5 font-black uppercase tracking-widest z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        TECHNICAL_FRAME_PROOF // ISO 100
      </div>

      <div className="w-full h-full overflow-hidden border-2 border-black relative bg-[#f0f0f0]">
         <img src={photo.src} alt="Memory" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
         
         <div className="absolute bottom-2 right-2 bg-black text-white text-[8px] px-2 py-1 font-black uppercase tracking-widest z-20">
           FRM_{index + 900}
         </div>

         {/* Film Strip Effect */}
         <div className="absolute top-0 bottom-0 left-2 w-1 flex flex-col justify-around py-4 opacity-20">
            {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-1 bg-black rounded-full" />)}
         </div>
      </div>
    </motion.div>
  );
}

export default function SoulPage() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const startMusic = () => {
      if (audio.paused) {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    };

    // Attempt immediate play
    startMusic();

    // Interaction triggers for browser compatibility
    const triggers = ["click", "scroll", "touchstart", "mousemove"];
    triggers.forEach(t => window.addEventListener(t, startMusic, { once: true }));

    return () => {
      audio.pause();
      triggers.forEach(t => window.removeEventListener(t, startMusic));
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="bg-[#e5e5e5] min-h-screen selection:bg-black selection:text-white p-4 md:p-8 relative overflow-x-hidden">
      
      {/* Background Dot Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10" 
           style={{ backgroundImage: "radial-gradient(#000 1.5px, transparent 0)", backgroundSize: "32px 32px" }} 
      />

      {/* Brutalist Header */}
      <header className="mb-8 border-b-4 border-black pb-8 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex gap-2">
            {DECORATIVE_BLOCKS.map((block, i) => (
              <div key={i} className={`${block.color} border-2 border-black px-3 py-1 font-black text-[9px] uppercase tracking-widest`}>
                {block.text}
              </div>
            ))}
          </div>
          <h1 className="text-6xl md:text-[10vw] font-black uppercase leading-[0.75] tracking-tighter text-black italic">
            SOUL
          </h1>
        </div>
        <div className="text-center md:text-right border-4 border-black p-4 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-xs">
          <p className="font-black text-black uppercase text-xs leading-none mb-2">ACCESS GRANTED</p>
          <p className="font-bold text-[10px] text-black/60 uppercase tracking-tighter">
            PRIVATE TRANSMISSION: DRAG CARDS AND PHOTOS TO REVEAL THE INNER STRENGTH.
          </p>
        </div>
      </header>

      {/* Dense Interactive Grid */}
      <main className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10 auto-rows-min">
        
        {QUOTE_PARTS.map((part, i) => (
          <InteractiveCard key={i} part={part} index={i} />
        ))}

        {/* Filler Photos with Edit Frames */}
        {FILLER_PHOTOS.map((photo, i) => (
          <PhotoBlock key={i} photo={photo} index={i} />
        ))}

        {/* Decorative Fillers */}
        <motion.div 
          drag
          dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
          className="col-span-12 md:col-span-12 h-32 border-4 border-black bg-black text-white flex items-center justify-center p-6 text-center shadow-[10px_10px_0px_0px_rgba(232,197,71,1)] cursor-grab active:cursor-grabbing"
        >
           <p className="font-black italic uppercase tracking-[0.4em] text-xl md:text-4xl text-gold">A HEART OF GOLD.</p>
        </motion.div>

        {/* Final Interactive Block */}
        <motion.div 
          drag
          dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
          className="col-span-12 bg-[#1a1a1a] text-white p-12 md:p-20 border-4 border-black shadow-[16px_16px_0px_0px_rgba(232,197,71,1)] cursor-grab active:cursor-grabbing relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6b81] -rotate-12 translate-x-12 -translate-y-12 border-4 border-black" />
          <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
            <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-none italic">
              "You deserve someone who understands the parts of you that never found the words to speak."
            </h2>
            <div className="flex flex-col items-center gap-8">
               <div className="h-[2px] w-48 bg-gold/50" />
               <p className="text-4xl font-black uppercase tracking-[0.2em] text-gold drop-shadow-[0_0_10px_rgba(232,197,71,0.3)]">I'M HERE ALWAYS.</p>
               <a href="/home" className="inline-block bg-white text-black px-12 py-5 font-black uppercase tracking-tighter hover:bg-[#ff6b81] hover:text-white transition-all shadow-[10px_10px_0px_0px_rgba(232,197,71,1)]">
                  Return to Portal
               </a>
            </div>
          </div>
        </motion.div>

      </main>

      {/* Side Decorative Floating Elements */}
      <div className="fixed top-1/4 -left-20 rotate-90 opacity-20 pointer-events-none z-0">
        <span className="text-[10vw] font-black uppercase tracking-tighter text-black">RESILIENT</span>
      </div>
      <div className="fixed bottom-1/4 -right-20 -rotate-90 opacity-20 pointer-events-none z-0">
        <span className="text-[10vw] font-black uppercase tracking-tighter text-black">UNSPOKEN</span>
      </div>

      {/* Audio & Toggle */}
      <audio ref={audioRef} src="/audio/WhatsApp Audio 2026-05-11 at 15.32.09.mpeg" loop />
      <button
        onClick={toggleMusic}
        className="fixed bottom-10 right-10 z-[200] w-24 h-24 bg-white border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] transition-all"
      >
        <span className="text-[10px] font-black uppercase tracking-tighter mb-1">AUDIO_PLR</span>
        <div className={`w-8 h-8 rounded-full border-4 border-black flex items-center justify-center ${isPlaying ? 'bg-gold' : 'bg-rose'}`}>
           <span className="font-black text-xs">{isPlaying ? "II" : "▶"}</span>
        </div>
      </button>

      <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 1.5px #000;
          text-stroke: 1.5px #000;
        }
      `}</style>
    </div>
  );
}
