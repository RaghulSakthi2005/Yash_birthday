const fs = require('fs');
const path = require('path');

const galleryFile = path.join(__dirname, 'data', 'gallery.js');
const videosDir = path.join(__dirname, 'public', 'gallery', 'videos');

const folders = ['bullets', 'outings', 'natural'];

const config = {
  videoSeries: [
    {
      id: "riding-bullet",
      title: "Riding Bullet",
      thumbnail: "/gallery/thumbnails/thumb_bullet_v2.jpg",
      description: "Those pure adrenaline moments hitting the highways. Just the Royal Enfield, the open road, and wind. A testament to your fierce independence and unyielding spirit.",
      episodes: []
    },
    {
      id: "outing",
      title: "Outing",
      thumbnail: "/gallery/thumbnails/thumb_outing_v2.jpg",
      description: "City lights, cozy cafes, and endless conversations. Memories of us exploring new spaces, smiling at the little things, and simply being there for each other as friends.",
      episodes: []
    },
    {
      id: "natural-spots",
      title: "Natural Spots",
      thumbnail: "/gallery/thumbnails/thumb_nature_v2.jpg",
      description: "Finding peace away from the noise. You've climbed mountains and crossed rivers, both literal and metaphorical. These places match your breathtaking perspective on the world.",
      episodes: []
    }
  ]
};

folders.forEach(folder => {
  const dirPath = path.join(videosDir, folder);
  if (!fs.existsSync(dirPath)) return;

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.mp4'));
  
  // Sort files by creation time or alphabetically
  files.sort();

  const seriesIndex = folder === 'bullets' ? 0 : folder === 'outings' ? 1 : 2;

  files.forEach((file, idx) => {
    // Rename file to a cleaner name to avoid URL encoding issues
    const oldPath = path.join(dirPath, file);
    const newFileName = `${folder}_${idx + 1}.mp4`;
    const newPath = path.join(dirPath, newFileName);
    
    // Only rename if it's not already renamed
    if (file !== newFileName) {
      if (!fs.existsSync(newPath)) {
        fs.renameSync(oldPath, newPath);
      }
    }

    config.videoSeries[seriesIndex].episodes.push({
      id: idx + 1,
      title: `Memory ${idx + 1}`,
      src: `/gallery/videos/${folder}/${newFileName}`,
      duration: "0m 30s" // Placeholder duration
    });
  });
});

const fileContent = `export const galleryConfig = ${JSON.stringify(config, null, 2)};\n`;

fs.writeFileSync(galleryFile, fileContent);
console.log('Gallery updated successfully!');
