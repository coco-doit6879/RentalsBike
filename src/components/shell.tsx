"use client";
import React,{useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Search,Menu,X,ArrowUp,ArrowUpRight,ArrowRight} from 'lucide-react';
import {useLanguage,LanguageSwitch} from './language';
import {rentalRoutes} from '@/data/rental-content';
import {BrandLogo} from './brand';
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
return <><header className={`site-header ${pathname==='/'&&!scrolled?'on-hero':'solid'}`}><BrandLogo/><nav className="desktop-nav" aria-label={t('Điều hướng chính','Main navigation')}>{links.map(l=><Link href={l.href} key={l.href} aria-current={pathname===l.href?'page':undefined}>{l.label}</Link>)}</nav><div className="header-actions"><LanguageSwitch/><Link className="header-cta" href="/rent">{t('Đăng ký thuê','Rent a scooter')}<ArrowUpRight size={15}/></Link><button className="icon-button" aria-label={t('Tìm kiếm','Search')} onClick={()=>setPanel('search')}><Search size={21}/></button><button className="icon-button menu-toggle" aria-label={t('Mở menu','Open menu')} aria-expanded={panel==='menu'} onClick={()=>setPanel('menu')}><Menu size={23}/></button></div></header>{panel&&<dialog ref={dialogRef} open={typeof window!=='undefined'&&!HTMLDialogElement.prototype.showModal} className="nav-dialog" aria-modal="true" aria-label={panel==='menu'?t('Menu điều hướng','Navigation menu'):t('Tìm kiếm website','Site search')} onCancel={()=>setPanel(null)}><div className="dialog-top"><BrandLogo/><button className="icon-button" aria-label={t('Đóng','Close')} onClick={()=>setPanel(null)}><X/></button></div>{panel==='menu'?<nav className="mobile-nav">{links.map((l,i)=><Link key={l.href} href={l.href} onClick={()=>setPanel(null)}><small>0{i+1}</small>{l.label}<ArrowUpRight size={23}/></Link>)}<Link className="btn btn-light" href="/rent" onClick={()=>setPanel(null)}>{t('Đăng ký thuê xe','Request a rental')}<ArrowRight size={18}/></Link></nav>:<div className="search-content"><label htmlFor="site-search">{t('Bạn đang tìm kiếm điều gì?','What are you looking for?')}</label><input id="site-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={t('Xe cho thuê, điểm nhận, điều kiện…','Scooters, pickup locations, terms…')}/><p className="eyebrow">{results.length} {t('KẾT QUẢ','RESULTS')}</p>{results.length?results.map(([slug,r])=><Link href={`/${slug}`} key={slug} onClick={()=>setPanel(null)}>{locale==='vi'?r.vi:r.en}<ArrowUpRight size={19}/></Link>):<p>{t('Không tìm thấy kết quả phù hợp.','No matching results found.')}</p>}</div>}</dialog>}</>;}

export function CookieBanner(){const {t}=useLanguage();const [visible,setVisible]=useState(false);useEffect(()=>{try{setVisible(!localStorage.getItem('evo-cookie-choice'));}catch{setVisible(true);}},[]);function choose(value:string){try{localStorage.setItem('evo-cookie-choice',value);}catch{}setVisible(false);}return visible?<section className="cookie-banner" aria-label={t('Tùy chọn quyền riêng tư','Privacy choices')}><div><strong>{t('Lựa chọn của bạn. Quyền riêng tư của bạn.','Your choice. Your privacy.')}</strong><p>{t('Lưu lựa chọn ngôn ngữ; phiên quản trị dùng cookie thiết yếu. Không có cookie quảng cáo.','Language preferences are saved; admin sessions use essential cookies. No advertising cookies.')} <Link href="/privacy">{t('Tìm hiểu thêm','Learn more')}</Link></p></div><div className="cookie-actions"><button onClick={()=>choose('essential')}>{t('Chỉ thiết yếu','Essential only')}</button><button onClick={()=>choose('accepted')}>{t('Đồng ý','Accept')}<ArrowRight size={15}/></button></div></section>:null;}
export function BackToTop(){const {t}=useLanguage();const [visible,setVisible]=useState(false);useEffect(()=>{const update=()=>setVisible(window.scrollY>700);window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update);},[]);return visible?<button className="back-top icon-button" aria-label={t('Về đầu trang','Back to top')} onClick={()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}><ArrowUp size={20}/></button>:null;}
export function Footer(){const {t}=useLanguage();return <footer className="site-footer"><div className="container"><div className="footer-top"><div className="footer-brand"><BrandLogo full/><p>{t('Thuê xe tinh gọn. Hành trình rộng mở.','A considered ride. A world to explore.')}</p><span className="demo-label">INDEPENDENT RENTAL WEBSITE</span></div><div><h2>{t('Khám phá','Explore')}</h2><Link href="/models">{t('Xe cho thuê','Rental scooters')}</Link><Link href="/rent">{t('Đăng ký thuê xe','Request a rental')}</Link><Link href="/pricing">{t('Bảng giá thuê','Rental rates')}</Link><Link href="/how-it-works">{t('Hướng dẫn thuê','How it works')}</Link></div><div><h2>{t('Thông tin hữu ích','Useful information')}</h2><Link href="/locations">{t('Điểm nhận xe','Pickup locations')}</Link><Link href="/terms">{t('Điều kiện thuê','Rental terms')}</Link><Link href="/privacy">{t('Chính sách bảo mật','Privacy policy')}</Link><Link href="/admin">{t('Quản trị yêu cầu','Manage enquiries')}</Link></div><div><h2>{t('Kết nối','Get in touch')}</h2><p>{t('Cho thuê xe điện & căn hộ. Địa chỉ nhận xe cần xác nhận trước khi đến.','Scooter & apartment rentals. Confirm pickup details before arrival.')}</p><a href="tel:+84797330518">0797 330 518</a><a href="https://wa.me/84797330518" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#25D366", fontWeight: 600 }}>WhatsApp: 0797 330 518</a><Link href="/rent">{t('Gửi yêu cầu tư vấn','Send an enquiry')}<ArrowUpRight size={14}/></Link></div></div><div className="footer-bottom"><p>© {new Date().getFullYear()} MS TAM Rentals.</p><div><Link href="/privacy">{t('Quyền riêng tư','Privacy')}</Link><Link href="/terms">{t('Điều khoản','Terms')}</Link><button onClick={()=>{try{localStorage.removeItem('evo-cookie-choice');}catch{}window.location.reload();}}>{t('Tùy chọn cookie','Cookie choices')}</button></div></div><p className="footer-disclaimer">{t('Website cho thuê độc lập, không phải trang chính thức hoặc đại diện VinFast. Ảnh concept và thông tin xe/điểm nhận đang là minh họa. Bản local lưu yêu cầu thật; dùng dữ liệu thử nghiệm cho đến khi hoàn thiện thông tin pháp lý.','Independent rental website, not an official VinFast site or representative. Concept images and vehicle/pickup information are illustrative. This local build saves actual enquiries; use test data until legal and business information is finalised.')}</p></div></footer>;}

export function WhatsAppButton() {
  const { t } = useLanguage();
  return (
    <aside aria-label="WhatsApp Support">
      <a
        href="https://wa.me/84797330518"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label={t("Chat qua WhatsApp: 0797 330 518", "Chat on WhatsApp: +84 797 330 518")}
        title={t("Chat qua WhatsApp: 0797 330 518", "Chat on WhatsApp: +84 797 330 518")}
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.57C9.33 7.57 9.04 7.65 8.78 7.93C8.52 8.21 7.79 8.9 7.79 10.3C7.79 11.7 8.81 13.06 8.95 13.25C9.1 13.44 10.97 16.33 13.83 17.56C14.51 17.85 15.04 18.03 15.45 18.16C16.14 18.38 16.76 18.35 17.26 18.28C17.81 18.19 18.96 17.58 19.2 16.9C19.44 16.22 19.44 15.64 19.37 15.52C19.3 15.4 19.11 15.33 18.82 15.19C18.53 15.05 17.13 14.36 16.87 14.26C16.61 14.17 16.42 14.12 16.23 14.41C16.03 14.69 15.46 15.36 15.29 15.56C15.11 15.75 14.94 15.77 14.65 15.63C14.36 15.48 13.42 15.18 12.31 14.19C11.45 13.42 10.87 12.47 10.73 12.22C10.58 11.98 10.71 11.84 10.86 11.7C10.99 11.57 11.15 11.36 11.29 11.2C11.44 11.03 11.49 10.91 11.59 10.72C11.68 10.52 11.63 10.35 11.56 10.21C11.49 10.07 10.91 8.64 10.66 8.06C10.43 7.49 10.19 7.57 10.02 7.56C9.86 7.56 9.69 7.57 9.53 7.57Z"/>
        </svg>
        <span className="whatsapp-label">WhatsApp</span>
      </a>
    </aside>
  );
}

