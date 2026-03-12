import { z } from "zod";

const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

export const createUserSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),

    email: z.string().email("Invalid email address").optional().or(z.literal("")),

    name: z.string().min(2, "Name is required"),

    password: z
      .string()
      .trim()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(strongPasswordRegex, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, and one special character",
      }),

    confirmPassword: z.string(),

    roleId: z.string().min(1, "Please select a role"),

    isActive: z.boolean().optional(),

    profileImageUrl: z.string().optional().nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updateUserSchema = z.object({
  email: z.string().email("Invalid email address").optional().or(z.literal("")),

  name: z.string().min(2, "Name must be at least 2 characters").optional(),

  roleId: z.string().optional(),

  isActive: z.boolean().optional(),

  profileImageUrl: z.string().optional().nullable(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
