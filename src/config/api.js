const DEV_API_BASE_URL = "http://localhost:5000/api";
const PROD_API_BASE_URL = "https://pos-production-e828.up.railway.app/api";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const fallbackBaseUrl = import.meta.env.PROD ? PROD_API_BASE_URL : DEV_API_BASE_URL;

export const API_BASE_URL = (configuredBaseUrl || fallbackBaseUrl).replace(/\/+$/, "");
