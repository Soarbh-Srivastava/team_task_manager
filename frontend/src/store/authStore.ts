import { useSyncExternalStore } from "react";
import { login as loginRequest, signup as signupRequest } from "../api/auth";
import { persistStoredAuth, readStoredAuth } from "./authStorage";
import type {
  AuthCredentials,
  AuthResponse,
  AuthUser,
  SignupCredentials,
} from "../types";

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  hydrated: boolean;
};

let state: AuthState = {
  ...readStoredAuth(),
  hydrated: true,
};
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function persistAuth(nextState: AuthState) {
  persistStoredAuth(nextState.token, nextState.user);
}

function setState(nextState: Partial<AuthState>) {
  state = { ...state, ...nextState };
  persistAuth(state);
  emitChange();
}

function applyAuthResponse(response: AuthResponse) {
  setState({ token: response.token, user: response.user, hydrated: true });
}

export function subscribeAuthStore(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAuthSnapshot() {
  return state;
}

export function getStoredToken() {
  return state.token;
}

export function useAuthStore<T>(selector: (snapshot: AuthState) => T) {
  return useSyncExternalStore(
    subscribeAuthStore,
    () => selector(getAuthSnapshot()),
    () => selector({ token: null, user: null, hydrated: false }),
  );
}

export async function login(credentials: AuthCredentials) {
  const response = await loginRequest(credentials);
  applyAuthResponse(response);
  return response;
}

export async function signup(credentials: SignupCredentials) {
  const response = await signupRequest(credentials);
  applyAuthResponse(response);
  return response;
}

export function logout() {
  setState({ token: null, user: null, hydrated: true });
}
