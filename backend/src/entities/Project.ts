import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Team } from "./Team";
import { Task } from "./Task";

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column({ default: "Active" })
  status!: string; // e.g., Active, Archived

  @Column({ type: "timestamp", nullable: true })
  deadline!: Date | null;

  @ManyToOne(() => Team, (team) => team.projects)
  team!: Team;

  @OneToMany(() => Task, (task) => task.project)
  tasks!: Task[];

  @CreateDateColumn()
  created_at!: Date;
}
