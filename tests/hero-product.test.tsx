import React from 'react';
import {render,screen,fireEvent} from '@testing-library/react';
import {it,expect,vi} from 'vitest';
vi.mock('@/components/rental-catalog',()=>({RentalCatalog:()=> <div/>}));
vi.mock('@/components/scooter-video',()=>({ScooterVideo:()=> <div/>}));
import {RentalHome} from '@/components/rental-home';
it('has exactly two product colors and wraps arrows between them',()=>{
 const {container}=render(<RentalHome/>);
 expect(container.querySelectorAll('.hero-pagination button')).toHaveLength(2);
 const photo=()=>container.querySelector('.hero-product img')!;
 expect(photo().getAttribute('src')).toContain('evo-grand-lite-lavender');
 fireEvent.click(screen.getByRole('button',{name:'Banner 2'}));
 expect(photo().getAttribute('src')).toContain('evo-grand-lite-white');
 expect(photo().getAttribute('alt')).toMatch(/trắng/i);
 fireEvent.click(screen.getByRole('button',{name:'Banner tiếp theo'}));
 expect(photo().getAttribute('src')).toContain('evo-grand-lite-lavender');
 fireEvent.click(screen.getByRole('button',{name:'Banner trước'}));
 expect(photo().getAttribute('src')).toContain('evo-grand-lite-white');
 expect(container.querySelector('.hero')).toHaveClass('hero-product-photo');
});

