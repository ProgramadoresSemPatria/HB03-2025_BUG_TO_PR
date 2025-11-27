import type { ChangelogItem } from "@/types";

export const CHANGELOG: ChangelogItem[] = [
  {
    version: "v0.3.0",
    date: "Nov 2024",
    title: "Multi-language Support",
    description: "Now supports JavaScript, TypeScript, Python, Java, and Go stack traces",
    type: "feature",
  },
  {
    version: "v0.2.0",
    date: "Nov 2024",
    title: "AI-Powered Analysis",
    description: "Integrated LLM for intelligent bug detection and fix generation",
    type: "feature",
  },
  {
    version: "v0.1.0",
    date: "Oct 2024",
    title: "Initial Release",
    description: "Basic stack trace parsing and GitHub PR creation",
    type: "release",
  },
];

