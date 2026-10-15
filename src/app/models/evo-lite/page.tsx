import React from 'react';
import {RentalDetail} from '@/components/rental-catalog';
import {pageMetadata} from '@/lib/seo';
export const metadata=pageMetadata('Evo Lite — Xe cho thuê / Rental scooter','Khám phá Evo Lite và gửi yêu cầu thuê. Explore Evo Lite and send a rental enquiry.','/models/evo-lite');
export default function Page(){return <div className="page-wrapper"><RentalDetail/></div>;}
