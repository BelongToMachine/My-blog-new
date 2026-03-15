import { z } from "zod";

export const createBlogSchema = (
  t: (key: string) => string = (key) => {
    const fallbacks: Record<string, string> = {
      titleRequired: "Title is required",
      descriptionRequired: "Description is required",
    };

    return fallbacks[key] ?? key;
  }
) =>
  z.object({
    title: z.string().min(1, t("titleRequired")).max(255),
    description: z.string().min(1, t("descriptionRequired")).max(65535),
    language: z.enum(["en", "zh"]).optional(),
  });

export const blogSchema = createBlogSchema();

export const patchBlogSchema = z.object({
  title: z.string().min(1, "Title is required").max(255).optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(65535)
    .optional(),
  assignedToUserId: z
    .string()
    .min(1, "AssignedToUserId is required")
    .max(255)
    .optional()
    .nullable(),
  language: z.enum(["en", "zh"]).optional(),
});

export const createContactSchema = (
  t: (key: string) => string = (key) => {
    const fallbacks: Record<string, string> = {
      nameMin: "Name must be at least 2 characters long",
      emailInvalid: "Invalid email address",
      messageMin: "Message must be at least 15 characters long",
    };

    return fallbacks[key] ?? key;
  }
) =>
  z.object({
    user_name: z.string().min(2, { message: t("nameMin") }),
    user_email: z.string().email({ message: t("emailInvalid") }),
    message: z.string().min(15, { message: t("messageMin") }),
  });

export const contactSchema = createContactSchema();

export type ContactFormErrors = {
  [key: string]: string;
};
