import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import crypto from 'crypto';

const SRC_DIR1 = '/Volumes/VANZI DATA/nôi thất phát lộc/hinh anh thuc te';
const SRC_DIR2 = '/Volumes/VANZI DATA/nôi thất phát lộc';
const DEST_DIR = path.resolve('public/assets/real-projects');

if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
}

// 1. Process Unique Photos
const files1 = fs.existsSync(SRC_DIR1)
  ? fs.readdirSync(SRC_DIR1).filter(f => f.match(/\.(jpg|jpeg|png)$/i)).map(f => path.join(SRC_DIR1, f))
  : [];
const files2 = fs.existsSync(SRC_DIR2)
  ? fs.readdirSync(SRC_DIR2).filter(f => f.match(/\.(jpg|jpeg|png)$/i)).map(f => path.join(SRC_DIR2, f))
  : [];

const allImages = [...files1, ...files2];
const seenHashes = new Set();
const uniqueImages = [];

for (const file of allImages) {
  try {
    const buf = fs.readFileSync(file);
    const hash = crypto.createHash('md5').update(buf).digest('hex');
    if (!seenHashes.has(hash)) {
      seenHashes.add(hash);
      uniqueImages.push(file);
    }
  } catch (e) {
    // skip unreadable
  }
}

console.log(`Found ${uniqueImages.length} unique real photos.`);

// Process top 36 curated real photos (high quality webp)
const photoMetadata = [];
const categories = ['Phòng Khách', 'Phòng Ngủ', 'Tủ Áo Cánh Kính', 'Tủ Bếp', 'Vách Than Tre', 'Xưởng Mộc'];
const locations = ['Biên Hòa', 'Đồng Nai', 'TP. Hồ Chí Minh', 'Bình Dương'];

async function processPhotos() {
  const count = Math.min(36, uniqueImages.length);
  for (let i = 0; i < count; i++) {
    const srcFile = uniqueImages[i];
    const destName = `real-${i + 1}.webp`;
    const destPath = path.join(DEST_DIR, destName);

    try {
      await sharp(srcFile)
        .rotate()
        .resize({ width: 1400, withoutEnlargement: true, fit: 'inside' })
        .webp({ quality: 80, effort: 4 })
        .toFile(destPath);

      const cat = categories[i % categories.length];
      const loc = locations[i % locations.length];

      photoMetadata.push({
        id: `rp-${i + 1}`,
        image: `/assets/real-projects/${destName}`,
        title: `Công Trình Hoàn Thiện #${i + 1}`,
        category: cat,
        location: loc,
      });

      process.stdout.write(`✓ Photo ${i + 1}/${count}\r`);
    } catch (err) {
      console.error(`Error processing ${srcFile}:`, err.message);
    }
  }
  console.log(`\nSuccessfully optimized ${photoMetadata.length} real photos.`);
}

// 2. Process Videos
const videoSrcDir = SRC_DIR1;
const videoDestDir = path.resolve('public/assets/videos');
const videoFiles = fs.existsSync(videoSrcDir)
  ? fs.readdirSync(videoSrcDir).filter(f => f.match(/\.mp4$/i)).map(f => path.join(videoSrcDir, f))
  : [];

console.log(`Found ${videoFiles.length} real mp4 videos.`);

function processVideos() {
  // Sort by size to pick diverse length reels
  const sortedVideos = videoFiles.sort((a, b) => fs.statSync(a).size - fs.statSync(b).size);
  // Pick 10 distinct videos
  const selected = sortedVideos.slice(0, 10);
  for (let i = 0; i < selected.length; i++) {
    const src = selected[i];
    const dest = path.join(videoDestDir, `reel-${i + 1}.mp4`);
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied reel-${i + 1}.mp4 (${(fs.statSync(dest).size / (1024 * 1024)).toFixed(1)} MB)`);
  }
}

async function run() {
  await processPhotos();
  processVideos();
  fs.writeFileSync('src/data/realPhotos.json', JSON.stringify(photoMetadata, null, 2));
  console.log('Saved metadata to src/data/realPhotos.json');
}

run();
