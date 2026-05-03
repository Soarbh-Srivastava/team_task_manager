import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Team } from "./Team";
import { Task } from "./Task";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false }) // Hide password by default in queries
  password_hash!: string;

  @Column()
  full_name!: string;

  @Column({ nullable: true })
  avatar_url!: string;

  @Column({ type: "enum", enum: ["Admin", "Member"], default: "Member" })
  role!: string;

  @ManyToMany(() => Team, (team) => team.members)
  teams!: Team[];

  @OneToMany(() => Task, (task) => task.assignee)
  assigned_tasks!: Task[];

  @CreateDateColumn()
  created_at!: Date;
}
