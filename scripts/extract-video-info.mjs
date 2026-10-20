import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const outputDir = 'C:/Users/Admin/.gemini/antigravity-ide/brain/5914f26d-c9ff-46fc-8ce8-93197ff9464b/scratch';

async function main() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

  const meta = await page.evaluate(async () => {
    const vid = document.createElement('video');
    vid.src = '/media/evo-grand-lite/scooter-walkaround.mp4';
    vid.muted = true;
    vid.playsInline = true;
    document.body.appendChild(vid);

    await new Promise((res, rej) => {
      vid.onloadeddata = () => res();
      vid.onerror = (e) => rej(new Error('Video error'));
      setTimeout(() => rej(new Error('Timeout onloadeddata')), 10000);
    });

    return {
      duration: vid.duration,
      videoWidth: vid.videoWidth,
      videoHeight: vid.videoHeight,
    };
  });

  console.log('Video Metadata in Edge:', JSON.stringify(meta));

  const times = [1, 3, 5, 10, 15];
  for (const t of times) {
    const dataUrl = await page.evaluate(async (time) => {
      const vid = document.querySelector('video[src="/media/evo-grand-lite/scooter-walkaround.mp4"]');
      vid.currentTime = time;
      await new Promise((res) => {
        vid.onseeked = () => res();
      });
      const canvas = document.createElement('canvas');
      canvas.width = vid.videoWidth;
      canvas.height = vid.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(vid, 0, 0);
      return canvas.toDataURL('image/jpeg', 0.85);
    }, t);

    const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
    const outPath = path.join(outputDir, `frame-${t}s.jpg`);
    fs.writeFileSync(outPath, Buffer.from(base64Data, 'base64'));
    console.log(`Saved frame-${t}s.jpg, size: ${fs.statSync(outPath).size} bytes`);
  }

  await browser.close();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
