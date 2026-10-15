import {it,expect,vi} from 'vitest';
import {rentalSchema} from '@/lib/rental-validation';
it('blocks a past start using Vietnam date rather than visitor timezone',()=>{vi.useFakeTimers();vi.setSystemTime(new Date('2026-10-15T18:00:00Z'));try{expect(rentalSchema.safeParse({name:'Test Guest',email:'test@example.com',phone:'+447700900123',vehicleId:'blue',rentalPlan:'day',startDate:'2026-10-15',endDate:'2026-10-17',pickup:'hcm',locale:'en',consent:true}).success).toBe(false);}finally{vi.useRealTimers();}});
