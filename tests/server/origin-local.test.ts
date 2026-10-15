// @vitest-environment node
import {it,expect} from 'vitest';
import {RentalStore} from '@/server/store';
import {createApi} from '@/server/api';
import {mkdtempSync,rmSync} from 'node:fs';import {join} from 'node:path';
it('supports loopback browser origin when Next binds to 0.0.0.0 without allowing remote origins',async()=>{const dir=mkdtempSync(join(process.env.TMPDIR!,'origin-'));const store=new RentalStore(join(dir,'db.sqlite'));const api=createApi({store});try{for(const origin of ['http://127.0.0.1:3005','http://localhost:3005','http://evil.test:3005']){const res=await api.submit(new Request('http://0.0.0.0:3005/api/rentals',{method:'POST',headers:{origin,'content-type':'application/json'},body:'{}'}));expect(res.status).toBe(origin.includes('evil')?403:400);}}finally{store.close();rmSync(dir,{recursive:true,force:true});}});
