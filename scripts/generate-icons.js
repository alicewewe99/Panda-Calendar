import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgPath = path.resolve(process.cwd(), 'public/icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generate() {
  // 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.resolve(process.cwd(), 'public/pwa-192x192.png'));
  console.log('Generated pwa-192x192.png');

  // 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.resolve(process.cwd(), 'public/pwa-512x512.png'));
  console.log('Generated pwa-512x512.png');

  // 512x512 maskable (with 10% padding safe-zone)
  await sharp(svgBuffer)
    .resize(420, 420)
    .extend({
      top: 46,
      bottom: 46,
      left: 46,
      right: 46,
      background: '#fff8f0'
    })
    .png()
    .toFile(path.resolve(process.cwd(), 'public/pwa-maskable-512x512.png'));
  console.log('Generated pwa-maskable-512x512.png');

  // 180x180 apple touch icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.resolve(process.cwd(), 'public/apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // favicon 32x32 & 48x48
  await sharp(svgBuffer)
    .resize(48, 48)
    .png()
    .toFile(path.resolve(process.cwd(), 'public/favicon.png'));
  console.log('Generated favicon.png');
}

generate().catch(console.error);
