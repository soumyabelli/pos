const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

function isLocalHost(hostname) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function resolveFallbackBaseUrl() {
  if (import.meta.env.DEV) {
    return "http://localhost:5000";
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    const { origin, hostname } = window.location;

    // If frontend and backend are deployed on the same host (or behind rewrites),
    // use the current origin to avoid stale hardcoded API domains.
    if (!isLocalHost(hostname)) {
      return origin;
    }
  }

  // Final fallback for non-browser builds or edge cases.
  return "https://independent-perception-production-1caf.up.railway.app";
}

const fallbackUrl = resolveFallbackBaseUrl();
export const API_BASE_URL = (configuredBaseUrl || fallbackUrl).replace(/\/+$/, "");

if (!configuredBaseUrl) {
  console.warn(`VITE_API_BASE_URL not set - using fallback ${fallbackUrl}.`);
}
