import { describe, expect, it } from "vitest";
import { TaskPriority, TaskStatus, type Task } from "../types";
import {
  getTaskPriorityTone,
  groupTasksByStatus,
  TASK_STATUS_LABELS,
} from "./tasks";

function makeTask(status: TaskStatus, priority: TaskPriority): Task {
  return {
    id: `${status}-${priority}`,
    title: `${status} task`,
    description: null,
    priority,
    status,
    due_date: null,
    completed_at: null,
    created_at: new Date("2026-05-03T00:00:00.000Z").toISOString(),
    project: {
      id: "project-1",
      name: "Project Alpha",
      description: null,
      status: "Active",
      deadline: null,
      created_at: new Date("2026-05-03T00:00:00.000Z").toISOString(),
      team: {
        id: "team-1",
        name: "Team One",
        description: null,
        created_at: new Date("2026-05-03T00:00:00.000Z").toISOString(),
      },
    },
  };
}

describe("task utils", () => {
  it("groups tasks by backend task status values", () => {
    const tasks = [
      makeTask(TaskStatus.TODO, TaskPriority.LOW),
      makeTask(TaskStatus.IN_PROGRESS, TaskPriority.MEDIUM),
      makeTask(TaskStatus.DONE, TaskPriority.HIGH),
    ];

    const grouped = groupTasksByStatus(tasks);

    expect(grouped[TaskStatus.TODO]).toHaveLength(1);
    expect(grouped[TaskStatus.IN_PROGRESS]).toHaveLength(1);
    expect(grouped[TaskStatus.REVIEW]).toHaveLength(0);
    expect(grouped[TaskStatus.DONE]).toHaveLength(1);
  });

  it("maps task priorities to tones", () => {
    expect(getTaskPriorityTone(TaskPriority.HIGH)).toBe("danger");
    expect(getTaskPriorityTone(TaskPriority.MEDIUM)).toBe("warning");
    expect(getTaskPriorityTone(TaskPriority.LOW)).toBe("neutral");
  });

  it("exposes readable task status labels", () => {
    expect(TASK_STATUS_LABELS[TaskStatus.IN_PROGRESS]).toBe("In Progress");
  });
});
