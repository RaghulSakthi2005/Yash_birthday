"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import initialLandsData from "@/data/lands.json";

export default function LandsPage() {
  const [active, setActive] = useState(0);
  const [lands, setLands] = useState(initialLandsData);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    setIsScanning(true);
    const timer = setTimeout(() => setIsScanning(false), 800);
    return () => clearTimeout(timer);
  }, [active]);

  return (
    <div className="bg-[#05050a] min-h-screen selection:bg-gold selection:text-black overflow-hidden relative">
      
      {/* Background Satellite Blueprint */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0 scale-110">
         <img src="/satellite_bg.png" alt="Blueprint" className="w-full h-full object-cover" />
      </div>

      {/* Header / GPS Readout */}
      <header className="relative z-10 pt-20 px-8 md:px-20 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
             <div className="w-3 h-3 bg-[#4ade80] rounded-full animate-pulse" />
             <span className="font-mono text-xs uppercase tracking-[0.5em] text-[#4ade80]">Global Positioning: Active</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white leading-none">
            GEO_<span className="text-gold">YASHIKA</span>
          </h1>
          <p className="text-white/40 font-mono text-sm max-w-md uppercase tracking-tight">
             Tracing the landscapes that mirror your soul. Seven letters. Seven unique territories across the globe.
          </p>
        </div>

        <div className="border-2 border-white/10 bg-black/40 backdrop-blur-xl p-6 md:p-10 font-mono text-right min-w-[300px]">
           <p className="text-[10px] text-white/30 mb-2">TARGET_COORDINATES</p>
           <AnimatePresence mode="wait">
             <motion.h2 
               key={active}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="text-2xl md:text-3xl text-gold font-bold"
             >
               {lands[active].place}
             </motion.h2>
           </AnimatePresence>
        </div>
      </header>

      {/* Main Interactive Journey */}
      <main className="relative z-10 py-20 px-8 md:px-20 max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          {/* Letter Navigation */}
          <div className="md:col-span-1 flex md:flex-col gap-4 justify-center">
            {lands.map((land, i) => (
              <motion.button
                key={i}
                onClick={() => setActive(i)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-14 h-14 md:w-16 md:h-16 border-2 font-black text-2xl transition-all flex items-center justify-center
                  ${active === i ? 'bg-gold border-gold text-black shadow-[0_0_30px_rgba(232,197,71,0.4)]' : 'border-white/10 text-white/40 hover:border-white/40'}
                `}
              >
                {land.letter}
              </motion.button>
            ))}
          </div>

          {/* Visual Display */}
          <div className="md:col-span-6 relative aspect-square md:aspect-video border-4 border-white/5 bg-white/5 overflow-hidden group">
             
             {/* Scanning Effect Overlay */}
             <AnimatePresence>
               {isScanning && (
                 <motion.div 
                   initial={{ top: "-100%" }}
                   animate={{ top: "100%" }}
                   transition={{ duration: 0.8, ease: "linear" }}
                   className="absolute inset-x-0 h-40 bg-gold/10 border-y-2 border-gold/50 z-20 pointer-events-none shadow-[0_0_100px_rgba(232,197,71,0.2)]"
                 />
               )}
             </AnimatePresence>

             <motion.img 
               key={active}
               src={lands[active].img} 
               initial={{ scale: 1.2, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ duration: 1.2 }}
               className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
             />

             {/* UI Overlays on Image */}
             <div className="absolute top-6 left-6 font-mono text-[10px] text-white/50 space-y-1">
                <p>SAT_V_09.4</p>
                <p>ALT: 32,000 FT</p>
                <p>STATUS: LOCKED</p>
             </div>
             
             <div className="absolute bottom-6 right-6 font-black text-6xl text-white/10 italic">
                {lands[active].letter}
             </div>
          </div>

          {/* Context / Story */}
          <div className="md:col-span-5 space-y-8">
             <AnimatePresence mode="wait">
               <motion.div
                 key={active}
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -30 }}
                 className="space-y-6"
               >
                 <div className="flex items-center gap-4">
                    <span className="text-4xl">{lands[active].emoji}</span>
                    <h3 className="text-3xl font-bold text-white uppercase tracking-tighter">
                      {lands[active].name}
                    </h3>
                 </div>
                 
                 <div className="h-1 w-20 bg-gold" />
                 
                 <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-light italic">
                   "{lands[active].story}"
                 </p>

                 <div className="flex gap-4 pt-10">
                    <Link href="/gallery" className="bg-white text-black px-8 py-3 font-black uppercase text-xs tracking-widest hover:bg-gold transition-all">
                       Memories
                    </Link>
                    <Link href="/home" className="border-2 border-white/20 text-white px-8 py-3 font-black uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all">
                       Portal
                    </Link>
                 </div>
               </motion.div>
             </AnimatePresence>
          </div>

        </div>

      </main>

      {/* Decorative GPS Footer */}
      <footer className="fixed bottom-0 w-full p-8 font-mono text-[9px] text-white/20 flex justify-between uppercase tracking-[0.3em] pointer-events-none">
         <span>Orbital Path 037 // Sector 6-9</span>
         <span>System Status: Online // Yashika Geo-Tagging</span>
      </footer>

      <style jsx>{`
        @font-face {
          font-family: 'Mono';
          src: url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;800&display=swap');
        }
      `}</style>
    </div>
  );
}
