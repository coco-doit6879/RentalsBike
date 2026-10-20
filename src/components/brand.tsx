"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {Globe2,ArrowUpRight} from 'lucide-react';
import {useLanguage} from './language';
export function BrandLogo({full=false}:{full?:boolean}){const {t}=useLanguage();return <Link className={`brand-logo ${full?'brand-logo-full':''}`} href="/" aria-label={t('MS TAM — Trang chủ','MS TAM — Home')}>{full?<Image src="/brand/ms-tam-full.webp" alt="MS TAM — Scooter & Apartment Rentals — 0907 306 700" width={743} height={433} sizes="280px"/>:<><span className="brand-emblem"><Image src="/brand/ms-tam-symbol.webp" alt="" width={270} height={365} sizes="60px" priority/></span><span className="brand-wordmark"><strong>MS TAM</strong><small>SCOOTER &<br/>APARTMENT RENTALS</small></span></>}</Link>;}
export function ForeignRenterNotice(){const {t}=useLanguage();return <aside className="foreign-renter-notice" aria-label={t('Thông tin dành cho khách quốc tế','Information for international renters')}><div className="foreign-renter-label"><Globe2 size={18} aria-hidden="true"/><span lang="en">Legal for foreigners</span><Link href="/terms" aria-label={t('Xem điều kiện thuê cho khách quốc tế','Read international rental conditions')}><ArrowUpRight size={17}/></Link></div><p>{t('Áp dụng khi đáp ứng điều kiện giấy tờ, độ tuổi và quy định điều khiển xe tại Việt Nam. Cần kiểm tra trước khi xác nhận thuê.','Subject to valid documents, age and riding requirements under Vietnamese law. Eligibility must be checked before rental confirmation.')}</p></aside>;}
