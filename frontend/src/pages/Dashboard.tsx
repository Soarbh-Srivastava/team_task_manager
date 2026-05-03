import React from "react";
import { useEffect, useState } from "react";
import { getDashboardSummary } from "../api/dashboard";
import { TaskStatus, type DashboardSummary, type Task } from "../types";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { formatDateIso } from "../utils/date";

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadSummary();
  }, []);

  async function loadSummary() {
    try {
      const response = await getDashboardSummary();
      setSummary(response);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load dashboard",
      );
    }
  }

  function renderRecentTask(task: Task) {
    return (
      <li key={task.id} className="activity-row">
        <div>
          <strong>{task.title}</strong>
          <div className="muted-text">{task.project?.name}</div>
        </div>
        <div className="activity-row__meta">
          <StatusBadge status={task.status} />
          <span>{formatDateIso(task.created_at)}</span>
        </div>
      </li>
    );
  }

  return (
    <div className="container">
      {error ? <div className="card form__error">{error}</div> : null}

      <div className="dashboard-stats">
        <StatCard
          label="Overdue"
          value={summary?.overdueCount ?? 0}
          hint="Needs attention"
        />
        <StatCard
          label="Pending"
          value={
            summary
              ? summary.byStatus[TaskStatus.TODO] +
                summary.byStatus[TaskStatus.IN_PROGRESS]
              : 0
          }
          hint="Active work"
        />
        <StatCard
          label="Completed"
          value={summary?.byStatus[TaskStatus.DONE] ?? 0}
          hint="Finished tasks"
        />
        <StatCard
          label="Total"
          value={summary?.totalTasks ?? 0}
          hint="Visible in your workspace"
        />
      </div>

      <div className="dashboard-grid dashboard-grid--wide">
        <div className="card">
          <div className="section-heading">
            <h2>My Tasks</h2>
            <span>Recent activity</span>
          </div>

          <ul className="activity-list">
            {summary ? (
              summary.recentTasks.map(renderRecentTask)
            ) : (
              <li className="muted-text">Loading recent tasks...</li>
            )}
          </ul>
        </div>

        <div className="card">
          <div className="section-heading">
            <h2>Overdue</h2>
            <span>{summary?.overdueTasks.length ?? 0} items</span>
          </div>

          <div className="overdue-list">
            {summary?.overdueTasks.map((task) => (
              <article key={task.id} className="overdue-item">
                <strong>{task.title}</strong>
                <span>{task.project?.team?.name}</span>
                <StatusBadge status={task.status} />
              </article>
            )) ?? <p className="muted-text">Loading overdue tasks...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
