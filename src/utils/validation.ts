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

export const createTrainSchema = z.object({
  trainNumber: z
    .string()
    .min(1, 'Train number is required')
    .min(3, 'Train number must be at least 3 characters')
    .refine((val) => val.trim().length >= 3, {
      message: 'Train number must be at least 3 characters',
    }),
  totalSeats: z
    .number()
    .int('Total seats must be an integer')
    .min(1, 'Total seats must be at least 1'),
});

export const createStopSchema = z.object({
  stationName: z.string().min(1, 'Station name is required'),
  arrivalDateTime: z.string().min(1, 'Arrival date and time is required'),
  departureDateTime: z.string().min(1, 'Departure date and time is required'),
  stopNumber: z.number().int('Stop number must be an integer').min(1, 'Stop number must be at least 1'),
  priceFromStart: z.number().min(0, 'Price from start must be 0 or greater'),
});

export const createRouteSchema = z.object({
  trainId: z.string().uuid('Invalid train ID'),
  departureDateTime: z.string().min(1, 'Departure date and time is required'),
  stops: z.array(createStopSchema).min(1, 'At least one stop is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type TrainSearchFormData = z.infer<typeof trainSearchSchema>;
export type CreateTrainFormData = z.infer<typeof createTrainSchema>;
export type CreateStopFormData = z.infer<typeof createStopSchema>;
export type CreateRouteFormData = z.infer<typeof createRouteSchema>;