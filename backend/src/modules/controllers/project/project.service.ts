import { AppDataSource } from "../../../data_logger";
import { Project } from "../../../entities/Project";
import { Team } from "../../../entities/Team";
import { Roles } from "../../../types/roles";
import { AuthUser } from "../../../utils/auth";

type ProjectInput = {
  teamId: string;
  name: string;
  description?: string;
  deadline?: string | Date;
};

export class ProjectService {
  private static projectRepo = AppDataSource.getRepository(Project);
  private static teamRepo = AppDataSource.getRepository(Team);

  static async createProject(input: ProjectInput, actor: AuthUser) {
    const team = await this.teamRepo.findOne({
      where: { id: input.teamId },
      relations: ["owner", "members"],
    });

    if (!team) {
      throw new Error("Team not found");
    }

    const canManageTeam =
      actor.role === Roles.ADMIN ||
      team.owner?.id === actor.id ||
      team.members?.some((member) => member.id === actor.id);

    if (!canManageTeam) {
      throw new Error("You do not have access to this team");
    }

    const project = this.projectRepo.create({
      name: input.name,
      description: input.description,
      deadline: input.deadline ? new Date(input.deadline) : null,
      team,
    });

    return this.projectRepo.save(project);
  }

  static async listProjects(actor: AuthUser, teamId?: string) {
    const query = this.projectRepo
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.team", "team")
      .leftJoinAndSelect("team.owner", "owner")
      .leftJoinAndSelect("team.members", "members")
      .leftJoinAndSelect("project.tasks", "tasks")
      .leftJoinAndSelect("tasks.assignee", "assignee");

    if (teamId) {
      query.andWhere("team.id = :teamId", { teamId });
    }

    if (actor.role !== Roles.ADMIN) {
      query.andWhere("owner.id = :userId OR members.id = :userId", {
        userId: actor.id,
      });
    }

    return query.orderBy("project.created_at", "DESC").getMany();
  }
}
