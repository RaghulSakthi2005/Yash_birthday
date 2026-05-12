import os
import json
import subprocess
import urllib.request
import urllib.parse
import time

playlist_path = "data/playlist.json"

try:
    with open(playlist_path, "r", encoding="utf-8") as f:
        playlist = json.load(f)
except Exception as e:
    print("Playlist not found!", e)
    exit(1)

def get_cover_art(title):
    try:
        # Try music search first
        url = f"https://itunes.apple.com/search?term={urllib.parse.quote(title)}&media=music&limit=1"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())
            if data['resultCount'] > 0:
                artwork = data['results'][0].get('artworkUrl100', '')
                return artwork.replace('100x100bb', '600x600bb')
        
        # Fallback: try searching all media or movie to get a cover
        url_fb = f"https://itunes.apple.com/search?term={urllib.parse.quote(title)}&limit=1"
        req_fb = urllib.request.Request(url_fb)
        with urllib.request.urlopen(req_fb, timeout=5) as response:
            data = json.loads(response.read().decode())
            if data['resultCount'] > 0:
                artwork = data['results'][0].get('artworkUrl100', '')
                return artwork.replace('100x100bb', '600x600bb')
    except Exception:
        pass
    return ""

def parse_lrclib(lyrics_str):
    lines = lyrics_str.split('\n')
    parsed = []
    for line in lines:
        if line.startswith('['):
            try:
                time_str, text = line[1:].split(']', 1)
                text = text.strip()
                if not text: continue
                m, s = time_str.split(':')
                seconds = int(m) * 60 + float(s)
                parsed.append({"time": round(seconds, 2), "text": text})
            except Exception:
                pass
    return parsed

def get_lyrics(title):
    try:
        url = f"https://lrclib.net/api/search?track_name={urllib.parse.quote(title)}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Antigravity/1.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())
            for track in data:
                if track.get('syncedLyrics'):
                    return parse_lrclib(track['syncedLyrics'])
            # Fallback to plainLyrics if no syncedLyrics found
            for track in data:
                if track.get('plainLyrics'):
                    lines = track['plainLyrics'].split('\n')
                    parsed = []
                    current_time = 0.0
                    for line in lines:
                        if not line.strip(): continue
                        parsed.append({"time": round(current_time, 2), "text": line.strip()})
                        current_time += 4.5 # Fake timestamp every 4.5 seconds
                    return parsed
    except Exception:
        pass
    return []

def generate_highlights(lyrics):
    if not lyrics: return []
    for line in lyrics:
        line['isHighlight'] = False
        
    def add_highlight(start_idx):
        if start_idx >= len(lyrics): return
        highlight_duration = 0
        current_idx = start_idx
        while current_idx < len(lyrics) - 1 and highlight_duration < 10:
            lyrics[current_idx]['isHighlight'] = True
            highlight_duration += (lyrics[current_idx+1]['time'] - lyrics[current_idx]['time'])
            current_idx += 1
            if highlight_duration >= 7: # Between 7 and 10 seconds
                break
        if current_idx == len(lyrics) - 1:
            lyrics[current_idx]['isHighlight'] = True

    add_highlight(len(lyrics) // 3)
    add_highlight(int(len(lyrics) * 0.66))
    return lyrics

print(f"Processing {len(playlist)} songs...")

for i, track in enumerate(playlist):
    title = track.get("title", "")
    print(f"[{i+1}/{len(playlist)}] Processing: {title}")
    
    audio_src = track.get("audioSrc", "")
    expected_filepath = "public" + audio_src
    
    # 1. Download Audio if missing
    if not audio_src or not os.path.exists(expected_filepath) or not os.path.isfile(expected_filepath):
        print(f"  Downloading audio for {title}...")
        cmd = [
            "venv/bin/yt-dlp", 
            f"ytsearch1:{title} audio",
            "-f", "ba[ext=m4a]/ba",
            "-o", "public/audio/%(title)s.%(ext)s",
            "--print", "filename",
            "--no-warnings",
            "--no-simulate"
        ]
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            lines = result.stdout.strip().split('\n')
            filepath = lines[-1]
            filename = os.path.basename(filepath)
            track["audioSrc"] = f"/audio/{filename}"
            print(f"  -> Saved as {filename}")
        except Exception as e:
            print(f"  -> Failed audio download: {e}")

    # 2. Cover Art
    if not track.get("coverArt"):
        print("  Fetching cover art...")
        cover = get_cover_art(title)
        if cover:
            track["coverArt"] = cover
            print("  -> Found cover art.")
            
    # 3. Lyrics and Highlights
    # Re-fetch if using the generic placeholder text
    is_placeholder = track.get("lyrics") and len(track.get("lyrics")) > 0 and "Playing " in track.get("lyrics")[0].get("text", "")
    if not track.get("lyrics") or is_placeholder:
        print("  Fetching synced lyrics...")
        lyrics = get_lyrics(title)
        if not lyrics:
            print("  -> No synced lyrics found, using fallback.")
            lyrics = [
                {"time": 0.0, "text": f"Playing {title}..."}
            ]
            lyrics.append({"time": 30.0, "text": "🎵 Let the music take control 🎵", "isHighlight": True})
            lyrics.append({"time": 37.0, "text": "Vibe to the rhythm..."})
            lyrics.append({"time": 60.0, "text": "🔥 Feel the beat 🔥", "isHighlight": True})
            lyrics.append({"time": 67.0, "text": "Enjoying the song..."})
        else:
            lyrics = generate_highlights(lyrics)
            print(f"  -> Generated highlights for {len(lyrics)} lines.")
            
        track["lyrics"] = lyrics

    # Save incrementally
    with open(playlist_path, "w", encoding="utf-8") as f:
        json.dump(playlist, f, indent=2, ensure_ascii=False)

print("All processing completed.")
