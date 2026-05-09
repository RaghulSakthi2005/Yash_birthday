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

  if (!currentTrack) return <div className="text-white text-center py-20">No tracks found.</div>;

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
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-[#0a0a0a]" />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col lg:flex-row max-w-[1400px] mx-auto">
        
        {/* ── LEFT SIDE: PLAYER CONTROLS ── */}
        <div className="w-full lg:w-5/12 h-[40dvh] lg:h-full flex flex-col items-center justify-center px-6 lg:px-16 pt-12 lg:pt-0 shrink-0 relative z-10">
          
          {/* Album Art */}
          <div className={`relative w-[28vh] h-[28vh] lg:w-[42vh] lg:h-[42vh] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700 ease-out mb-8 lg:mb-12 ${isPlaying ? 'scale-100 shadow-[0_30px_60px_rgba(255,255,255,0.05)]' : 'scale-95 opacity-80'}`}>
            {currentTrack.coverArt ? (
              <img 
                src={currentTrack.coverArt} 
                alt={currentTrack.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10">
                <span className="text-white/20 text-6xl">🎵</span>
              </div>
            )}
            <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none" />
          </div>

          {/* Track Info */}
          <div className="w-full text-center px-4 mb-8">
            <h2 className="text-2xl lg:text-4xl font-extrabold text-white tracking-tight mb-2 line-clamp-1">{currentTrack.title}</h2>
            <p className="text-sm lg:text-lg text-white/50 font-medium tracking-wide">{currentTrack.artist}</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-[320px] lg:max-w-md px-2 mb-8 group">
            <div className="relative flex items-center h-4 cursor-pointer" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              handleSeek({ target: { value: percent * duration } });
            }}>
              {/* Background Track */}
              <div className="absolute w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                {/* Filled Track */}
                <div 
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              {/* Scrubber Knob */}
              <div 
                className="absolute w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${duration ? (currentTime / duration) * 100 : 0}% - 6px)` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-white/40 mt-3 font-medium tracking-wider">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 lg:gap-10 w-full relative">
            <button onClick={prevTrack} className="text-white/50 hover:text-white hover:scale-110 transition-all">
              <BackwardIcon className="w-7 h-7 lg:w-9 lg:h-9" />
            </button>
            <button 
              onClick={togglePlayPause} 
              className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              {isPlaying ? <PauseIcon className="w-8 h-8 lg:w-10 lg:h-10" /> : <PlayIcon className="w-8 h-8 lg:w-10 lg:h-10 ml-1" />}
            </button>
            <button onClick={nextTrack} className="text-white/50 hover:text-white hover:scale-110 transition-all">
              <ForwardIcon className="w-7 h-7 lg:w-9 lg:h-9" />
            </button>

            {/* Playlist Menu Button */}
            <button 
              onClick={() => setIsPlaylistOpen(true)}
              className="absolute right-0 lg:right-4 text-white/50 hover:text-white transition-colors"
            >
              <ListBulletIcon className="w-6 h-6 lg:w-8 lg:h-8" />
            </button>
          </div>


        </div>

        {/* ── RIGHT SIDE: LYRICS ── */}
        <div className="w-full lg:w-7/12 flex-1 lg:h-full relative flex flex-col z-10">
          <div className="flex-1 overflow-hidden">
            <SyncedLyrics lyrics={currentTrack.lyrics} currentTime={currentTime} />
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
