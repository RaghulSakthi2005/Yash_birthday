"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const PLAYLIST = [
  { 
    id: 1, 
    title: "Snehithane Instrumental", 
    artist: "A.R. Rahman", 
    duration: "4:24", 
    color: "#ff6b81",
    lyrics: [
      "The quiet moments between us...",
      "Where silence speaks louder than words.",
      "A resonance that fills the empty spaces,",
      "Echoing softly in the chambers of the heart.",
      "In this melody, I find pieces of you."
    ]
  },
  { 
    id: 2, 
    title: "The Garden Within", 
    artist: "Yashh!!", 
    duration: "5:12", 
    color: "#e8c547",
    lyrics: [
      "You planted seeds of hope,",
      "In the middle of the storm.",
      "And I watched them grow,",
      "Into something beautiful.",
      "Your strength is a quiet bloom,",
      "A testament to resilience."
    ]
  },
  { 
    id: 3, 
    title: "Starlight Voyage", 
    artist: "Lofi Girl", 
    duration: "2:50", 
    color: "#00d4ff",
    lyrics: [
      "Drifting through the cosmos,",
      "A billion stars above.",
      "But none shine quite like you.",
      "In the infinite expanse,",
      "You are the constellation I follow."
    ]
  },
  { 
    id: 4, 
    title: "Memories of Us", 
    artist: "Raghul", 
    duration: "4:01", 
    color: "#ffb7c5",
    lyrics: [
      "Flashes of laughter,",
      "Moments etched in gold.",
      "A story written in the stars,",
      "A bond that never folds.",
      "These are the memories of us."
    ]
  },
];

