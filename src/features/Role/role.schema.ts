import { z } from "zod";

import type { RoleFormValues } from "@/types/role.type";

export const roleFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Please enter role name" })
    .max(100, { message: "Role name must be at most 100 characters" }),

  description: z
    .string()
    .trim()
    .max(255, { message: "Description must be at most 255 characters" })
    .optional()
    .or(z.literal("")),

  isActive: z.boolean().optional(),

  permissionIds: z
    .array(z.string().min(1))
    .min(1, { message: "Please select at least one permission" }),
});

export type RoleFormSchema = typeof roleFormSchema;
export type RoleFormData = z.infer<typeof roleFormSchema> & RoleFormValues;
