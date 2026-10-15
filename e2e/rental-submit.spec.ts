import {test,expect} from '@playwright/test';
test('saves an actual enquiry with its selected rental plan',async({page})=>{
 await page.addInitScript(()=>{localStorage.setItem('evo-language','en');localStorage.setItem('evo-cookie-choice','essential');});
 await page.goto('/rent?vehicle=pink&plan=week&pickup=hcm');
 await expect(page.getByRole('combobox',{name:'Rental package',exact:true})).toHaveValue('week');
 await page.getByLabel('Full name',{exact:true}).fill('Integration Test Guest');
 await page.getByLabel('Email',{exact:true}).fill('integration@example.com');
 await page.getByLabel('Phone (with country code)',{exact:true}).fill('+44 7700 900123');
 await page.getByLabel('Start date',{exact:true}).fill('2027-02-10');
 await page.getByLabel('Return date',{exact:true}).fill('2027-02-17');
 await page.getByRole('checkbox').check();
 const result=page.waitForResponse(r=>r.url().endsWith('/api/rentals')&&r.request().method()==='POST');
 await page.getByRole('button',{name:'Send enquiry'}).click();
 const response=await result;expect(response.status()).toBe(201);const data=await response.json();expect(data.status).toBe('new');await expect(page.getByRole('status')).toContainText(data.id);
});
