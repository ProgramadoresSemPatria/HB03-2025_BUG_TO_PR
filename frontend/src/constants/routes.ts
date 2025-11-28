export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  HISTORY: "/history",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

