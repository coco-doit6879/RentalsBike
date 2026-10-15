import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test.beforeEach(async({page})=>{await page.addInitScript(()=>localStorage.setItem('evo-cookie-choice','essential'));});
for(const locale of ['vi','en'])for(const route of ['/','/models','/models/evo-lite','/rent','/how-it-works','/pricing','/locations','/about','/privacy','/terms','/admin'])test(`${locale} ${route} rental UI`,async({page})=>{
 await page.addInitScript(l=>localStorage.setItem('evo-language',l),locale);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));const response=await page.goto(route);expect(response?.status()).toBe(200);await expect(page.locator('html')).toHaveAttribute('lang',locale);await expect(page.locator('h1')).toHaveCount(1);await expect(page.locator('h1')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);expect(errors).toEqual([]);
});
test('language remains English across pages and reload',async({page})=>{await page.goto('/');await page.getByRole('button',{name:'English',exact:true}).click();await expect(page.locator('h1')).toContainText('Evo Grand Lite');await page.locator('.hero').getByRole('link',{name:'Request a rental'}).click();await expect(page.locator('html')).toHaveAttribute('lang','en');await page.reload();await expect(page.locator('html')).toHaveAttribute('lang','en');await expect(page.getByRole('form')).toBeVisible();});
test('public API never exposes enquiries',async({request})=>{expect((await request.get('/api/admin/rentals')).status()).toBe(401);expect((await request.get('/api/rentals')).status()).toBe(405);});
