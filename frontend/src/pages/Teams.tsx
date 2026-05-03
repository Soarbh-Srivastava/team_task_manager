import React, { useEffect, useMemo, useState } from "react";
import { addTeamMember, createTeam, listTeams } from "../api/teams";
import { UserRole, type Team } from "../types";
import { formatDateIso } from "../utils/date";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";

export default function Teams() {
  const currentUser = useAuthStore((snapshot) => snapshot.user);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [memberTeamId, setMemberTeamId] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  useEffect(() => {
    void refreshTeams();
  }, []);

  async function refreshTeams() {
    setLoading(true);
    setError(null);

    try {
      const response = await listTeams();
      setTeams(response);
      setMemberTeamId((current) => current || response[0]?.id || "");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load teams",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTeam(event: React.FormEvent) {
    event.preventDefault();
    await createTeam({
      name: teamName,
      description: teamDescription || undefined,
    });
    setTeamName("");
    setTeamDescription("");
    await refreshTeams();
  }

  async function handleInviteMember(event: React.FormEvent) {
    event.preventDefault();
    if (!memberTeamId || !memberEmail) return;
    await addTeamMember(memberTeamId, { memberEmail });
    setMemberEmail("");
    await refreshTeams();
  }

  const selectedTeam = useMemo(
    () => teams.find((team) => team.id === memberTeamId) ?? null,
    [teams, memberTeamId],
  );

  const canInviteMember =
    currentUser?.role === UserRole.ADMIN ||
    selectedTeam?.owner.id === currentUser?.id;

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h1>Teams</h1>
          <p>Manage ownership, members, and team-level projects.</p>
        </div>
      </div>

      <div className="page-grid page-grid--split">
        <section className="card">
          <h2>Create team</h2>
          <form className="form" onSubmit={handleCreateTeam}>
            <Input
              placeholder="Team name"
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
            />
            <Input
              placeholder="Description"
              value={teamDescription}
              onChange={(event) => setTeamDescription(event.target.value)}
            />
            <Button type="submit">Create team</Button>
          </form>
        </section>

        <section className="card">
          <h2>Invite member</h2>
          {canInviteMember ? (
            <>
              <form className="form" onSubmit={handleInviteMember}>
                <select
                  className="input"
                  value={memberTeamId}
                  onChange={(event) => setMemberTeamId(event.target.value)}
                >
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="Member email"
                  value={memberEmail}
                  onChange={(event) => setMemberEmail(event.target.value)}
                />
                <Button type="submit">Add member</Button>
              </form>
              {selectedTeam ? (
                <p className="muted-text">Selected team: {selectedTeam.name}</p>
              ) : null}
            </>
          ) : (
            <p className="muted-text">
              Only admins and team owners can add members.
            </p>
          )}
        </section>
      </div>

      <section className="card">
        <h2>Team directory</h2>
        {loading ? <p>Loading teams...</p> : null}
        {error ? <p className="form__error">{error}</p> : null}
        {!loading && teams.length === 0 ? (
          <p className="muted-text">No teams yet.</p>
        ) : null}

        <div className="cards-grid">
          {teams.map((team) => (
            <article key={team.id} className="team-card">
              <div className="team-card__header">
                <h3>{team.name}</h3>
                <span>{team.projects.length} projects</span>
              </div>
              <p>{team.description || "No description."}</p>
              <div className="team-card__meta">
                <span>Owner: {team.owner.full_name}</span>
                <span>Members: {team.members.length}</span>
                <span>Created: {formatDateIso(team.created_at)}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
