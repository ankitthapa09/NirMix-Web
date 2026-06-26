import { z } from "zod";

/** Login form validation — matches backend ILoginRequest */
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/** Register form validation — matches backend IRegisterRequest */
export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  contact: z
    .string()
    .min(10, "Contact must be exactly 10 digits")
    .max(10, "Contact must be exactly 10 digits")
    .regex(
      /^[9][78]\d{8}$/,
      "Must be a valid Nepalese number starting with 97 or 98"
    ),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
