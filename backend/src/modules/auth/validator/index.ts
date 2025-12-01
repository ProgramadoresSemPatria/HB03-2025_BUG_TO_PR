import { z } from "zod";

export const createSessionSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must have at least 8 characters"),
});

export const createUserSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must have at least 8 characters"),
  githubPersonalAccessToken: z.string().min(1, "GitHub Personal Access Token is required"),
});
