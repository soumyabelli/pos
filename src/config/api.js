const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

function resolveFallbackBaseUrl() {
  if (import.meta.env.DEV) {
    // Development: use local backend
    return "http://localhost:5000";
  }

  // Production: use Vercel rewrite rules to proxy /api/* to Railway backend
  // Vercel rewrites /api/* → https://independent-perception-production-1caf.up.railway.app/api/$1
  return "";
}

const fallbackUrl = resolveFallbackBaseUrl();
// Production: API_BASE_URL will be "" so /api/auth/login becomes a same-origin request
// which Vercel's rewrite rules will proxy to the Railway backend
// Development: API_BASE_URL will be http://localhost:5000
const resolvedBaseUrl = configuredBaseUrl || fallbackUrl;

export const API_BASE_URL = resolvedBaseUrl.replace(/\/+$/, "");

if (import.meta.env.DEV && !configuredBaseUrl) {
  console.info(`Development mode - using local backend at ${fallbackUrl}`);
} else if (!import.meta.env.DEV) {
  console.info(`Production mode - using Vercel API rewrites to Railway backend`);
}
