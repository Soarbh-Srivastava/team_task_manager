import { TaskPriority, TaskStatus, type Task } from "../types";

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: "Todo",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.REVIEW]: "Review",
  [TaskStatus.DONE]: "Done",
};

export const TASK_STATUS_ORDER: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.REVIEW,
  TaskStatus.DONE,
];

export function groupTasksByStatus(tasks: Task[]) {
  return TASK_STATUS_ORDER.reduce<Record<TaskStatus, Task[]>>(
    (accumulator, status) => {
      accumulator[status] = tasks.filter((task) => task.status === status);
      return accumulator;
    },
    {
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.REVIEW]: [],
      [TaskStatus.DONE]: [],
    },
  );
}

export function getTaskPriorityTone(priority?: TaskPriority) {
  switch (priority) {
    case TaskPriority.HIGH:
      return "danger";
    case TaskPriority.MEDIUM:
      return "warning";
    case TaskPriority.LOW:
    default:
      return "neutral";
  }
}
