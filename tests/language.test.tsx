import React from 'react';
import {render,screen,fireEvent} from '@testing-library/react';
import {it,expect} from 'vitest';
import {LanguageProvider,LanguageSwitch,useLanguage} from '@/components/language';
function Example(){const {t}=useLanguage();return <><h1>{t('Thuê xe, khám phá thành phố.','Rent a ride. Discover the city.')}</h1><LanguageSwitch/></>}
it('switches all consumers and remembers preferred language',()=>{localStorage.clear();render(<LanguageProvider><Example/></LanguageProvider>);fireEvent.click(screen.getByRole('button',{name:'English'}));expect(screen.getByRole('heading')).toHaveTextContent('Rent a ride');expect(document.documentElement.lang).toBe('en');expect(localStorage.getItem('evo-language')).toBe('en');fireEvent.click(screen.getByRole('button',{name:'Tiếng Việt'}));expect(document.documentElement.lang).toBe('vi');});
