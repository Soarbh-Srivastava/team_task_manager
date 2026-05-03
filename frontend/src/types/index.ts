export enum UserRole {
  ADMIN = "Admin",
  MEMBER = "Member",
}

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

export interface ApiUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface TeamSummary {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Team extends TeamSummary {
  owner: ApiUser;
  members: ApiUser[];
  projects: ProjectSummary[];
}

export interface ProjectSummary {
  id: string;
  name: string;
  description: string | null;
  status: string;
  deadline: string | null;
  created_at: string;
  team: TeamSummary;
  tasks?: Task[];
}

export interface Project extends ProjectSummary {
  team: Team;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  project: ProjectSummary;
  creator?: ApiUser;
  assignee?: ApiUser | null;
}

export interface DashboardSummary {
  totalTasks: number;
  byStatus: Record<TaskStatus, number>;
  overdueCount: number;
  overdueTasks: Task[];
  recentTasks: Task[];
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends AuthCredentials {
  fullName: string;
}

export interface TeamInput {
  name: string;
  description?: string;
}

export interface TeamMemberInput {
  memberEmail: string;
}

export interface ProjectInput {
  teamId: string;
  name: string;
  description?: string;
  deadline?: string;
}

export interface TaskInput {
  projectId: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
  assigneeId?: string;
}

export interface TaskStatusInput {
  status: TaskStatus;
}
