import api from "./axios";
import type {
  AuthCredentials,
  AuthResponse,
  SignupCredentials,
} from "../types";

export async function login(credentials: AuthCredentials) {
  const response = await api.post<AuthResponse>("/auth/login", credentials);
  return response.data;
}

export async function signup(credentials: SignupCredentials) {
  const response = await api.post<AuthResponse>("/auth/signup", credentials);
  return response.data;
}
