export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  appName: "bug-to-pr",
  appDescription: "Transform stack traces into Pull Requests automatically with AI",
  github: {
    tokenUrl: "https://github.com/settings/tokens/new?scopes=repo",
  },
} as const;

export type Config = typeof config;

