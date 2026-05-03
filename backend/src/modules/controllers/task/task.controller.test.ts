import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../../utils/request-validation", () => ({
  parseTaskBody: vi.fn(),
  parseTaskStatusBody: vi.fn(),
}));

vi.mock("./task.service", () => ({
  TaskService: {
    createTask: vi.fn(),
    getTasksByProject: vi.fn(),
    updateTaskStatus: vi.fn(),
  },
}));

import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";
import {
  parseTaskBody,
  parseTaskStatusBody,
} from "../../../utils/request-validation";

const mockedTaskService = vi.mocked(TaskService);
const mockedParseTaskBody = vi.mocked(parseTaskBody);
const mockedParseTaskStatusBody = vi.mocked(parseTaskStatusBody);

function createResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response;
}

describe("TaskController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when creating a task without auth", async () => {
    const req = {
      body: {
        projectId: "project-1",
        title: "Create wireframes",
      },
      user: undefined,
    } as Request;
    const res = createResponse();

    await TaskController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    expect(mockedTaskService.createTask).not.toHaveBeenCalled();
  });

  it("creates a task for the authenticated user", async () => {
    const req = {
      body: {
        projectId: "project-1",
        title: "Create wireframes",
        description: "Design the first screens",
        priority: "High",
        status: "Todo",
        dueDate: "2026-06-02T00:00:00.000Z",
      },
      user: {
        id: "user-1",
        email: "member@example.com",
        role: "Member",
      },
    } as Request;
    const res = createResponse();
    const task = {
      id: "task-1",
      title: "Create wireframes",
    };

    mockedParseTaskBody.mockReturnValueOnce({
      projectId: "project-1",
      title: "Create wireframes",
      description: "Design the first screens",
      priority: "High",
      status: "Todo",
      dueDate: "2026-06-02T00:00:00.000Z",
    });
    mockedTaskService.createTask.mockResolvedValueOnce(task as never);

    await TaskController.create(req, res);

    expect(mockedParseTaskBody).toHaveBeenCalledWith(req.body);
    expect(mockedTaskService.createTask).toHaveBeenCalledWith(
      {
        projectId: "project-1",
        title: "Create wireframes",
        description: "Design the first screens",
        priority: "High",
        status: "Todo",
        dueDate: "2026-06-02T00:00:00.000Z",
      },
      req.user,
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(task);
  });

  it("returns tasks for a project", async () => {
    const req = {
      params: { projectId: "project-1" },
      user: {
        id: "user-1",
        email: "member@example.com",
        role: "Member",
      },
    } as Request;
    const res = createResponse();
    const tasks = [{ id: "task-1", title: "Create wireframes" }];

    mockedTaskService.getTasksByProject.mockResolvedValueOnce(tasks as never);

    await TaskController.getProjectTasks(req, res);

    expect(mockedTaskService.getTasksByProject).toHaveBeenCalledWith(
      "project-1",
      req.user,
    );
    expect(res.json).toHaveBeenCalledWith(tasks);
  });

  it("updates a task status", async () => {
    const req = {
      params: { taskId: "task-1" },
      body: { status: "Done" },
      user: {
        id: "user-1",
        email: "member@example.com",
        role: "Member",
      },
    } as Request;
    const res = createResponse();
    const task = {
      id: "task-1",
      status: "Done",
    };

    mockedParseTaskStatusBody.mockReturnValueOnce({ status: "Done" });
    mockedTaskService.updateTaskStatus.mockResolvedValueOnce(task as never);

    await TaskController.updateStatus(req, res);

    expect(mockedParseTaskStatusBody).toHaveBeenCalledWith(req.body);
    expect(mockedTaskService.updateTaskStatus).toHaveBeenCalledWith(
      "task-1",
      "Done",
      req.user,
    );
    expect(res.json).toHaveBeenCalledWith(task);
  });

  it("returns 401 when updating a task without auth", async () => {
    const req = {
      params: { taskId: "task-1" },
      body: { status: "Done" },
      user: undefined,
    } as Request;
    const res = createResponse();

    await TaskController.updateStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    expect(mockedTaskService.updateTaskStatus).not.toHaveBeenCalled();
  });
});
