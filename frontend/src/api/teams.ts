import api from "./axios";
import type { Team, TeamInput, TeamMemberInput } from "../types";

export async function listTeams() {
  const response = await api.get<Team[]>("/teams");
  return response.data;
}

export async function createTeam(input: TeamInput) {
  const response = await api.post<Team>("/teams", input);
  return response.data;
}

export async function addTeamMember(teamId: string, input: TeamMemberInput) {
  const response = await api.post<Team>(`/teams/${teamId}/members`, input);
  return response.data;
}
