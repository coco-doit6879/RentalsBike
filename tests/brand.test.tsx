import React from 'react';
import {render,screen,fireEvent} from '@testing-library/react';
import {it,expect} from 'vitest';
import {BrandLogo,ForeignRenterNotice} from '@/components/brand';
import {LanguageProvider,LanguageSwitch} from '@/components/language';
it('shows MS TAM identity and a qualified foreign renter message in both languages',()=>{localStorage.clear();render(<LanguageProvider><LanguageSwitch/><BrandLogo/><ForeignRenterNotice/></LanguageProvider>);expect(screen.getByRole('link',{name:/MS TAM/})).toHaveAttribute('href','/');expect(screen.getByText('Legal for foreigners')).toBeVisible();expect(screen.getByText(/giấy tờ/)).toBeVisible();fireEvent.click(screen.getByRole('button',{name:'English'}));expect(screen.getByText(/Subject to valid documents/)).toBeVisible();});
