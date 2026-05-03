import React, { useMemo } from "react";
import type { Task, TaskStatus } from "../types";
import {
  TASK_STATUS_LABELS,
  TASK_STATUS_ORDER,
  groupTasksByStatus,
} from "../utils/tasks";
import StatusBadge from "./StatusBadge";
import { formatDateIso } from "../utils/date";

type Props = {
  tasks: Task[];
  selectedTaskId?: string | null;
  onTaskSelect: (task: Task) => void;
  onMoveTask: (taskId: string, status: TaskStatus) => void;
};

export default function KanbanBoard({
  tasks,
  selectedTaskId,
  onTaskSelect,
  onMoveTask,
}: Props) {
  const groupedTasks = useMemo(() => groupTasksByStatus(tasks), [tasks]);

  return (
    <div className="kanban-board">
      {TASK_STATUS_ORDER.map((status) => (
        <section
          key={status}
          className="kanban-column"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const taskId = event.dataTransfer.getData("text/task-id");
            if (taskId) {
              onMoveTask(taskId, status);
            }
          }}
        >
          <div className="kanban-column__header">
            <h3>{TASK_STATUS_LABELS[status]}</h3>
            <span>{groupedTasks[status].length}</span>
          </div>

          <div className="kanban-column__body">
            {groupedTasks[status].map((task) => (
              <article
                key={task.id}
                className={`task-card${selectedTaskId === task.id ? " task-card--selected" : ""}`}
                draggable
                onDragStart={(event) =>
                  event.dataTransfer.setData("text/task-id", task.id)
                }
                onClick={() => onTaskSelect(task)}
              >
                <div className="task-card__row">
                  <strong>{task.title}</strong>
                  <StatusBadge status={task.status} />
                </div>
                {task.description ? <p>{task.description}</p> : null}
                <div className="task-card__meta">
                  <span>{task.priority}</span>
                  <span>
                    {task.due_date
                      ? formatDateIso(task.due_date)
                      : "No due date"}
                  </span>
                </div>
              </article>
            ))}

            {groupedTasks[status].length === 0 ? (
              <div className="kanban-empty">Drop a task here</div>
            ) : null}
          </div>
        </section>
      ))}
    </div>
  );
}
