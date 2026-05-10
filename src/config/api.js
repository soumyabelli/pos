const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

function resolveFallbackBaseUrl() {
  if (import.meta.env.DEV) {
    return "http://localhost:5000";
  }

  // In production we prefer same-origin API paths (/api/*),
  // which are proxied by Vercel rewrite rules.
  return "";
}

function shouldForceVercelProxy() {
  if (import.meta.env.DEV || typeof window === "undefined") return false;
  return /\.vercel\.app$/i.test(window.location.hostname);
}

const fallbackUrl = resolveFallbackBaseUrl();
const resolvedBaseUrl = shouldForceVercelProxy()
  ? ""
  : (configuredBaseUrl || fallbackUrl);

export const API_BASE_URL = resolvedBaseUrl.replace(/\/+$/, "");

if (!configuredBaseUrl) {
  console.warn(`VITE_API_BASE_URL not set - using fallback ${fallbackUrl}.`);
}
