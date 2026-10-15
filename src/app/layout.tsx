import React from 'react';
import type {Metadata} from 'next';
import './globals.css';
import './rental.css';
import './typography.css';
import {Header,Footer,CookieBanner,BackToTop} from '@/components/shell';
import {LanguageProvider,SkipLink} from '@/components/language';
import {siteUrl} from '@/lib/seo';
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:'Evo Lite Rentals — Thuê xe điện / Electric scooter rental',template:'%s | Evo Lite Rentals'},description:'Khám phá xe điện cho thuê và gửi yêu cầu thuê xe. Explore electric scooter rentals and send an enquiry. Vietnamese & English.',icons:{icon:'/favicon.svg'},robots:{index:false,follow:false},openGraph:{siteName:'Evo Lite Rentals',type:'website',images:['/og-image.svg']}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="vi" suppressHydrationWarning><body><LanguageProvider><SkipLink/><Header/><main id="main-content">{children}</main><Footer/><CookieBanner/><BackToTop/></LanguageProvider></body></html>;}
