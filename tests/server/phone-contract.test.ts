// @vitest-environment node
import {it,expect} from 'vitest';
import {rentalSchema} from '@/server/validation';
it('accepts and normalizes international numbers entered by the public form',()=>{const result=rentalSchema(new Date('2026-10-15T00:00:00Z')).safeParse({name:'Test Guest',email:'test@example.com',phone:'+44 7700 900123',vehicleId:'blue',rentalPlan:'week',startDate:'2027-02-10',endDate:'2027-02-17',pickup:'hcm',locale:'en',consent:true});expect(result.success).toBe(true);if(result.success)expect(result.data.phone).toBe('+447700900123');});
