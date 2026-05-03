import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { Task } from "../types";
import TaskDetailPanel from "./TaskDetailPanel";

const task: Task = {
  id: "task-1",
  title: "Create onboarding copy",
  description: "Draft the first pass of the onboarding flow copy.",
  priority: "High",
  status: "In_Progress",
  due_date: "2026-05-20T00:00:00.000Z",
  completed_at: null,
  created_at: "2026-05-03T00:00:00.000Z",
  project: {
    id: "project-1",
    name: "Launch Project",
    description: "Launch work",
    status: "Active",
    deadline: "2026-06-01T00:00:00.000Z",
    created_at: "2026-05-03T00:00:00.000Z",
    team: {
      id: "team-1",
      name: "Growth Team",
      description: null,
      created_at: "2026-05-03T00:00:00.000Z",
    },
  },
  creator: {
    id: "user-1",
    email: "creator@example.com",
    full_name: "Creator User",
    avatar_url: null,
    role: "Member",
    created_at: "2026-05-03T00:00:00.000Z",
  },
  assignee: {
    id: "user-2",
    email: "assignee@example.com",
    full_name: "Assignee User",
    avatar_url: null,
    role: "Member",
    created_at: "2026-05-03T00:00:00.000Z",
  },
};

describe("TaskDetailPanel", () => {
  it("renders task details as stable markup", () => {
    const html = renderToStaticMarkup(
      <TaskDetailPanel task={task} onMoveTask={() => undefined} />,
    );

    expect(html).toMatchInlineSnapshot(
      `"<div class=\"card detail-panel\"><div class=\"detail-panel__header\"><h3>Create onboarding copy</h3><span class=\"badge badge--In_Progress\">In Progress</span></div><p>Draft the first pass of the onboarding flow copy.</p><div class=\"detail-panel__grid\"><div><div class=\"detail-panel__label\">Priority</div><div>High</div></div><div><div class=\"detail-panel__label\">Due date</div><div>5/20/2026</div></div><div><div class=\"detail-panel__label\">Assignee</div><div>Assignee User</div></div><div><div class=\"detail-panel__label\">Project</div><div>Launch Project</div></div></div><div class=\"detail-panel__moves\"><button class=\"button button--ghost\" type=\"button\">Move to Todo</button><button class=\"button button--ghost\" type=\"button\" disabled=\"\">Move to In Progress</button><button class=\"button button--ghost\" type=\"button\">Move to Review</button><button class=\"button button--ghost\" type=\"button\">Move to Done</button></div></div>"`,
    );
  });
});
