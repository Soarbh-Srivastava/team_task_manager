import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { Project } from "./Project";

export enum TaskPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}
export enum TaskStatus {
  TODO = "Todo",
  IN_PROGRESS = "In_Progress",
  REVIEW = "Review",
  DONE = "Done",
}

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column({ type: "enum", enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority!: TaskPriority;

  @Column({ type: "enum", enum: TaskStatus, default: TaskStatus.TODO })
  status!: TaskStatus;

  @Column({ type: "timestamp", nullable: true })
  due_date!: Date | null;

  @Column({ type: "timestamp", nullable: true })
  completed_at!: Date | null;

  @ManyToOne(() => Project, (project) => project.tasks)
  project!: Project;

  @ManyToOne(() => User)
  creator!: User;

  @ManyToOne(() => User, (user) => user.assigned_tasks, { nullable: true })
  assignee!: User | null;

  @CreateDateColumn()
  created_at!: Date;
}
