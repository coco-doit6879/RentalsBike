import {chromium} from '@playwright/test';
import fs from 'node:fs';
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:1000}});
fs.mkdirSync('docs/screenshots',{recursive:true});
await page.addInitScript(()=>localStorage.setItem('evo-cookie-choice','essential'));
await page.goto(process.env.PREVIEW_URL||'http://127.0.0.1:3007');await page.locator('h1').waitFor();await page.evaluate(()=>document.fonts.ready);
await page.screenshot({path:'docs/screenshots/typography-desktop.png'});
await page.setViewportSize({width:390,height:844});await page.goto(process.env.PREVIEW_URL||'http://127.0.0.1:3007');await page.locator('h1').waitFor();await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:'docs/screenshots/typography-mobile.png',fullPage:true});
await browser.close();
