import sharp from 'sharp';
import fs from 'node:fs/promises';
const source='D:/thuexe/b40dcb69-f656-4e13-b980-042842249e0e.jpg';
const dest='public/brand';await fs.mkdir(dest,{recursive:true});
const {data,info}=await sharp(source).raw().toBuffer({resolveWithObject:true});
let minX=info.width,minY=info.height,maxX=0,maxY=0;
for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){const i=(y*info.width+x)*info.channels;if(Math.min(data[i],data[i+1],data[i+2])<190){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}}
console.log('Ink bounds',{minX,minY,maxX,maxY});
await sharp(source).extract({left:Math.max(0,minX-14),top:Math.max(0,minY-14),width:Math.min(info.width,maxX+15)-Math.max(0,minX-14),height:Math.min(info.height,maxY+15)-Math.max(0,minY-14)}).webp({quality:94}).toFile(dest+'/ms-tam-full.webp');
await sharp(source).extract({left:165,top:320,width:270,height:365}).webp({quality:94}).toFile(dest+'/ms-tam-symbol.webp');
