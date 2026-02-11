import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z 
    .string()
    .min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .refine((val) => val.trim().length >= 2, {
      message: 'Name must be at least 2 characters',
    }),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const trainSearchSchema = z
  .object({
    from: z
      .string()
      .min(1, 'Enter departure station')
      .refine((val) => val.trim().length > 0, {
        message: 'Enter departure station',
      }),
    to: z
      .string()
      .min(1, 'Enter arrival station')
      .refine((val) => val.trim().length > 0, {
        message: 'Enter arrival station',
      }),
    date: z
      .string()
      .min(1, 'Select departure date')
      .refine((val) => {
        if (!val) return false;
        const selectedDate = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      }, {
        message: 'Date cannot be in the past',
      }),
  })
  .refine((data) => data.from.trim().toLowerCase() !== data.to.trim().toLowerCase(), {
    message: 'Arrival station must be different from departure station',
    path: ['to'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type TrainSearchFormData = z.infer<typeof trainSearchSchema>;