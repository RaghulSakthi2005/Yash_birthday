"use client";

import React, { useState, useRef, useEffect } from "react";
import SyncedLyrics from "./SyncedLyrics";
import { PlayIcon, PauseIcon, BackwardIcon, ForwardIcon, ListBulletIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function PlaylistPlayer({ playlistData }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const audioRef = useRef(null);

  const currentTrack = playlistData[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.error("Playback failed", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlistData.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlistData.length) % playlistData.length);
    setIsPlaying(true);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  return (
    <div className="fixed inset-0 w-full bg-[#0a0a0a] flex flex-col overflow-hidden font-sans selection:bg-white/20">
      
      {/* ── IMMERSIVE DYNAMIC BACKGROUND ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {currentTrack.coverArt ? (
          <img 
            src={currentTrack.coverArt} 
            alt="background blur" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 blur-[100px] scale-110 saturate-150 transition-all duration-1000"
          />
        ) : (
          <>
            <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-pink-600/20 blur-[120px] mix-blend-screen animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-600/20 blur-[100px] mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }} />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#0a0a0a]" />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col lg:flex-row max-w-[1600px] mx-auto overflow-hidden">
        
        {/* ── MOBILE HEADER (Track Info) ── */}
        <div className="lg:hidden flex items-center gap-4 p-6 pt-10 relative z-20 bg-gradient-to-b from-black/40 to-transparent">
          <div className="w-14 h-14 rounded-xl overflow-hidden shadow-2xl flex-shrink-0">
            <img src={currentTrack.coverArt || "/images/placeholder.jpg"} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white truncate">{currentTrack.title}</h2>
            <p className="text-xs text-white/50 font-medium truncate uppercase tracking-widest">{currentTrack.artist}</p>
          </div>
          <button onClick={() => setIsPlaylistOpen(true)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <ListBulletIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* ── LEFT SIDE: ALBUM ART (DESKTOP) ── */}
        <div className="hidden lg:flex w-5/12 h-full flex-col items-center justify-center px-16 shrink-0">
          <div className={`relative w-[45vh] h-[45vh] rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] transition-all duration-1000 ease-out mb-16 ${isPlaying ? 'scale-100' : 'scale-90 opacity-40 blur-sm'}`}>
            <img src={currentTrack.coverArt || "/images/placeholder.jpg"} alt={currentTrack.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 border border-white/10 rounded-[40px] pointer-events-none" />
          </div>
          <div className="w-full text-center px-10">
             <h2 className="text-5xl font-black text-white tracking-tighter mb-4 leading-tight">{currentTrack.title}</h2>
             <p className="text-xl text-white/40 font-medium uppercase tracking-[0.2em]">{currentTrack.artist}</p>
          </div>
        </div>

        {/* ── MIDDLE: LYRICS (MAIN FOCUS) ── */}
        <div className="flex-1 h-full relative flex flex-col min-h-0">
          <SyncedLyrics lyrics={currentTrack.lyrics} currentTime={currentTime} />
        </div>

        {/* ── BOTTOM CONTROL PANEL (MOBILE) ── */}
        <div className="lg:hidden w-full p-6 pb-12 bg-black/60 backdrop-blur-3xl border-t border-white/5 relative z-30">
          {/* Progress / Seek Slider */}
          <div className="mb-8 px-1">
             <input 
               type="range"
               min={0}
               max={duration || 0}
               value={currentTime}
               onChange={handleSeek}
               className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:accent-pink-400 transition-all"
             />
             <div className="flex justify-between text-[10px] text-white/30 mt-4 font-bold tracking-widest uppercase">
               <span>{formatTime(currentTime)}</span>
               <span>{formatTime(duration)}</span>
             </div>
          </div>

          <div className="flex items-center justify-between gap-4 px-2">
             <button onClick={prevTrack} className="w-12 h-12 flex items-center justify-center text-white/40 hover:text-white transition-all hover:scale-110 active:scale-95">
               <BackwardIcon className="w-8 h-8" />
             </button>
             <button 
               onClick={togglePlayPause} 
               className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.15)] active:scale-90 transition-transform flex-shrink-0"
             >
               {isPlaying ? <PauseIcon className="w-7 h-7" /> : <PlayIcon className="w-7 h-7 ml-0.5" />}
             </button>
             <button onClick={nextTrack} className="w-12 h-12 flex items-center justify-center text-white/40 hover:text-white transition-all hover:scale-110 active:scale-95">
               <ForwardIcon className="w-8 h-8" />
             </button>
          </div>
        </div>

        {/* ── DESKTOP CONTROLS (BOTTOM FLOATING) ── */}
        <div className="hidden lg:block fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
           <div className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-full px-10 py-5 flex items-center gap-10 shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
              <button onClick={prevTrack} className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-all hover:scale-110 active:scale-95">
                <BackwardIcon className="w-6 h-6" />
              </button>
              <button onClick={togglePlayPause} className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl flex-shrink-0">
                {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6 ml-0.5" />}
              </button>
              <button onClick={nextTrack} className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-all hover:scale-110 active:scale-95">
                <ForwardIcon className="w-6 h-6" />
              </button>
              
              <div className="w-[1px] h-8 bg-white/10 mx-2" />
              
              <div className="w-64">
                 <input 
                   type="range"
                   min={0}
                   max={duration || 0}
                   value={currentTime}
                   onChange={handleSeek}
                   className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white hover:accent-pink-400"
                 />
                 <div className="flex justify-between text-[10px] text-white/30 mt-2 font-bold tracking-wider uppercase">
                   <span>{formatTime(currentTime)}</span>
                   <span>{formatTime(duration)}</span>
                 </div>
              </div>

              <div className="w-[1px] h-8 bg-white/10 mx-2" />

              <button onClick={() => setIsPlaylistOpen(true)} className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-all hover:scale-110 active:scale-95">
                <ListBulletIcon className="w-6 h-6" />
              </button>
           </div>
        </div>
        
      </div>

      {/* ── PLAYLIST OVERLAY ── */}
      <div 
        className={`absolute inset-0 z-50 bg-black/80 backdrop-blur-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isPlaylistOpen ? "translate-y-0" : "translate-y-full"
        } flex flex-col`}
      >
        <div className="flex items-center justify-between p-6 lg:p-10 border-b border-white/10">
          <h3 className="text-2xl font-bold text-white tracking-tight">Up Next</h3>
          <button 
            onClick={() => setIsPlaylistOpen(false)}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-2">
          {playlistData.map((track, index) => (
            <button
              key={track.id || index}
              onClick={() => {
                setCurrentTrackIndex(index);
                setIsPlaying(true);
                setIsPlaylistOpen(false);
              }}
              className={`w-full flex items-center text-left p-4 rounded-2xl transition-colors hover:bg-white/5 ${
                index === currentTrackIndex ? "bg-white/10" : ""
              }`}
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 mr-4 shadow-md bg-white/5 relative">
                {track.coverArt ? (
                  <img src={track.coverArt} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">🎵</div>
                )}
                {index === currentTrackIndex && isPlaying && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className={`font-bold truncate ${index === currentTrackIndex ? "text-white" : "text-white/80"}`}>
                  {track.title}
                </p>
                <p className="text-sm text-white/40 truncate">{track.artist}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={nextTrack}
      />
    </div>
  );
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
