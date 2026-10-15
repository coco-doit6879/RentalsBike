"use client";
import React,{createContext,useContext,useEffect,useState} from 'react';
export type Locale='vi'|'en';
type Language={locale:Locale;setLocale:(locale:Locale)=>void;t:(vi:string,en:string)=>string};
const Context=createContext<Language>({locale:'vi',setLocale:()=>{},t:(vi)=>vi});
export function LanguageProvider({children}:{children:React.ReactNode}){
 const [locale,setState]=useState<Locale>('vi');
 useEffect(()=>{try{const saved=localStorage.getItem('evo-language');if(saved==='en'||saved==='vi'){setState(saved);document.documentElement.lang=saved;}}catch{}},[]);
 const setLocale=(next:Locale)=>{setState(next);document.documentElement.lang=next;try{localStorage.setItem('evo-language',next);}catch{}};
 return <Context.Provider value={{locale,setLocale,t:(vi,en)=>locale==='vi'?vi:en}}>{children}</Context.Provider>;
}
export function useLanguage(){return useContext(Context);}
export function LanguageSwitch(){const {locale,setLocale}=useLanguage();return <div className="language-switch" role="group" aria-label="Language / Ngôn ngữ"><button lang="vi" aria-pressed={locale==='vi'} onClick={()=>setLocale('vi')}>Tiếng Việt</button><span aria-hidden="true">/</span><button lang="en" aria-pressed={locale==='en'} onClick={()=>setLocale('en')}>English</button></div>;}
export function SkipLink(){const {t}=useLanguage();return <a className="skip-link" href="#main-content">{t('Bỏ qua điều hướng','Skip to content')}</a>;}

