import { AppDataSource } from "../../../data_logger";
import { Task, TaskPriority, TaskStatus } from "../../../entities/Task";
import { Project } from "../../../entities/Project";
import { User } from "../../../entities/User";
import { Roles } from "../../../types/roles";

export class TaskService {
  private static taskRepo = AppDataSource.getRepository(Task);
  private static projectRepo = AppDataSource.getRepository(Project);
  private static userRepo = AppDataSource.getRepository(User);

  static async createTask(data: any, actor: { id: string; role: string }) {
    const project = await this.projectRepo.findOne({
      where: { id: data.projectId },
      relations: ["team", "team.owner", "team.members"],
    });

    if (!project) {
      throw new Error("Project not found");
    }

    this.assertProjectAccess(project, actor);

    let assignee: User | null = null;
    if (data.assigneeId) {
      assignee = await this.userRepo.findOne({
        where: { id: data.assigneeId },
      });

      if (!assignee) {
        throw new Error("Assignee not found");
      }
    }

    const newTask = this.taskRepo.create() as Task;
    newTask.title = data.title;
    newTask.description = data.description;
    newTask.priority = data.priority ?? TaskPriority.MEDIUM;
    newTask.status = data.status ?? TaskStatus.TODO;
    newTask.due_date = data.dueDate ? new Date(data.dueDate) : null;
    newTask.creator = { id: actor.id } as User;
    newTask.project = { id: data.projectId } as Project;
    newTask.assignee = assignee;

    return this.taskRepo.save(newTask);
  }

  static async getTasksByProject(
    projectId: string,
    actor: { id: string; role: string },
  ) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ["team", "team.owner", "team.members"],
    });

    if (!project) {
      throw new Error("Project not found");
    }

    this.assertProjectAccess(project, actor);

    return this.taskRepo.find({
      where: { project: { id: projectId } },
      relations: ["assignee", "creator", "project", "project.team"],
      order: { created_at: "DESC" },
    });
  }

  static async updateTaskStatus(
    taskId: string,
    status: TaskStatus,
    actor: { id: string; role: string },
  ) {
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: [
        "project",
        "project.team",
        "project.team.owner",
        "project.team.members",
        "creator",
        "assignee",
      ],
    });

    if (!task) {
      throw new Error("Task not found");
    }

    this.assertProjectAccess(task.project, actor);

    if (
      actor.role !== Roles.ADMIN &&
      task.creator?.id !== actor.id &&
      task.assignee?.id !== actor.id
    ) {
      throw new Error("You cannot update this task");
    }

    task.status = status;
    task.completed_at = status === TaskStatus.DONE ? new Date() : null;

    return this.taskRepo.save(task);
  }

  private static assertProjectAccess(
    project: Project,
    actor: { id: string; role: string },
  ) {
    if (actor.role === Roles.ADMIN) {
      return;
    }

    const isOwner = project.team?.owner?.id === actor.id;
    const isMember = project.team?.members?.some(
      (member) => member.id === actor.id,
    );

    if (!isOwner && !isMember) {
      throw new Error("You do not have access to this project");
    }
  }
}
