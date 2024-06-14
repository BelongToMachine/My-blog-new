import { z } from "zod";

export const issueSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Description is required").max(65535),
});

export const patchIssueSchema = z.object({
  title: z.string().min(1, "Title is required").max(255).optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(65535)
    .optional(),
  assignedTouserId: z
    .string()
    .min(1, "AssignedToUserId is required")
    .max(255)
    .optional()
    .nullable(),
});

export const contactSchema = z.object({
  user_name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  user_email: z.string().email({ message: "Invalid email address" }),
  message: z
    .string()
    .min(15, { message: "Message must be at least 15 characters long" }),
});

export type ContactFormErrors = {
  [key: string]: string;
};
