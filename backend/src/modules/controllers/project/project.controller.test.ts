import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../../utils/request-validation", () => ({
  parseProjectBody: vi.fn(),
}));

vi.mock("./project.service", () => ({
  ProjectService: {
    createProject: vi.fn(),
    listProjects: vi.fn(),
  },
}));

import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { parseProjectBody } from "../../../utils/request-validation";

const mockedProjectService = vi.mocked(ProjectService);
const mockedParseProjectBody = vi.mocked(parseProjectBody);

function createResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response;
}

describe("ProjectController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when creating a project without auth", async () => {
    const req = {
      body: {
        teamId: "team-1",
        name: "Project Alpha",
        description: "Launch work",
      },
      user: undefined,
    } as Request;
    const res = createResponse();

    await ProjectController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    expect(mockedProjectService.createProject).not.toHaveBeenCalled();
  });

  it("creates a project for the current user", async () => {
    const req = {
      body: {
        teamId: "team-1",
        name: "Project Alpha",
        description: "Launch work",
        deadline: "2026-06-01T00:00:00.000Z",
      },
      user: {
        id: "user-1",
        email: "owner@example.com",
        role: "Member",
      },
    } as Request;
    const res = createResponse();
    const project = {
      id: "project-1",
      name: "Project Alpha",
      description: "Launch work",
      deadline: "2026-06-01T00:00:00.000Z",
    };

    mockedParseProjectBody.mockReturnValueOnce({
      teamId: "team-1",
      name: "Project Alpha",
      description: "Launch work",
      deadline: "2026-06-01T00:00:00.000Z",
    });
    mockedProjectService.createProject.mockResolvedValueOnce(project as never);

    await ProjectController.create(req, res);

    expect(mockedParseProjectBody).toHaveBeenCalledWith(req.body);
    expect(mockedProjectService.createProject).toHaveBeenCalledWith(
      {
        teamId: "team-1",
        name: "Project Alpha",
        description: "Launch work",
        deadline: "2026-06-01T00:00:00.000Z",
      },
      req.user,
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(project);
  });

  it("returns projects for the current user", async () => {
    const req = {
      query: { teamId: "team-1" },
      user: {
        id: "user-1",
        email: "owner@example.com",
        role: "Member",
      },
    } as Request;
    const res = createResponse();
    const projects = [
      {
        id: "project-1",
        name: "Project Alpha",
      },
    ];

    mockedProjectService.listProjects.mockResolvedValueOnce(projects as never);

    await ProjectController.list(req, res);

    expect(mockedProjectService.listProjects).toHaveBeenCalledWith(
      req.user,
      "team-1",
    );
    expect(res.json).toHaveBeenCalledWith(projects);
  });

  it("returns 401 when listing projects without auth", async () => {
    const req = {
      query: {},
      user: undefined,
    } as Request;
    const res = createResponse();

    await ProjectController.list(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    expect(mockedProjectService.listProjects).not.toHaveBeenCalled();
  });
});
