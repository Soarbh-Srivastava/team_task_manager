import { TaskPriority, TaskStatus } from "../entities/Task";

type SignupBody = {
  email: string;
  password: string;
  fullName: string;
};

type LoginBody = {
  email: string;
  password: string;
};

type TeamBody = {
  name: string;
  description?: string;
};

type ProjectBody = {
  teamId: string;
  name: string;
  description?: string;
  deadline?: string;
};

type TaskBody = {
  projectId: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
  assigneeId?: string;
};

function requireString(value: unknown, fieldName: string, minLength = 1) {
  if (typeof value !== "string" || value.trim().length < minLength) {
    throw new Error(`${fieldName} is required`);
  }

  return value.trim();
}

function optionalString(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error("Invalid string value");
  }

  return value.trim();
}

function requireEmail(value: unknown) {
  const email = requireString(value, "email").toLowerCase();
  if (!email.includes("@") || email.startsWith("@") || email.endsWith("@")) {
    throw new Error("email must be a valid email address");
  }

  return email;
}

function requirePassword(value: unknown) {
  const password = requireString(value, "password", 8);
  if (password.length < 8) {
    throw new Error("password must be at least 8 characters long");
  }

  return password;
}

function parseEnum<T extends Record<string, string>>(
  value: unknown,
  enumObject: T,
  fieldName: string,
) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error(`${fieldName} is invalid`);
  }

  const normalizedValue = value.trim();
  const allowedValues = Object.values(enumObject) as string[];

  if (!allowedValues.includes(normalizedValue)) {
    throw new Error(`${fieldName} must be one of: ${allowedValues.join(", ")}`);
  }

  return normalizedValue as T[keyof T];
}

function parseDate(value: unknown, fieldName: string) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a valid date string`);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid date string`);
  }

  return value;
}

export function parseSignupBody(body: unknown): SignupBody {
  if (!body || typeof body !== "object") {
    throw new Error("Request body is required");
  }

  const data = body as Record<string, unknown>;

  return {
    email: requireEmail(data.email),
    password: requirePassword(data.password),
    fullName: requireString(data.fullName, "fullName"),
  };
}

export function parseLoginBody(body: unknown): LoginBody {
  if (!body || typeof body !== "object") {
    throw new Error("Request body is required");
  }

  const data = body as Record<string, unknown>;

  return {
    email: requireEmail(data.email),
    password: requireString(data.password, "password"),
  };
}

export function parseTeamBody(body: unknown): TeamBody {
  if (!body || typeof body !== "object") {
    throw new Error("Request body is required");
  }

  const data = body as Record<string, unknown>;

  return {
    name: requireString(data.name, "name"),
    description: optionalString(data.description),
  };
}

export function parseProjectBody(body: unknown): ProjectBody {
  if (!body || typeof body !== "object") {
    throw new Error("Request body is required");
  }

  const data = body as Record<string, unknown>;

  return {
    teamId: requireString(data.teamId, "teamId"),
    name: requireString(data.name, "name"),
    description: optionalString(data.description),
    deadline: parseDate(data.deadline, "deadline"),
  };
}

export function parseTaskBody(body: unknown): TaskBody {
  if (!body || typeof body !== "object") {
    throw new Error("Request body is required");
  }

  const data = body as Record<string, unknown>;

  return {
    projectId: requireString(data.projectId, "projectId"),
    title: requireString(data.title, "title"),
    description: optionalString(data.description),
    priority: parseEnum(data.priority, TaskPriority, "priority"),
    status: parseEnum(data.status, TaskStatus, "status"),
    dueDate: parseDate(data.dueDate, "dueDate"),
    assigneeId: optionalString(data.assigneeId),
  };
}

export function parseTaskStatusBody(body: unknown) {
  if (!body || typeof body !== "object") {
    throw new Error("Request body is required");
  }

  const data = body as Record<string, unknown>;

  if (data.status === undefined || data.status === null || data.status === "") {
    throw new Error("status is required");
  }

  return {
    status: parseEnum(data.status, TaskStatus, "status") as TaskStatus,
  };
}

export function parseMemberBody(body: unknown) {
  if (!body || typeof body !== "object") {
    throw new Error("Request body is required");
  }

  const data = body as Record<string, unknown>;

  return {
    memberEmail: requireEmail(data.memberEmail),
  };
}
