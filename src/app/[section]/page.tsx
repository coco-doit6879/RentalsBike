import React from 'react';
import {notFound,redirect} from 'next/navigation';
import {rentalRoutes} from '@/data/rental-content';
import {RentalPage} from '@/components/rental-pages';
import {pageMetadata} from '@/lib/seo';
const redirects:Record<string,string>={inventory:'/models','test-drive':'/rent',service:'/how-it-works',dealers:'/locations',news:'/how-it-works',careers:'/about'};
export const dynamicParams=false;
export function generateStaticParams(){return [...Object.keys(rentalRoutes),...Object.keys(redirects)].map(section=>({section}));}
export async function generateMetadata({params}:{params:Promise<{section:string}>}){const {section}=await params;const r=rentalRoutes[section];return r?pageMetadata(`${r.vi} / ${r.en}`,`${r.descriptionVi} ${r.descriptionEn}`,`/${section}`):{};}
export default async function Page({params}:{params:Promise<{section:string}>}){const {section}=await params;if(redirects[section])redirect(redirects[section]);if(!rentalRoutes[section])notFound();return <RentalPage section={section}/>;}
