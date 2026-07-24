import { z } from 'zod';
import { BUDGET_RANGES, LEAD_STATUSES } from '@/constants/lead';

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(80, { message: 'Name cannot exceed 80 characters' }),
  email: z
    .string()
    .trim()
    .email({ message: 'Please provide a valid email address' })
    .toLowerCase(),
  budget: z.enum(BUDGET_RANGES, {
    message: 'Please select a valid budget range',
  }),
  message: z
    .string()
    .trim()
    .min(10, { message: 'Message must be at least 10 characters' })
    .max(2000, { message: 'Message cannot exceed 2000 characters' }),
}).strict();

export const leadStatusSchema = z.object({
  status: z.enum(LEAD_STATUSES, {
    message: 'Please select a valid status',
  }),
}).strict();

export type CreateLeadInput = z.infer<typeof leadSchema>;
export type UpdateLeadStatusInput = z.infer<typeof leadStatusSchema>;
