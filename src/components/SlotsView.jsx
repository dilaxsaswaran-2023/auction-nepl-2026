import { useEffect, useMemo, useState } from "react";

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

export default function SlotsView({ onBack, onChooseCategoryOrder }) {
  const emptySlots = useMemo(() => slotNames.map((slot) => ({ slot, team: "" })), []);
  const [assignments, setAssignments] = useState(emptySlots);
  const [previewAssignments, setPreviewAssignments] = useState(emptySlots);
  const [isAssigning, setIsAssigning] = useState(false);
  const [hasAssigned, setHasAssigned] = useState(false);
  const visibleAssignments = isAssigning ? previewAssignments : assignments;
  const assignedCount = assignments.filter((assignment) => assignment.team).length;
  const availableCount = assignments.length - assignedCount;

  useEffect(() => {
    if (!isAssigning) return undefined;

    const intervalId = window.setInterval(() => {
      const shuffledTeams = shuffle(teams);
      setPreviewAssignments(
        slotNames.map((slot, index) => ({ slot, team: shuffledTeams[index] })),
      );
    }, 95);

    return () => window.clearInterval(intervalId);
  }, [isAssigning]);

  const assignTeams = () => {
    if (isAssigning || hasAssigned) return;

    setIsAssigning(true);
    setPreviewAssignments(emptySlots);

    window.setTimeout(() => {
      const shuffledTeams = shuffle(teams);
      const nextAssignments = slotNames.map((slot, index) => ({
        slot,
        team: shuffledTeams[index],
      }));
      setAssignments(nextAssignments);
      setPreviewAssignments(nextAssignments);
      setIsAssigning(false);
      setHasAssigned(true);
    }, 1200);
  };

  return (
    <main className="slots-page">
      <header className="slots-topbar">
        <div>
          <span>NEPL Season 2026</span>
          <h1>Team Slot Assignment</h1>
          <p>Manage and assign teams to auction slots easily.</p>
        </div>
        <div className="slot-actions">
          <button
            type="button"
            className="secondary-slot-button"
            onClick={onChooseCategoryOrder}
          >
            Auction Order
          </button>
          <button type="button" className="slots-back-button" onClick={onBack}>
            Home
          </button>
        </div>
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
            <div>
              <h2>Auction Slots</h2>
              <p>{hasAssigned ? "Final team allocation is ready." : "Run a fair random assignment."}</p>
            </div>
            <div className="slot-actions">
              <button
                type="button"
                className="assign-button"
                onClick={assignTeams}
                disabled={isAssigning || hasAssigned}
              >
                {hasAssigned ? "Assigned" : isAssigning ? "Shuffling..." : "Randomly Assign"}
              </button>
            </div>
          </header>

          <div className={`slot-grid${isAssigning ? " assigning" : ""}`}>
            {visibleAssignments.map((assignment, index) => (
              <article className="slot-card" key={assignment.slot}>
                <div className="slot-card-topline">
                  <span>Slot {index + 1}</span>
                  <small className={assignment.team ? "status-badge assigned" : "status-badge"}>
                    {assignment.team ? "Assigned" : "Available"}
                  </small>
                </div>
                <strong>{assignment.team || "Waiting for assignment"}</strong>
                <small>{assignment.slot}</small>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
