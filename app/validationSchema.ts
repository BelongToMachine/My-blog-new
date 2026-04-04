import { z } from "zod"

export const createBlogSchema = (
  t: (key: string) => string = (key) => {
    const fallbacks: Record<string, string> = {
      titleRequired: "Title is required",
      descriptionRequired: "Description is required",
    }

    return fallbacks[key] ?? key
  }
) =>
  z.object({
    title: z.string().min(1, t("titleRequired")).max(255),
    description: z.string().min(1, t("descriptionRequired")).max(65535),
    language: z.enum(["en", "zh"]).optional(),
  })

export const blogSchema = createBlogSchema()

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
})
