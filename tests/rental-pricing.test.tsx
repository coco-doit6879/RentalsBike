import React from 'react';
import {render,screen,fireEvent} from '@testing-library/react';
import {it,expect} from 'vitest';
import {RentalPricing} from '@/components/rental-pricing';
import {LanguageProvider,LanguageSwitch} from '@/components/language';
it('shows six confirmed poster plans and selected enquiry links in both languages',()=>{localStorage.clear();render(<LanguageProvider><LanguageSwitch/><RentalPricing/></LanguageProvider>);expect(screen.getAllByRole('article')).toHaveLength(6);expect(screen.getByText('400.000 ₫')).toBeVisible();expect(screen.getByText('16.000.000 ₫')).toBeVisible();expect(screen.getByRole('link',{name:'Chọn gói 1 tháng'})).toHaveAttribute('href','/rent?plan=month');fireEvent.click(screen.getByRole('button',{name:'English'}));expect(screen.getByRole('link',{name:'Choose 1 month'})).toBeVisible();expect(screen.getByText(/100,000/)).toBeVisible();});
