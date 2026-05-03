import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../utils/request-validation", () => ({
  parseLoginBody: vi.fn(),
  parseSignupBody: vi.fn(),
}));

vi.mock("./auth.service", () => ({
  AuthService: {
    signup: vi.fn(),
    login: vi.fn(),
  },
}));

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import {
  parseLoginBody,
  parseSignupBody,
} from "../../utils/request-validation";

const mockedAuthService = vi.mocked(AuthService);
const mockedParseSignupBody = vi.mocked(parseSignupBody);
const mockedParseLoginBody = vi.mocked(parseLoginBody);

function createResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response;
}

describe("AuthController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("signs up a user and returns 201", async () => {
    const req = {
      body: {
        email: "USER@example.com",
        password: "password123",
        fullName: "Test User",
      },
    } as Request;
    const res = createResponse();
    const authResponse = {
      token: "token-1",
      user: {
        id: "user-1",
        email: "user@example.com",
        fullName: "Test User",
        avatarUrl: null,
        role: "Member",
        createdAt: "2026-05-03T00:00:00.000Z",
      },
    };

    mockedParseSignupBody.mockReturnValueOnce({
      email: "user@example.com",
      password: "password123",
      fullName: "Test User",
    });
    mockedAuthService.signup.mockResolvedValueOnce(authResponse as never);

    await AuthController.signup(req, res);

    expect(mockedParseSignupBody).toHaveBeenCalledWith(req.body);
    expect(mockedAuthService.signup).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123",
      fullName: "Test User",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(authResponse);
  });

  it("returns 400 when signup validation fails", async () => {
    const req = {
      body: {
        email: "invalid-email",
        password: "password123",
        fullName: "Test User",
      },
    } as Request;
    const res = createResponse();

    mockedParseSignupBody.mockImplementationOnce(() => {
      throw new Error("email must be a valid email address");
    });

    await AuthController.signup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "email must be a valid email address",
    });
    expect(mockedAuthService.signup).not.toHaveBeenCalled();
  });

  it("logs a user in and returns the auth payload", async () => {
    const req = {
      body: {
        email: "member@example.com",
        password: "password123",
      },
    } as Request;
    const res = createResponse();
    const authResponse = {
      token: "token-2",
      user: {
        id: "user-2",
        email: "member@example.com",
        fullName: "Member User",
        avatarUrl: null,
        role: "Member",
        createdAt: "2026-05-03T00:00:00.000Z",
      },
    };

    mockedParseLoginBody.mockReturnValueOnce({
      email: "member@example.com",
      password: "password123",
    });
    mockedAuthService.login.mockResolvedValueOnce(authResponse as never);

    await AuthController.login(req, res);

    expect(mockedParseLoginBody).toHaveBeenCalledWith(req.body);
    expect(mockedAuthService.login).toHaveBeenCalledWith({
      email: "member@example.com",
      password: "password123",
    });
    expect(res.json).toHaveBeenCalledWith(authResponse);
  });

  it("returns 400 when login fails", async () => {
    const req = {
      body: {
        email: "member@example.com",
        password: "password123",
      },
    } as Request;
    const res = createResponse();

    mockedParseLoginBody.mockReturnValueOnce({
      email: "member@example.com",
      password: "password123",
    });
    mockedAuthService.login.mockRejectedValueOnce(
      new Error("Invalid email or password"),
    );

    await AuthController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid email or password",
    });
  });
});
