import React from 'react';
import {render,screen,fireEvent} from '@testing-library/react';
import {it,expect,vi} from 'vitest';
vi.mock('@/components/rental-catalog',()=>({RentalCatalog:()=> <div>Catalog</div>}));
import {LanguageProvider,LanguageSwitch} from '@/components/language';
import {RentalHome} from '@/components/rental-home';
it('introduces rental rather than buying and translates carousel',()=>{localStorage.clear();render(<LanguageProvider><LanguageSwitch/><RentalHome/></LanguageProvider>);expect(screen.getByRole('heading',{level:1})).toHaveTextContent('Evo Grand Lite');expect(screen.getAllByRole('link',{name:/Đăng ký thuê xe/})[0]).toHaveAttribute('href','/rent');fireEvent.click(screen.getByRole('button',{name:'English'}));expect(screen.getByRole('heading',{level:1})).toHaveTextContent('Evo Grand Lite');fireEvent.click(screen.getByRole('button',{name:'Banner 2'}));expect(screen.getByRole('heading',{level:1})).toHaveTextContent('Pearl white elegance');});
