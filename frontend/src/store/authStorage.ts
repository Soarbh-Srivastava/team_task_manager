import type { AuthUser } from "../types";

const STORAGE_KEY = "ttm_auth";

export function readStoredAuth() {
  if (typeof window === "undefined") {
    return { token: null, user: null as AuthUser | null };
  }

  const token = window.localStorage.getItem(`${STORAGE_KEY}_token`);
  const rawUser = window.localStorage.getItem(`${STORAGE_KEY}_user`);

  return {
    token,
    user: rawUser ? (JSON.parse(rawUser) as AuthUser) : null,
  };
}

export function getStoredToken() {
  return readStoredAuth().token;
}

export function persistStoredAuth(token: string | null, user: AuthUser | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (token && user) {
    window.localStorage.setItem(`${STORAGE_KEY}_token`, token);
    window.localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(user));
    return;
  }

  window.localStorage.removeItem(`${STORAGE_KEY}_token`);
  window.localStorage.removeItem(`${STORAGE_KEY}_user`);
}
