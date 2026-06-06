import { useMemo, useState } from "react";

const teams = [
  "Jaffna Jaguars",
  "Killinochchi Power Hitters",
  "Mannar Master Blasters",
  "Northern Warriors",
  "Penninsula Panthers",
  "Vavuniya Fire Breathers",
];

const slotNames = ["Team A", "Team B", "Team C", "Team D", "Team E", "Team F"];

function shuffle(values) {
  return [...values]
    .map((value) => ({ value, sortKey: Math.random() }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ value }) => value);
}

export default function SlotsView({ onBack }) {
  const emptySlots = useMemo(() => slotNames.map((slot) => ({ slot, team: "" })), []);
  const [assignments, setAssignments] = useState(emptySlots);
  const [isAssigning, setIsAssigning] = useState(false);
  const [hasAssigned, setHasAssigned] = useState(false);

  const assignTeams = () => {
    if (isAssigning || hasAssigned) return;

    setIsAssigning(true);

    window.setTimeout(() => {
      const shuffledTeams = shuffle(teams);
      setAssignments(slotNames.map((slot, index) => ({ slot, team: shuffledTeams[index] })));
      setIsAssigning(false);
      setHasAssigned(true);
    }, 1200);
  };

  return (
    <main className="slots-page">
      <header className="slots-topbar">
        <div>
          <span>NEPL Season 2026</span>
          <h1>Choose Groups</h1>
        </div>
        <button type="button" className="slots-back-button" onClick={onBack}>
          Back to Players
        </button>
      </header>

      <section className="slots-layout">
        <div className="available-teams">
          <header>
            <h2>Available Teams</h2>
            <span>{teams.length}</span>
          </header>
          <ul>
            {teams.map((team) => (
              <li key={team}>{team}</li>
            ))}
          </ul>
        </div>

        <div className="slot-board">
          <header>
            <h2>Slots</h2>
            <button
              type="button"
              className="assign-button"
              onClick={assignTeams}
              disabled={isAssigning || hasAssigned}
            >
              {hasAssigned ? "Assigned" : isAssigning ? "Assigning..." : "Randomly Assign"}
            </button>
          </header>

          <div className={`slot-grid${isAssigning ? " assigning" : ""}`}>
            {assignments.map((assignment) => (
              <article className="slot-card" key={assignment.slot}>
                <span>{assignment.slot}</span>
                <strong>
                  {isAssigning
                    ? teams[Math.floor(Math.random() * teams.length)]
                    : assignment.team || "Waiting"}
                </strong>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
