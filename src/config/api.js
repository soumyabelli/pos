const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

function resolveFallbackBaseUrl() {
  if (import.meta.env.DEV) {
    // Development: local backend
    return "http://localhost:5000";
  }

  // Production: Railway backend
  return "https://independent-perception-production-1caf.up.railway.app";
}

const fallbackUrl = resolveFallbackBaseUrl();

const resolvedBaseUrl = configuredBaseUrl || fallbackUrl;

export const API_BASE_URL = resolvedBaseUrl.replace(/\/+$/, "");

if (import.meta.env.DEV && !configuredBaseUrl) {
  console.info(`Development mode - using local backend at ${fallbackUrl}`);
} else if (!import.meta.env.DEV) {
  console.info(`Production mode - using Railway backend directly`);
}