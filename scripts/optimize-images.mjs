import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC_BASE = '/Volumes/VANZI DATA/nôi thất phát lộc';
const DEST_BASE = path.resolve('public/assets');

async function processImage(srcPath, destPath, options = {}) {
  const { width = 2000, quality = 84 } = options;
  fs.mkdirSync(path.dirname(destPath), { recursive: true });

  await sharp(srcPath)
    .rotate() // auto-orient based on EXIF
    .resize({
      width,
      withoutEnlargement: true,
      fit: 'inside',
    })
    .sharpen({
      sigma: 0.8, // subtle edge sharpening for luxury architectural lines
      m1: 0.5,
      m2: 1.5,
    })
    .webp({
      quality,
      effort: 6,
      smartSubsample: true,
    })
    .toFile(destPath);

  const origSize = (fs.statSync(srcPath).size / 1024).toFixed(1);
  const newSize = (fs.statSync(destPath).size / 1024).toFixed(1);
  const ratio = ((1 - (newSize / origSize)) * 100).toFixed(0);
  console.log(`✓ ${path.basename(destPath)}: ${origSize}KB -> ${newSize}KB (-${ratio}%)`);
}

async function run() {
  console.log('--- STARTING HIGH-FIDELITY IMAGE OPTIMIZATION ---');

  // 1. Hero Images (The 5 curated photos from user)
  const heroSrc = path.join(SRC_BASE, 'hero');
  if (fs.existsSync(heroSrc)) {
    const files = fs.readdirSync(heroSrc).filter(f => !f.startsWith('.')).sort();
    for (let i = 0; i < files.length; i++) {
      const src = path.join(heroSrc, files[i]);
      const dest = path.join(DEST_BASE, 'hero', `hero-${i + 1}.webp`);
      await processImage(src, dest, { width: 2200, quality: 85 });
    }
  }

  // 2. Workshop / Craftsmanship
  const wsSrc = path.join(SRC_BASE, 'ảnh xưởng');
  if (fs.existsSync(wsSrc)) {
    const files = fs.readdirSync(wsSrc).filter(f => !f.startsWith('.')).sort();
    for (let i = 0; i < files.length; i++) {
      const src = path.join(wsSrc, files[i]);
      const dest = path.join(DEST_BASE, 'workshop', `workshop-${i + 1}.webp`);
      await processImage(src, dest, { width: 1600, quality: 82 });
    }
  }

  // 3. 3D Projects
  const p3dSrc = path.join(SRC_BASE, '3d 1');
  if (fs.existsSync(p3dSrc)) {
    const files = fs.readdirSync(p3dSrc).filter(f => !f.startsWith('.')).sort();
    for (let i = 0; i < Math.min(8, files.length); i++) {
      const src = path.join(p3dSrc, files[i]);
      const dest = path.join(DEST_BASE, 'projects', `project-3d-${i + 1}.webp`);
      await processImage(src, dest, { width: 1600, quality: 84 });
    }
  }

  // 4. Real Projects
  const realSrc = path.join(SRC_BASE, 'hinh anh thuc te');
  if (fs.existsSync(realSrc)) {
    const files = fs.readdirSync(realSrc).filter(f => !f.startsWith('.') && f.match(/\.(jpg|jpeg|png)$/i)).sort();
    for (let i = 0; i < Math.min(8, files.length); i++) {
      const src = path.join(realSrc, files[i]);
      const dest = path.join(DEST_BASE, 'projects', `project-real-${i + 1}.webp`);
      await processImage(src, dest, { width: 1600, quality: 84 });
    }
  }

  console.log('--- ALL IMAGES OPTIMIZED SUCCESSFULLY ---');
}

run().catch(err => {
  console.error('Error optimizing images:', err);
  process.exit(1);
});
