import React from "react";
import type { Task, TaskStatus } from "../types";
import { TASK_STATUS_LABELS, TASK_STATUS_ORDER } from "../utils/tasks";
import StatusBadge from "./StatusBadge";
import { formatDateIso } from "../utils/date";

type Props = {
  task: Task | null;
  onMoveTask: (taskId: string, status: TaskStatus) => void;
};

export default function TaskDetailPanel({ task, onMoveTask }: Props) {
  if (!task) {
    return (
      <div className="card detail-panel">Select a task to view details.</div>
    );
  }

  return (
    <div className="card detail-panel">
      <div className="detail-panel__header">
        <h3>{task.title}</h3>
        <StatusBadge status={task.status} />
      </div>

      {task.description ? (
        <p>{task.description}</p>
      ) : (
        <p className="muted-text">No description provided.</p>
      )}

      <div className="detail-panel__grid">
        <div>
          <div className="detail-panel__label">Priority</div>
          <div>{task.priority}</div>
        </div>
        <div>
          <div className="detail-panel__label">Due date</div>
          <div>{task.due_date ? formatDateIso(task.due_date) : "Not set"}</div>
        </div>
        <div>
          <div className="detail-panel__label">Assignee</div>
          <div>{task.assignee?.full_name ?? "Unassigned"}</div>
        </div>
        <div>
          <div className="detail-panel__label">Project</div>
          <div>{task.project?.name}</div>
        </div>
      </div>

      <div className="detail-panel__moves">
        {TASK_STATUS_ORDER.map((status) => (
          <button
            key={status}
            className="button button--ghost"
            type="button"
            disabled={task.status === status}
            onClick={() => onMoveTask(task.id, status)}
          >
            Move to {TASK_STATUS_LABELS[status]}
          </button>
        ))}
      </div>
    </div>
  );
}
