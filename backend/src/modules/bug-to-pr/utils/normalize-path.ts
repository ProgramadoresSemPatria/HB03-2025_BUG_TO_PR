export function normalizePath(path: string): string {
  let normalized = path.replace(/^(file:\/\/|https?:\/\/)/, "");

  if (normalized.startsWith("/")) {
    normalized = normalized.substring(1);
  }

  normalized = normalized.replace(/\/+/g, "/");
  
  normalized = normalized.replace(/\/$/, "");

  normalized = normalized.trim();

  return normalized || path;
}
