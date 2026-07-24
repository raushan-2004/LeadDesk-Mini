import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'Please provide a valid email address' })
    .toLowerCase(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(100, { message: 'Password cannot exceed 100 characters' }),
}).strict();

export type LoginInput = z.infer<typeof loginSchema>;
