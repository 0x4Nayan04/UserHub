import { z } from "zod";

// Multi-step form validation schemas
export const basicInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[\d\s-()]+$/, "Please enter a valid phone number"),
});

export const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  zip: z.string().min(5, "ZIP code must be at least 5 characters"),
});

export const completeFormSchema = basicInfoSchema.merge(addressSchema);

export type BasicInfo = z.infer<typeof basicInfoSchema>;
export type Address = z.infer<typeof addressSchema>;
export type CompleteForm = z.infer<typeof completeFormSchema>;

// User type from API
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    zipcode: string;
  };
}
