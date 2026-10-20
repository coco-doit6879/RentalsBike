import type {MetadataRoute} from 'next';
import {rentalRoutes} from '@/data/rental-content';
import {siteUrl} from '@/lib/seo';
export const dynamic = "force-static";
export default function sitemap():MetadataRoute.Sitemap{return ['/',...Object.keys(rentalRoutes).map(r=>`/${r}`),'/models/evo-lite'].map(path=>({url:`${siteUrl}${path}`,changeFrequency:'monthly',priority:path==='/'?1:0.7}));}
