import { z } from "zod";

const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

export const signInSchema = z.object({
  username: z.string().trim().min(1, { message: "Please enter your username" }),

  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(strongPasswordRegex, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one special character",
    }),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "Please enter your full name"),

  email: z.string().trim().email("Email is invalid"),

  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(strongPasswordRegex, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one special character",
    }),
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
