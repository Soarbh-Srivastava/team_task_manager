import React from "react";
import type { TaskStatus } from "../types";
import { TASK_STATUS_LABELS } from "../utils/tasks";

type Props = {
  status: TaskStatus;
};

export default function StatusBadge({ status }: Props) {
  return (
    <span className={`badge badge--${status}`}>
      {TASK_STATUS_LABELS[status]}
    </span>
  );
}