export default function AudioPage() {
  const [playingId, setPlayingId] = useState(PLAYLIST[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTracklist, setShowTracklist] = useState(false);
  
  const currentSong = PLAYLIST.find(s => s.id === playingId) || PLAYLIST[0];

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden font-body relative selection:bg-rose-500/30">
      
      {/* ── DYNAMIC AMBIENT BACKGROUND ── */}
      <div className="fixed inset-0 z-0 pointer-events-none transition-colors duration-1000" style={{ backgroundColor: '#020202' }}>
        <motion.div 
          animate={{ backgroundColor: currentSong.color }}
          transition={{ duration: 2 }}
          className="absolute top-[-20%] left-[-10%] w-[100vw] h-[100vw] lg:w-[70vw] lg:h-[70vw] rounded-full mix-blend-screen opacity-10 blur-[100px] lg:blur-[140px]" 
        />
        <motion.div 
          animate={{ backgroundColor: currentSong.color }}
          transition={{ duration: 2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] lg:w-[60vw] lg:h-[60vw] rounded-full mix-blend-screen opacity-[0.07] blur-[80px] lg:blur-[120px]" 
        />
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      </div>

      {/* ── TOP NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 lg:px-12 py-6 lg:py-8 pointer-events-none">
        <Link href="/home" className="pointer-events-auto text-white/50 hover:text-white transition-colors flex items-center gap-2 text-[11px] lg:text-xs uppercase tracking-widest font-bold">
          <span>←</span> Back
        </Link>
        <div className="text-[9px] lg:text-[11px] font-bold uppercase tracking-[0.3em] lg:tracking-[0.4em] text-white/40 text-center">
          Yashh!!'s <br className="lg:hidden"/> Emotional Mix
        </div>
        <button 
          onClick={() => setShowTracklist(!showTracklist)}
          className="pointer-events-auto text-white/50 hover:text-white transition-colors text-[11px] lg:text-xs uppercase tracking-widest font-bold flex items-center gap-2"
        >
          <span className="hidden sm:inline">Tracks</span> <span className="text-base">{showTracklist ? '✕' : '☰'}</span>
        </button>
      </nav>

      {/* ── MAIN LAYOUT ── */}
      <main className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row pt-24 lg:pt-0">
        
        {/* LEFT COMPONENT: Player & Cover */}
        <section className="w-full lg:w-[45%] flex flex-col items-center justify-center px-6 lg:px-16 py-4 lg:py-0 lg:h-screen lg:sticky lg:top-0">
          
          <div className="w-full max-w-[420px] flex flex-col items-center">
            
            {/* The Cover Art (Vinyl/CD style) */}
            <motion.div 
              key={currentSong.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-[65vw] max-w-[340px] lg:w-full lg:max-w-[400px] aspect-square rounded-[30px] lg:rounded-[40px] shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden group mb-8 lg:mb-12"
            >
              <div className="absolute inset-0 bg-[#111]">
                <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-white/20 to-transparent mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-br" style={{ backgroundImage: `linear-gradient(135deg, ${currentSong.color}40, #0a0a0a)` }} />
                
                {/* Abstract Placeholder Visual */}
                <div className="absolute inset-0 flex items-center justify-center text-[80px] lg:text-[120px] opacity-70 filter drop-shadow-2xl mix-blend-luminosity">
                  🎵
                </div>
              </div>
              
              {/* Premium Glass Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-white/15 opacity-90 pointer-events-none" />
              <div className="absolute inset-0 border border-white/10 rounded-[30px] lg:rounded-[40px] pointer-events-none" />
            </motion.div>

            {/* Song Meta */}
            <div className="text-center mb-8 lg:mb-10 w-full px-4">
              <motion.h1 
                key={`title-${currentSong.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl lg:text-5xl font-heading italic text-white mb-2 lg:mb-3 leading-tight"
              >
                {currentSong.title}
              </motion.h1>
              <motion.p 
                key={`artist-${currentSong.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-xs lg:text-sm font-semibold text-white/50 tracking-[0.2em] uppercase"
              >
                {currentSong.artist}
              </motion.p>
            </div>

            {/* Player Controls */}
            <div className="w-full flex flex-col items-center">
              {/* Scrubber */}
              <div className="w-full flex items-center gap-4 mb-8 px-2">
                <span className="text-[10px] font-bold text-white/30 tabular-nums">1:24</span>
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden relative cursor-pointer group">
                  <motion.div 
                    className="absolute inset-y-0 left-0 bg-white group-hover:bg-rose-400 transition-colors"
                    style={{ width: '40%' }}
                  />
                </div>
                <span className="text-[10px] font-bold text-white/30 tabular-nums">{currentSong.duration}</span>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-8 lg:gap-10">
                <button 
                  onClick={() => {
                    const idx = PLAYLIST.findIndex(s => s.id === playingId);
                    setPlayingId(PLAYLIST[(idx - 1 + PLAYLIST.length) % PLAYLIST.length].id);
                  }}
                  className="text-white/40 hover:text-white transition-all hover:scale-110 active:scale-90"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                </button>
                
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center bg-white text-black hover:scale-105 active:scale-95 transition-all shadow-[0_10px_40px_rgba(255,255,255,0.15)]"
                >
                  {isPlaying ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  ) : (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="ml-2"><path d="M8 5v14l11-7z"/></svg>
                  )}
                </button>

                <button 
                  onClick={() => {
                    const idx = PLAYLIST.findIndex(s => s.id === playingId);
                    setPlayingId(PLAYLIST[(idx + 1) % PLAYLIST.length].id);
                  }}
                  className="text-white/40 hover:text-white transition-all hover:scale-110 active:scale-90"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* RIGHT COMPONENT: Emotional Lyrics */}
        <section className="w-full lg:w-[55%] flex flex-col px-6 lg:px-20 py-16 lg:py-0 lg:h-screen lg:overflow-y-auto custom-scrollbar relative">
          
          <div className="lg:my-auto max-w-2xl w-full mx-auto lg:mx-0">
            <h3 className="hidden lg:block text-[11px] font-bold uppercase tracking-[0.4em] text-white/20 mb-16 lg:sticky lg:top-0 lg:pt-12 lg:pb-4 lg:bg-gradient-to-b lg:from-[#050505] lg:to-transparent z-10">
              Lyrics
            </h3>
            
            <motion.div 
              key={`lyrics-${currentSong.id}`}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.2 }}
              className="space-y-8 lg:space-y-12 pb-32 lg:pb-40 text-center lg:text-left"
            >
              {currentSong.lyrics.map((line, i) => (
                <motion.p 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.4 }}
                  className="text-[28px] md:text-4xl lg:text-[52px] font-heading font-medium leading-[1.3] lg:leading-[1.25] tracking-tight text-white/60 hover:text-white transition-colors duration-500 cursor-default"
                >
                  {line}
                </motion.p>
              ))}
              
              <div className="pt-16 lg:pt-24 flex items-center justify-center lg:justify-start gap-4 opacity-20">
                <div className="w-8 lg:w-12 h-[1px] bg-white"></div>
                <span className="text-2xl">✧</span>
                <div className="w-8 lg:w-12 h-[1px] bg-white"></div>
              </div>
            </motion.div>
          </div>
        </section>

      </main>

      {/* ── TRACKLIST DRAWER (OVERLAY) ── */}
      <AnimatePresence>
        {showTracklist && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTracklist(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 h-[80vh] lg:h-[70vh] bg-[#0a0a0a] border-t border-white/10 rounded-t-[32px] lg:rounded-t-[40px] z-[110] p-6 lg:p-12 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8 lg:mb-10 max-w-4xl mx-auto w-full">
                <h3 className="text-2xl lg:text-4xl font-heading italic">Curated Collection</h3>
                <button onClick={() => setShowTracklist(false)} className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-xs lg:text-sm">
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pb-20 max-w-4xl mx-auto w-full pr-2">
                {PLAYLIST.map((song, i) => (
                  <div 
                    key={song.id}
                    onClick={() => { setPlayingId(song.id); setShowTracklist(false); setIsPlaying(true); }}
                    className={`flex items-center gap-4 lg:gap-6 p-4 lg:p-5 rounded-2xl lg:rounded-3xl cursor-pointer transition-all border border-transparent ${playingId === song.id ? 'bg-white/10 border-white/10 shadow-lg' : 'hover:bg-white/5'}`}
                  >
                    <span className="text-xs lg:text-sm font-bold text-white/30 w-6 text-center">{String(i + 1).padStart(2, '0')}</span>
                    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 shadow-inner" style={{ background: playingId === song.id ? `${song.color}40` : '' }}>
                       <span className="text-xl lg:text-2xl opacity-60 mix-blend-luminosity">💿</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold truncate text-base lg:text-xl tracking-tight mb-1 ${playingId === song.id ? 'text-white' : 'text-white/80'}`}>{song.title}</p>
                      <p className="text-xs lg:text-sm text-white/40 tracking-wider uppercase">{song.artist}</p>
                    </div>
                    <span className="text-xs lg:text-sm font-bold text-white/30 tabular-nums">{song.duration}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px; /* Hide scrollbar for ultra-clean look, or keep it 4px */
        }
        @media (min-width: 1024px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
          }
        }
      `}</style>
    </div>
  );
}
