import api from "./axios";
import type { Task, TaskInput, TaskStatus, TaskStatusInput } from "../types";

export async function listProjectTasks(projectId: string) {
  const response = await api.get<Task[]>(`/tasks/${projectId}`);
  return response.data;
}

export async function createTask(input: TaskInput) {
  const response = await api.post<Task>("/tasks", input);
  return response.data;
}

export async function updateTaskStatus(taskId: string, input: TaskStatusInput) {
  const response = await api.patch<Task>(`/tasks/${taskId}/status`, input);
  return response.data;
}
