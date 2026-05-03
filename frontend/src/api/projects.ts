import api from "./axios";
import type { Project, ProjectInput } from "../types";

export async function listProjects(teamId?: string) {
  const response = await api.get<Project[]>("/projects", {
    params: teamId ? { teamId } : undefined,
  });

  return response.data;
}

export async function createProject(input: ProjectInput) {
  const response = await api.post<Project>("/projects", input);
  return response.data;
}
