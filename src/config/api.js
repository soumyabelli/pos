const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

// Fallback to Railway production URL if env var is not set
const FALLBACK_URL = "https://independent-perception-production-1caf.up.railway.app";

export const API_BASE_URL = (configuredBaseUrl || FALLBACK_URL).replace(/\/+$/, "");

if (!configuredBaseUrl) {
  console.warn("VITE_API_BASE_URL not set — using fallback Railway URL.");
}
