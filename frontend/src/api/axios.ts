import axios from "axios";
import { getStoredToken } from "../store/authStorage";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
