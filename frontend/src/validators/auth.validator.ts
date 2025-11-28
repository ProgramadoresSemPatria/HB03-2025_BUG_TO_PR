import { z } from "zod";

export const createSessionSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
});

export const createUserSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  githubToken: z.string().min(1, "GitHub Personal Access Token é obrigatório"),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;

