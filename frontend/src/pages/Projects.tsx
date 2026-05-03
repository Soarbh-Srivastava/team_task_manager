import React, { useEffect, useMemo, useState } from "react";
import { createProject, listProjects } from "../api/projects";
import { listTeams } from "../api/teams";
import type { Project, Team } from "../types";
import Button from "../components/Button";
import Input from "../components/Input";
import { formatDateIso } from "../utils/date";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    try {
      const [teamResponse, projectResponse] = await Promise.all([
        listTeams(),
        listProjects(),
      ]);
      setTeams(teamResponse);
      setProjects(projectResponse);
      setSelectedTeamId((current) => current || teamResponse[0]?.id || "");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load projects",
      );
    }
  }

  async function handleCreateProject(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedTeamId) return;

    await createProject({
      teamId: selectedTeamId,
      name: projectName,
      description: projectDescription || undefined,
      deadline: deadline || undefined,
    });

    setProjectName("");
    setProjectDescription("");
    setDeadline("");
    await loadData();
  }

  const teamProjects = useMemo(
    () => projects.filter((project) => project.team.id === selectedTeamId),
    [projects, selectedTeamId],
  );

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h1>Projects</h1>
          <p>
            Create and track projects per team, with deadlines and task counts.
          </p>
        </div>
      </div>

      <div className="page-grid page-grid--split">
        <section className="card">
          <h2>Create project</h2>
          <form className="form" onSubmit={handleCreateProject}>
            <select
              className="input"
              value={selectedTeamId}
              onChange={(event) => setSelectedTeamId(event.target.value)}
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            <Input
              placeholder="Project name"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
            />
            <Input
              placeholder="Description"
              value={projectDescription}
              onChange={(event) => setProjectDescription(event.target.value)}
            />
            <Input
              type="date"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
            />
            <Button type="submit">Create project</Button>
          </form>
        </section>

        <section className="card">
          <h2>Current team projects</h2>
          <div className="muted-text">
            {selectedTeamId
              ? `Showing projects for ${teams.find((team) => team.id === selectedTeamId)?.name ?? "selected team"}`
              : "Select a team"}
          </div>
          {error ? <p className="form__error">{error}</p> : null}

          <div className="cards-grid cards-grid--compact">
            {teamProjects.map((project) => (
              <article key={project.id} className="project-card">
                <div className="team-card__header">
                  <h3>{project.name}</h3>
                  <span>{project.status}</span>
                </div>
                <p>{project.description || "No description."}</p>
                <div className="team-card__meta">
                  <span>Tasks: {project.tasks?.length ?? 0}</span>
                  <span>
                    Deadline:{" "}
                    {project.deadline
                      ? formatDateIso(project.deadline)
                      : "None"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
