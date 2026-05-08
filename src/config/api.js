const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL = (configuredBaseUrl || "").replace(/\/+$/, "");

if (!API_BASE_URL) {
  console.error("Missing VITE_API_BASE_URL. Set it in Vercel project environment variables.");
}
