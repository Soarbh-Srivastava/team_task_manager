import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Project } from "./Project";

@Entity("teams")
export class Team {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @ManyToOne(() => User)
  owner!: User;

  @ManyToMany(() => User, (user) => user.teams)
  @JoinTable({ name: "team_members" }) // Explicit join table name
  members!: User[];

  @OneToMany(() => Project, (project) => project.team)
  projects!: Project[];

  @CreateDateColumn()
  created_at!: Date;
}
