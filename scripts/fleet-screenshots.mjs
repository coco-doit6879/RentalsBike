import {chromium} from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1440, height: 1000}});
await page.addInitScript(() => localStorage.setItem('evo-cookie-choice', 'essential'));
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3009';

await page.goto(`${base}/`);
await page.waitForLoadState('networkidle');
await page.screenshot({path: 'docs/screenshots/home-desktop-fleet.png'});

await page.goto(`${base}/models`);
await page.waitForLoadState('networkidle');
await page.screenshot({path: 'docs/screenshots/models-desktop-fleet.png'});

await page.goto(`${base}/models/evo-grand-lite?color=pink`);
await page.waitForLoadState('networkidle');
await page.screenshot({path: 'docs/screenshots/detail-desktop-fleet.png'});

await page.setViewportSize({width: 390, height: 844});
await page.goto(`${base}/`);
await page.waitForLoadState('networkidle');
await page.screenshot({path: 'docs/screenshots/home-mobile-fleet.png'});

await browser.close();
console.log('Screenshots taken successfully.');
