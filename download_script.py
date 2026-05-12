import os
import json
import subprocess
import uuid

songs = [
"enkeyoo partha", "ranjha", "Co2", "uyire un uyirena", "athadi athadi", "i wanna be yours", "aagayam theepitha", "thee illai", "visiri", "Avalukena", "marakavillaiyae", "oxygen kaavan", "naane varugiraen", "her", "adiyae azhagae", "unai serndhidavey", "aathi ena nee", "antartica", "kadhaipomaa", "nallai allai", "kadhal kanave", "poraada poraada", "va va vannillaa", "oruthi maelae", "yennodu va va", "kaarkuzhal kadavaiye", "mudhal nee mudivum nee", "raanjhanaa", "oru kan jaadai", "thayya thayya tamil", "so baby (doctor)", "kadhalaada (reprise)", "theeratha vilayattu pillai", "vazhi parthirundhen", "nee kavithaigala", "kadavule", "yellae lama", "mun andhi", "enna naan seiven", "humsafar", "enna sona from ok jaanu", "veesum velichathile", "kabira", "sahiba", "ravingu theevai", "kesariya", "nee partha vixhigal", "kannazhaga", "nenjukkul peidhidum", "idhazin oram", "yaanji", "naan pizhai", "sirikadhey", "thanagmey (naanum rowdy thaan)", "mental mandhil", "megamo aval", "vaseegara", "hosanna", "mazhai kuruvi", "new york nagaram", "pookal pookkum", "azhage azhage", "maruvaarthai", "kadhal kan kattudhe", "yennai maatrum kadhale", "thalli pogadhey", "kaathalae kaathale", "po indru neeyagae", "the life of ram", "unakenna venum sollu", "ennakenna yaarum illaiyae", "kannaane kanne from nanum rowdy thaan", "kalasaala from osthi", "appadi podu", "where is the party", "local boys from ethir neechal", "katha;a kannala", "daddy mummy", "kannitheevu ponna", "karuppu perazhaga", "nakku mukka", "manmadha raasa", "kattu sirukki", "vechikkava remix", "machi open the bottle", "vada mapillai", "nee marilyn monroe"
]

playlist_path = "data/playlist.json"

try:
    with open(playlist_path, "r", encoding="utf-8") as f:
        playlist = json.load(f)
except Exception:
    playlist = []

existing_titles = [t.get("title", "").lower() for t in playlist]

# Remove duplicates
unique_songs = []
for song in songs:
    if song.lower() not in existing_titles and song not in unique_songs:
        unique_songs.append(song)

print(f"Downloading {len(unique_songs)} songs...")

for i, song in enumerate(unique_songs):
    print(f"[{i+1}/{len(unique_songs)}] Downloading: {song}")
    cmd = [
        "venv/bin/yt-dlp", 
        f"ytsearch1:{song} audio",
        "-f", "ba[ext=m4a]/ba",
        "-o", "public/audio/%(title)s.%(ext)s",
        "--print", "filename",
        "--no-warnings"
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        lines = result.stdout.strip().split('\n')
        # Print lines for debugging
        print(f"yt-dlp output: {lines}")
        filepath = lines[-1]
        
        filename = os.path.basename(filepath)
        
        new_track = {
            "id": str(len(playlist) + 1),
            "title": song.title(),
            "artist": "Yashh!!'s Playlist",
            "audioSrc": f"/audio/{filename}",
            "coverArt": "",
            "lyrics": []
        }
        playlist.append(new_track)
        
        # Save incrementally
        with open(playlist_path, "w", encoding="utf-8") as f:
            json.dump(playlist, f, indent=2, ensure_ascii=False)
            
    except Exception as e:
        print(f"Failed to download {song}: {e}")

print("All downloads completed.")
