import React from "react";
import fs from "fs";
import path from "path";
import PlaylistPlayer from "../../../components/PlaylistPlayer";

export default async function PlaylistPage() {
  // Load playlist data from JSON file
  const dataPath = path.join(process.cwd(), "data", "playlist.json");
  let playlistData = [];
  
  try {
    const fileContents = fs.readFileSync(dataPath, "utf8");
    playlistData = JSON.parse(fileContents);
  } catch (error) {
    console.error("Failed to load playlist data:", error);
  }

  return (
    <main className="bg-black text-white min-h-screen font-sans">
      <PlaylistPlayer playlistData={playlistData} />
    </main>
  );
}
