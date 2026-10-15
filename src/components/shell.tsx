"use client";
import React,{useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Search,Menu,X,ArrowUp,ArrowUpRight,ArrowRight} from 'lucide-react';
import {useLanguage,LanguageSwitch} from './language';
import {rentalRoutes} from '@/data/rental-content';
export function Header(){const {t,locale}=useLanguage();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [panel, setPanel] = useState<"menu" | "search" | null>(null);
  const [query, setQuery] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 30);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  useEffect(() => {
    if (!panel) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPanel(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [panel]);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!panel || !dialog) return;
    opener.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    if (dialog.showModal) dialog.showModal();
    const first = dialog.querySelector<HTMLElement>("button, input, a");
    first?.focus();
    return () => {
      dialog.close?.();
      document.body.style.overflow = "";
      opener.current?.focus();
    };
  }, [panel]);
  useEffect(() => {
    setPanel(null);
  }, [pathname]);

const links=[{href:'/pricing',label:t('Bảng giá','Rates')},{href:'/models',label:t('Xe cho thuê','Our scooters')},{href:'/how-it-works',label:t('Hướng dẫn thuê','How it works')},{href:'/locations',label:t('Điểm nhận xe','Locations')},{href:'/about',label:t('Về chúng tôi','About us')}];
const results=Object.entries(rentalRoutes).filter(([,r])=>`${r.vi} ${r.en} ${r.descriptionVi} ${r.descriptionEn}`.toLowerCase().includes(query.toLowerCase()));
return <><header className={`site-header ${pathname==='/'&&!scrolled?'on-hero':'solid'}`}><Link className="wordmark" href="/" aria-label={t('Evo Lite — Trang chủ','Evo Lite — Home')}>VinFast <span>Evo Lite</span><i>ELECTRIC SCOOTER RENTALS</i></Link><nav className="desktop-nav" aria-label={t('Điều hướng chính','Main navigation')}>{links.map(l=><Link href={l.href} key={l.href} aria-current={pathname===l.href?'page':undefined}>{l.label}</Link>)}</nav><div className="header-actions"><LanguageSwitch/><Link className="header-cta" href="/rent">{t('Đăng ký thuê','Rent a scooter')}<ArrowUpRight size={15}/></Link><button className="icon-button" aria-label={t('Tìm kiếm','Search')} onClick={()=>setPanel('search')}><Search size={21}/></button><button className="icon-button menu-toggle" aria-label={t('Mở menu','Open menu')} aria-expanded={panel==='menu'} onClick={()=>setPanel('menu')}><Menu size={23}/></button></div></header>{panel&&<dialog ref={dialogRef} open={typeof window!=='undefined'&&!HTMLDialogElement.prototype.showModal} className="nav-dialog" aria-modal="true" aria-label={panel==='menu'?t('Menu điều hướng','Navigation menu'):t('Tìm kiếm website','Site search')} onCancel={()=>setPanel(null)}><div className="dialog-top"><span className="wordmark">Evo Lite <span>Rentals</span></span><button className="icon-button" aria-label={t('Đóng','Close')} onClick={()=>setPanel(null)}><X/></button></div>{panel==='menu'?<nav className="mobile-nav">{links.map((l,i)=><Link key={l.href} href={l.href} onClick={()=>setPanel(null)}><small>0{i+1}</small>{l.label}<ArrowUpRight size={23}/></Link>)}<Link className="btn btn-light" href="/rent" onClick={()=>setPanel(null)}>{t('Đăng ký thuê xe','Request a rental')}<ArrowRight size={18}/></Link></nav>:<div className="search-content"><label htmlFor="site-search">{t('Bạn đang tìm kiếm điều gì?','What are you looking for?')}</label><input id="site-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={t('Xe cho thuê, điểm nhận, điều kiện…','Scooters, pickup locations, terms…')}/><p className="eyebrow">{results.length} {t('KẾT QUẢ','RESULTS')}</p>{results.length?results.map(([slug,r])=><Link href={`/${slug}`} key={slug} onClick={()=>setPanel(null)}>{locale==='vi'?r.vi:r.en}<ArrowUpRight size={19}/></Link>):<p>{t('Không tìm thấy kết quả phù hợp.','No matching results found.')}</p>}</div>}</dialog>}</>;}

export function CookieBanner(){const {t}=useLanguage();const [visible,setVisible]=useState(false);useEffect(()=>{try{setVisible(!localStorage.getItem('evo-cookie-choice'));}catch{setVisible(true);}},[]);function choose(value:string){try{localStorage.setItem('evo-cookie-choice',value);}catch{}setVisible(false);}return visible?<section className="cookie-banner" aria-label={t('Tùy chọn quyền riêng tư','Privacy choices')}><div><strong>{t('Lựa chọn của bạn. Quyền riêng tư của bạn.','Your choice. Your privacy.')}</strong><p>{t('Lưu lựa chọn ngôn ngữ; phiên quản trị dùng cookie thiết yếu. Không có cookie quảng cáo.','Language preferences are saved; admin sessions use essential cookies. No advertising cookies.')} <Link href="/privacy">{t('Tìm hiểu thêm','Learn more')}</Link></p></div><div className="cookie-actions"><button onClick={()=>choose('essential')}>{t('Chỉ thiết yếu','Essential only')}</button><button onClick={()=>choose('accepted')}>{t('Đồng ý','Accept')}<ArrowRight size={15}/></button></div></section>:null;}
export function BackToTop(){const {t}=useLanguage();const [visible,setVisible]=useState(false);useEffect(()=>{const update=()=>setVisible(window.scrollY>700);window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update);},[]);return visible?<button className="back-top icon-button" aria-label={t('Về đầu trang','Back to top')} onClick={()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}><ArrowUp size={20}/></button>:null;}
export function Footer(){const {t}=useLanguage();return <footer className="site-footer"><div className="container"><div className="footer-top"><div className="footer-brand"><Link className="wordmark" href="/">Evo Lite <span>Rentals</span></Link><p>{t('Thuê xe tinh gọn. Hành trình rộng mở.','A considered ride. A world to explore.')}</p><span className="demo-label">INDEPENDENT RENTAL WEBSITE</span></div><div><h2>{t('Khám phá','Explore')}</h2><Link href="/models">{t('Xe cho thuê','Rental scooters')}</Link><Link href="/rent">{t('Đăng ký thuê xe','Request a rental')}</Link><Link href="/pricing">{t('Bảng giá thuê','Rental rates')}</Link><Link href="/how-it-works">{t('Hướng dẫn thuê','How it works')}</Link></div><div><h2>{t('Thông tin hữu ích','Useful information')}</h2><Link href="/locations">{t('Điểm nhận xe','Pickup locations')}</Link><Link href="/terms">{t('Điều kiện thuê','Rental terms')}</Link><Link href="/privacy">{t('Chính sách bảo mật','Privacy policy')}</Link><Link href="/admin">{t('Quản trị yêu cầu','Manage enquiries')}</Link></div><div><h2>{t('Kết nối','Get in touch')}</h2><p>{t('Thông tin doanh nghiệp, địa chỉ và hotline đang chờ cập nhật.','Business details, addresses and contact numbers are awaiting confirmation.')}</p><Link href="/rent">{t('Gửi yêu cầu tư vấn','Send an enquiry')}<ArrowUpRight size={14}/></Link></div></div><div className="footer-bottom"><p>© {new Date().getFullYear()} Evo Lite Rentals.</p><div><Link href="/privacy">{t('Quyền riêng tư','Privacy')}</Link><Link href="/terms">{t('Điều khoản','Terms')}</Link><button onClick={()=>{try{localStorage.removeItem('evo-cookie-choice');}catch{}window.location.reload();}}>{t('Tùy chọn cookie','Cookie choices')}</button></div></div><p className="footer-disclaimer">{t('Website cho thuê độc lập, không phải trang chính thức hoặc đại diện VinFast. Ảnh concept và thông tin xe/điểm nhận đang là minh họa. Bản local lưu yêu cầu thật; dùng dữ liệu thử nghiệm cho đến khi hoàn thiện thông tin pháp lý.','Independent rental website, not an official VinFast site or representative. Concept images and vehicle/pickup information are illustrative. This local build saves actual enquiries; use test data until legal and business information is finalised.')}</p></div></footer>;}
