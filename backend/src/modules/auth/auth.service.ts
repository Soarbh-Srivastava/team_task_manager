import { AppDataSource } from "../../data_logger";
import { User } from "../../entities/User";
import { Roles } from "../../types/roles";
import { hashPassword, signToken, verifyPassword } from "../../utils/auth";

type SignupInput = {
  email: string;
  password: string;
  fullName: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export class AuthService {
  private static userRepo = AppDataSource.getRepository(User);

  static async signup(input: SignupInput) {
    const email = input.email.toLowerCase();
    const existingUser = await this.userRepo.findOne({ where: { email } });

    if (existingUser) {
      throw new Error("Email is already registered");
    }

    const user = this.userRepo.create({
      email,
      full_name: input.fullName,
      password_hash: hashPassword(input.password),
      role: Roles.MEMBER,
    });

    const savedUser = await this.userRepo.save(user);
    return this.buildAuthResponse(savedUser);
  }

  static async login(input: LoginInput) {
    const email = input.email.toLowerCase();

    const user = await this.userRepo
      .createQueryBuilder("user")
      .addSelect("user.password_hash")
      .where("user.email = :email", { email })
      .getOne();

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!verifyPassword(input.password, user.password_hash)) {
      throw new Error("Invalid email or password");
    }

    return this.buildAuthResponse(user);
  }

  private static buildAuthResponse(user: User) {
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        avatarUrl: user.avatar_url,
        role: user.role,
        createdAt: user.created_at,
      },
    };
  }
}
