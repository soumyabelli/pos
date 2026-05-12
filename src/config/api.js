const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

function resolveFallbackBaseUrl() {
  if (import.meta.env.DEV) {
    return "http://localhost:5000";
  }

  // In production we prefer same-origin API paths (/api/*),
  // which are proxied by Vercel rewrite rules.
  return "";
}

const fallbackUrl = resolveFallbackBaseUrl();
// Always prefer an explicitly configured API URL.
// Only fall back to same-origin proxy routes when no URL is configured.
const resolvedBaseUrl = configuredBaseUrl || fallbackUrl;

export const API_BASE_URL = resolvedBaseUrl.replace(/\/+$/, "");

if (!configuredBaseUrl) {
  console.warn(`VITE_API_BASE_URL not set - using fallback ${fallbackUrl}.`);
}
