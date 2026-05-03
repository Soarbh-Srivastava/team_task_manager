import { api } from "../api/axios";

type Credentials = { email: string; password: string };

export async function login(credentials: Credentials) {
  try {
    const res = await api.post("/auth/login", credentials);
    const token = res.data?.token;
    if (token) localStorage.setItem("ttm_token", token);
    return token;
  } catch (e) {
    console.error("login failed", e);
    throw e;
  }
}

export function logout() {
  localStorage.removeItem("ttm_token");
}

export function getToken() {
  return localStorage.getItem("ttm_token");
}
