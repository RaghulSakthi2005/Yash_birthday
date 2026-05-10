"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { galleryConfig } from "@/data/gallery";
import initialGalleryPhotos from "@/data/gallery_photos.json";

const SeriesCard = ({ series, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      className="group"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03, zIndex: 50, y: -8, boxShadow: "0 20px 50px rgba(232,197,71,0.15)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        position: "relative", borderRadius: 12, overflow: "hidden", aspectRatio: "16/9",
        background: "#111", boxShadow: "0 10px 40px rgba(0,0,0,0.8)", cursor: "pointer",
        border: "1px solid rgba(255,255,255,0.05)"
      }}>
      <Image src={series.thumbnail} alt={series.title} fill unoptimized={true} className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:opacity-60" />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)", pointerEvents: "none" }} />

      {/* Play Icon Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.8)] text-white">
          <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 20, left: 20, right: 20, zIndex: 10 }}>
        <h3 className="transform transition-transform duration-300 group-hover:translate-y-[-4px]" style={{ fontSize: 24, fontWeight: 800, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,1)" }}>{series.title}</h3>
        <div className="transform transition-all duration-300 group-hover:translate-y-[-2px] group-hover:opacity-100 opacity-90" style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 3, color: "#fff" }}>HD</span>
          <span style={{ fontSize: 12, color: "#4ade80", fontWeight: 600 }}>98% Match</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginLeft: 6 }}>{series.episodes.length} Episodes</span>
        </div>
      </div>
    </motion.div>
  );
};

const EpisodeCard = ({ ep, i }) => {
  const videoRef = useRef(null);

  const handlePlayFullscreen = () => {
    const vid = videoRef.current;
    if (!vid) return;

    if (vid.requestFullscreen) {
      vid.requestFullscreen();
    } else if (vid.webkitRequestFullscreen) {
      vid.webkitRequestFullscreen();
    }

    vid.muted = false;
    vid.controls = true;
    vid.play();

    vid.onfullscreenchange = () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        vid.pause();
        vid.muted = true;
        vid.controls = false;
      }
    };
  };

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
      onHoverStart={() => videoRef.current?.play().catch(() => { })}
      onHoverEnd={() => { if (videoRef.current && (!document.fullscreenElement && !document.webkitFullscreenElement)) { videoRef.current.pause(); videoRef.current.currentTime = 0; } }}
      onClick={handlePlayFullscreen}
      style={{ display: "flex", gap: 20, padding: "20px", background: "rgba(255,255,255,0.02)", borderRadius: 12, alignItems: "center", cursor: "pointer", border: "1px solid rgba(255,255,255,0.05)" }}
      whileHover={{ background: "rgba(255,255,255,0.05)", scale: 1.01, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
    >
      <div style={{ width: 160, height: 90, background: "#000", borderRadius: 8, overflow: "hidden", position: "relative", flexShrink: 0, boxShadow: "0 4px 15px rgba(0,0,0,0.5)" }}>
        <video ref={videoRef} src={ep.src} muted loop playsInline className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity duration-300 bg-black/20">
          <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </div>
      </div>
      <div>
        <h4 style={{ color: "#fff", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{ep.title}</h4>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{ep.duration || "1m 30s"}</p>
      </div>
    </motion.div>
  );
};

const FrameResolver = ({ photo }) => {
  const isEmpty = !photo.src;

  const imageContent = isEmpty ? (
    <div style={{
      width: "100%", height: "100%", background: "rgba(255,255,255,0.03)",
      display: "flex", alignItems: "center", justifyContent: "center",
      border: "2px dashed rgba(255,255,255,0.15)", borderRadius: photo.type !== "polaroid" ? 8 : 0
    }}>
      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, fontWeight: 500, padding: 20, textAlign: "center" }}>
        {photo.alt}
      </span>
    </div>
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" style={{ objectPosition: photo.objectPosition || "center" }} />
  );

  if (photo.type === "polaroid") {
    return (
      <div style={{ background: "#f9f9f9", padding: "16px 16px 60px 16px", height: "100%", display: "flex", flexDirection: "column", boxShadow: "0 10px 30px rgba(0,0,0,0.6)", position: "relative" }}>
        <div style={{ position: "relative", flex: 1, background: "#111", overflow: "hidden" }}>{imageContent}</div>
        {!isEmpty && (
          <div style={{ position: "absolute", bottom: 20, left: 0, width: "100%", textAlign: "center" }}>
            <span style={{ color: "#333", fontFamily: "'Caveat', cursive, sans-serif", fontSize: 20, fontWeight: 700, opacity: 0.8 }}>{photo.alt}</span>
          </div>
        )}
      </div>
    );
  }

  if (photo.type === "tape") {
    return (
      <div style={{ position: "relative", height: "100%", borderRadius: 8, overflow: "hidden", boxShadow: "0 8px 25px rgba(0,0,0,0.4)" }}>
        <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%) rotate(-2deg)", width: 80, height: 25, background: "rgba(255,255,255,0.4)", backdropFilter: "blur(4px)", zIndex: 10, border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} />
        <div style={{ position: "relative", width: "100%", height: "100%" }}>{imageContent}</div>
      </div>
    );
  }

  if (photo.type === "film") {
    return (
      <div style={{ background: "#111", padding: "0 24px", height: "100%", display: "flex", flexDirection: "column", borderLeft: "8px dashed #000", borderRight: "8px dashed #000", boxShadow: "0 10px 40px rgba(0,0,0,0.8)" }}>
        <div style={{ flex: 1, position: "relative", background: "#050505", margin: "16px 0", overflow: "hidden" }}>{imageContent}</div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
      {imageContent}
    </div>
  );
};

export default function GalleryPage() {
  const [view, setView] = useState("choose");
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [photos, setPhotos] = useState(initialGalleryPhotos);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleUpload = async (e, id) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("id", id);
    formData.append("file", file);

    const res = await fetch("/api/gallery", { method: "POST", body: formData });
    if (res.ok) {
      const data = await res.json();
      setPhotos(prev => prev.map(p => p.id === id ? { ...data.photo, src: `${data.photo.src}?t=${Date.now()}` } : p));
    }
  };

  const handlePositionChange = async (e, id) => {
    const objectPosition = e.target.value;
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, objectPosition } : p));

    const formData = new FormData();
    formData.append("id", id);
    formData.append("objectPosition", objectPosition);
    await fetch("/api/gallery", { method: "POST", body: formData });
  };

  const handleCaptionChange = (id, newCaption) => {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, alt: newCaption } : p));
  };

  const handleCaptionSave = async (id, caption) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("alt", caption);
    await fetch("/api/gallery", { method: "POST", body: formData });
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.15, backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: selectedSeries ? 1400 : 1200, margin: "0 auto", padding: selectedSeries ? "0" : "120px clamp(24px, 6vw, 80px) 100px" }}>

        {/* Header (Hide if we are inside a series view) */}
        {!selectedSeries && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 64 }}>
            <p className="label" style={{ color: "rgba(232,197,71,0.5)", marginBottom: 16 }}>✦ a collection of us</p>
            <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", marginBottom: 20 }}>
              Our <span style={{ fontStyle: "italic", background: "linear-gradient(135deg, #ff6b81, #e8c547)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Memories</span>
            </h1>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {view === "choose" && (
            <motion.div key="choose" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, maxWidth: 600 }}>
                {["Photos 📸", "Videos 🎬"].map((label, i) => (
                  <motion.button key={i} onClick={() => setView(i === 0 ? "photos" : "videos")} whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.97 }} style={{ padding: "48px 24px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", cursor: "pointer", fontFamily: "var(--font)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, backdropFilter: "blur(10px)", transition: "box-shadow 0.3s" }}>
                    <span style={{ fontSize: 40 }}>{label.split(" ")[1]}</span>
                    <span style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>{label.split(" ")[0]}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {view === "photos" && (
            <motion.div key="photos" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <button onClick={() => setView("choose")} className="btn-ghost" style={{ marginBottom: 40, display: "inline-flex" }}>← Back</button>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gridAutoRows: "250px", gap: 40, alignItems: "center" }}>
                {photos.map((photo, i) => (
                  <motion.div key={photo.id} className={`group ${photo.span}`} initial={{ opacity: 0, y: 40, rotate: photo.rotate * 2 }} animate={{ opacity: 1, y: 0, rotate: photo.rotate }} transition={{ delay: i * 0.08, type: "spring", stiffness: 100, damping: 12 }} whileHover={{ scale: 1.05, zIndex: 50, rotate: 0, boxShadow: "0 20px 50px rgba(232,197,71,0.2)" }} style={{ position: "relative", height: "100%", transformOrigin: "center" }}>
                    <FrameResolver photo={photo} />

                    {/* Edit Mode Controls */}
                    {isEditMode && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 8, zIndex: 60, backdropFilter: "blur(4px)", padding: "10px" }}>
                        <label className="btn-gold" style={{ cursor: "pointer", fontSize: 11, padding: "8px 16px", background: "rgba(232,197,71,0.2)", border: "1px solid #e8c547", color: "#fff", borderRadius: 100 }}>
                          Upload New
                          <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleUpload(e, photo.id)} />
                        </label>
                        <select
                          value={photo.objectPosition || "center"}
                          onChange={(e) => handlePositionChange(e, photo.id)}
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
                        {/* Caption Editor */}
                        <div style={{ width: "90%", display: "flex", flexDirection: "column", gap: 3 }}>
                          <span style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", textAlign: "center" }}>Caption</span>
                          <input
                            type="text"
                            value={photo.alt || ""}
                            placeholder="Write a caption..."
                            onChange={(e) => handleCaptionChange(photo.id, e.target.value)}
                            onBlur={(e) => handleCaptionSave(photo.id, e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleCaptionSave(photo.id, e.target.value)}
                            style={{
                              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.25)",
                              borderRadius: 6, padding: "6px 10px", color: "#fff", fontSize: 13,
                              outline: "none", textAlign: "center", width: "100%",
                              fontFamily: "'Caveat', cursive, sans-serif", letterSpacing: "0.02em"
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {view === "videos" && !selectedSeries && (
            <motion.div key="videos" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <button onClick={() => setView("choose")} className="btn-ghost" style={{ marginBottom: 40, display: "inline-flex" }}>← Back</button>
              <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Featured Shows</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 40, paddingBottom: 60 }}>
                {galleryConfig.videoSeries.map((series, i) => (
                  <SeriesCard key={series.id} series={series} onClick={() => setSelectedSeries(series)} />
                ))}
              </div>
            </motion.div>
          )}

          {view === "videos" && selectedSeries && (
            <motion.div key="series-detail" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} style={{ minHeight: "100vh", background: "#050505" }}>
              {/* Massive Hero Banner */}
              <div style={{ position: "relative", width: "100%", height: "60vh", background: "#000" }}>
                <Image src={selectedSeries.thumbnail} alt={selectedSeries.title} fill unoptimized={true} style={{ objectFit: "cover", opacity: 0.6 }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #050505 0%, transparent 100%)" }} />
                <div style={{ position: "absolute", top: 40, left: 40 }}>
                  <button onClick={() => setSelectedSeries(null)} style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "none", color: "#fff", padding: "12px 24px", borderRadius: 30, cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                    ← Back to Browse
                  </button>
                </div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 5% 40px" }}>
                  <h1 style={{ fontSize: "clamp(48px, 8vw, 96px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", textShadow: "0 10px 30px rgba(0,0,0,0.8)", marginBottom: 16 }}>
                    {selectedSeries.title}
                  </h1>
                  <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(255,255,255,0.8)", maxWidth: 700, lineHeight: 1.6, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                    {selectedSeries.description}
                  </p>
                  <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
                    <button
                      onClick={() => {
                        const firstVid = document.querySelector('video');
                        if (firstVid) {
                          if (firstVid.requestFullscreen) firstVid.requestFullscreen();
                          else if (firstVid.webkitRequestFullscreen) firstVid.webkitRequestFullscreen();
                          firstVid.muted = false;
                          firstVid.controls = true;
                          firstVid.play();
                          firstVid.onfullscreenchange = () => {
                            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                              firstVid.pause();
                              firstVid.muted = true;
                              firstVid.controls = false;
                            }
                          };
                        }
                      }}
                      className="btn-gold" style={{ padding: "16px 40px", fontSize: 18, color: "#000", cursor: "pointer" }}>▶ Play E1</button>
                    <button style={{ padding: "16px 40px", fontSize: 18, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", border: "none", borderRadius: 8, color: "#fff", fontWeight: 600, cursor: "pointer" }}>+ My List</button>
                  </div>
                </div>
              </div>

              {/* Episodes List */}
              <div style={{ padding: "40px 5% 100px", maxWidth: 1200 }}>
                <h3 style={{ color: "#fff", fontSize: 24, fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 20, marginBottom: 32 }}>Episodes</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {selectedSeries.episodes.length > 0 ? (
                    selectedSeries.episodes.map((ep, i) => (
                      <EpisodeCard key={ep.id} ep={ep} i={i} />
                    ))
                  ) : (
                    <div style={{ padding: "40px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px dashed rgba(255,255,255,0.1)" }}>
                      <p style={{ color: "rgba(255,255,255,0.4)" }}>No episodes added yet. Add MP4 files to data/gallery.js!</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {(!selectedSeries) && (
          <div style={{ marginTop: 80, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 16, flexWrap: "wrap", position: "relative", zIndex: 20 }}>
            <Link href="/tree" className="btn-gold" style={{ padding: "16px 32px" }}>The Tree 🌳</Link>
            <Link href="/letter" className="btn-ghost">Letter 💌</Link>
            <Link href="/home" className="btn-ghost">← Story</Link>
          </div>
        )}
      </div>

      {/* Edit Toggle for Photos View */}
      {view === "photos" && (
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
          {isEditMode ? "Finish Editing" : "Edit Gallery"}
        </button>
      )}
    </div>
  );
}
