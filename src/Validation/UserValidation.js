import { z } from "zod";

export const userValidation = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(30, "Name must be at most 30 characters"),

  email: z
    .email(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(30)
    .regex(/[A-Z]/, "Must include one uppercase letter")
    .regex(/[a-z]/, "Must include one lowercase letter")
    .regex(/[0-9]/, "Must include one number")
});

export const loginValidation = z.object({
  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(1, "Password is required")
});

