import { AppDataSource } from "../../../data_logger";
import { Task, TaskStatus } from "../../../entities/Task";
import { User } from "../../../entities/User";
import { Roles } from "../../../types/roles";
import { AuthUser } from "../../../utils/auth";

export class DashboardService {
  private static taskRepo = AppDataSource.getRepository(Task);
  private static userRepo = AppDataSource.getRepository(User);

  static async getSummary(actor: AuthUser) {
    const user = await this.userRepo.findOne({
      where: { id: actor.id },
      relations: ["teams"],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const tasks = await this.taskRepo.find({
      relations: ["project", "project.team", "assignee", "creator"],
      order: { created_at: "DESC" },
    });

    const teamIds = new Set(user.teams?.map((team) => team.id) ?? []);
    const visibleTasks =
      actor.role === Roles.ADMIN
        ? tasks
        : tasks.filter((task) => {
            const belongsToTeam = teamIds.has(task.project?.team?.id);
            const isAssigned = task.assignee?.id === actor.id;
            const isCreated = task.creator?.id === actor.id;
            return belongsToTeam || isAssigned || isCreated;
          });

    const now = new Date();
    const byStatus = visibleTasks.reduce(
      (accumulator, task) => {
        accumulator[task.status] = (accumulator[task.status] ?? 0) + 1;
        return accumulator;
      },
      {
        [TaskStatus.TODO]: 0,
        [TaskStatus.IN_PROGRESS]: 0,
        [TaskStatus.REVIEW]: 0,
        [TaskStatus.DONE]: 0,
      } as Record<TaskStatus, number>,
    );

    const overdueTasks = visibleTasks.filter(
      (task) =>
        task.due_date && task.due_date < now && task.status !== TaskStatus.DONE,
    );

    return {
      totalTasks: visibleTasks.length,
      byStatus,
      overdueCount: overdueTasks.length,
      overdueTasks,
      recentTasks: visibleTasks.slice(0, 10),
    };
  }
}
