import api from "./axios";
import type { DashboardSummary } from "../types";

export async function getDashboardSummary() {
  const response = await api.get<DashboardSummary>("/dashboard/summary");
  return response.data;
}
