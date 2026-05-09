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
      className="h-full overflow-y-auto w-full px-6 lg:px-16 py-[40vh] scrollbar-hide flex flex-col space-y-8"
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
            className={`text-2xl md:text-4xl lg:text-[44px] leading-[1.2] font-extrabold tracking-[-0.03em] transition-all duration-500 ease-out ${
              isActiveLine
                ? "text-white opacity-100 drop-shadow-lg scale-[1.02] origin-left"
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
                    <span className={isActiveLine ? "text-white/30" : ""}>
                      {word.text}
                    </span>
                    
                    {isActiveLine && (
                      <span
                        className="absolute left-0 top-0 text-white overflow-hidden"
                        style={{
                          width: `${fillPercentage}%`,
                          transition: "width 0.1s linear"
                        }}
                      >
                        {word.text}
                      </span>
                    )}
                  </span>
                );
              })
            ) : (
              // Fallback for line-by-line rendering
              <span className="block w-full" style={{ textShadow: isActiveLine ? "0 4px 24px rgba(255,255,255,0.3)" : "none" }}>
                {line.text}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
