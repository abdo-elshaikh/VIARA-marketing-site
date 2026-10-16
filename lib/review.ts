import { z } from 'zod';
import { healthcareSystems } from './healthcare-catalog.mjs';
export const reviewSystemSchema = z.string().refine(id => healthcareSystems.some(system => system.id === id) || ['EMR', 'AI'].includes(id), 'Unknown healthcare system');
export const reviewSchema = z.object({
  systemId: reviewSystemSchema.nullable().optional(),
  id:z.string().uuid(),name:z.string().trim().min(2).max(100),role:z.string().trim().max(100).default(''),
  organization:z.string().trim().max(150).default(''),quote:z.string().trim().min(10).max(1500),
  rating:z.number().int().min(1).max(5),locale:z.enum(['ar','en']),consent:z.literal(true),website:z.string().max(0).optional(),
});
