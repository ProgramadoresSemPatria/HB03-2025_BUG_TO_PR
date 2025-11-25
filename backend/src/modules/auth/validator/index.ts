import z from "zod";

export const createSessionValidator = z.object({
  body: z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  }),
});

export const createUserValidator = z.object({
  body: z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
    githubPersonalAccessToken: z.string().min(1, "GitHub Personal Access Token é obrigatório"),
  }),
});