import axios from "axios";
import { getStoredToken } from "../store/authStorage";

const baseURL = "https://eloquent-adaptation-production-afb7.up.railway.app/auth/signup",
Request Method
POST";

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
