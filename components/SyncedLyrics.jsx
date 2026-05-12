"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function SyncedLyrics({ lyrics, currentTime }) {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Find the currently active line
  useEffect(() => {
    if (!lyrics) return;
    const index = lyrics.findIndex((line, i) => {
      const nextLine = lyrics[i + 1];
      return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
    });
    if (index !== -1 && index !== activeIndex) {
      setActiveIndex(index);
    }
  }, [currentTime, lyrics, activeIndex]);

  // Auto-scroll to the active line
  useEffect(() => {
    if (containerRef.current) {
      const activeElement = containerRef.current.children[activeIndex];
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [activeIndex]);

  if (!lyrics || lyrics.length === 0) {
    return <div className="text-white/50 text-center py-10">No lyrics available</div>;
  }

  return (
    <div
      className="h-full overflow-y-auto w-full px-6 lg:px-16 py-[30vh] lg:py-[40vh] scrollbar-hide flex flex-col space-y-8"
      ref={containerRef}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        maskImage: "linear-gradient(transparent, black 15%, black 85%, transparent)",
        WebkitMaskImage: "linear-gradient(transparent, black 15%, black 85%, transparent)",
      }}
    >
      {lyrics.map((line, i) => {
        const isActiveLine = i === activeIndex;
        const isPastLine = i < activeIndex;

        return (
          <div
            key={i}
            className={`text-xl md:text-3xl lg:text-[44px] leading-[1.2] font-extrabold tracking-[-0.03em] transition-all duration-500 ease-out py-1 ${
              isActiveLine
                ? "opacity-100 scale-[1.02] origin-left " + (line.isHighlight ? "drop-shadow-[0_0_15px_rgba(232,121,249,0.4)]" : "text-white drop-shadow-lg")
                : isPastLine
                ? "text-white opacity-30"
                : "text-white opacity-20"
            }`}
          >
            {line.words ? (
              // Word-by-word rendering
              line.words.map((word, wIdx) => {
                let fillPercentage = 0;
                if (currentTime >= word.end) {
                  fillPercentage = 100;
                } else if (currentTime >= word.start && currentTime < word.end) {
                  const duration = word.end - word.start;
                  const elapsed = currentTime - word.start;
                  fillPercentage = (elapsed / duration) * 100;
                }

                return (
                  <span
                    key={wIdx}
                    className="inline-block mr-3 relative"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    <span className={isActiveLine ? (line.isHighlight ? "text-white/20" : "text-white/30") : ""}>
                      {word.text}
                    </span>
                    
                    {isActiveLine && (
                      <span
                        className="absolute left-0 top-0 overflow-hidden"
                        style={{
                          width: `${fillPercentage}%`,
                          transition: "width 0.1s linear"
                        }}
                      >
                        <span className={line.isHighlight ? "bg-gradient-to-r from-fuchsia-400 via-pink-400 to-purple-500 text-transparent bg-clip-text" : "text-white"}>
                          {word.text}
                        </span>
                      </span>
                    )}
                  </span>
                );
              })
            ) : (
              // Fallback for line-by-line rendering
              <span className={`block w-full ${isActiveLine && line.isHighlight ? "bg-gradient-to-r from-fuchsia-400 via-pink-400 to-purple-500 text-transparent bg-clip-text" : ""}`} style={{ textShadow: isActiveLine && !line.isHighlight ? "0 4px 24px rgba(255,255,255,0.3)" : "none" }}>
                {line.text}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
