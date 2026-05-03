import { AppDataSource } from "../../../data_logger";
import { Team } from "../../../entities/Team";
import { User } from "../../../entities/User";
import { Roles } from "../../../types/roles";
import { AuthUser } from "../../../utils/auth";

type TeamInput = {
  name: string;
  description?: string;
};

export class TeamService {
  private static teamRepo = AppDataSource.getRepository(Team);
  private static userRepo = AppDataSource.getRepository(User);

  static async createTeam(input: TeamInput, actor: AuthUser) {
    const owner = await this.userRepo.findOne({ where: { id: actor.id } });

    if (!owner) {
      throw new Error("Owner not found");
    }

    const team = this.teamRepo.create({
      name: input.name,
      description: input.description,
      owner,
      members: [owner],
    });

    return this.teamRepo.save(team);
  }

  static async listTeams(actor: AuthUser) {
    if (actor.role === Roles.ADMIN) {
      return this.teamRepo.find({
        relations: ["owner", "members", "projects"],
      });
    }

    return this.teamRepo
      .createQueryBuilder("team")
      .leftJoinAndSelect("team.owner", "owner")
      .leftJoinAndSelect("team.members", "members")
      .leftJoinAndSelect("team.projects", "projects")
      .innerJoin("team.members", "member", "member.id = :userId", {
        userId: actor.id,
      })
      .getMany();
  }

  static async addMember(teamId: string, memberEmail: string, actor: AuthUser) {
    const team = await this.teamRepo.findOne({
      where: { id: teamId },
      relations: ["owner", "members", "projects"],
    });

    if (!team) {
      throw new Error("Team not found");
    }

    if (actor.role !== Roles.ADMIN && team.owner?.id !== actor.id) {
      throw new Error("Only the team owner can add members");
    }

    const member = await this.userRepo.findOne({
      where: { email: memberEmail },
    });

    if (!member) {
      throw new Error("Member not found");
    }

    const alreadyMember = team.members?.some(
      (existingMember) => existingMember.id === member.id,
    );
    if (!alreadyMember) {
      team.members = [...(team.members ?? []), member];
    }

    return this.teamRepo.save(team);
  }
}
