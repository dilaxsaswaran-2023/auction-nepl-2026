export default function ResultsView({ players, auctionSets, auctionStatuses, onBack }) {
  const soldPlayers = players.filter(
    (player) => auctionStatuses[player.name]?.status === "sold",
  );
  const unsoldPlayers = players.filter(
    (player) => auctionStatuses[player.name]?.status === "unsold",
  );

  return (
    <main className="results-page">
      <header className="results-topbar">
        <div>
          <span>NEPL Season 2026</span>
          <h1>Auction Results</h1>
          <p>Saved from this browser using the Sold and Unsold auction controls.</p>
        </div>
        <button type="button" className="slots-back-button" onClick={onBack}>
          Back to Players
        </button>
      </header>

      <section className="results-summary" aria-label="Auction result summary">
        <article>
          <span>Sold Players</span>
          <strong>{soldPlayers.length}</strong>
        </article>
        <article>
          <span>Unsold Players</span>
          <strong>{unsoldPlayers.length}</strong>
        </article>
        <article>
          <span>Total Marked</span>
          <strong>{soldPlayers.length + unsoldPlayers.length}</strong>
        </article>
      </section>

      <section className="results-groups">
        {auctionSets.map((set) => {
          const groupSoldPlayers = soldPlayers.filter(set.matches);
          if (groupSoldPlayers.length === 0) return null;

          return (
            <section className="results-group" key={set.id}>
              <header className="results-group-header">
                <h2>{set.label}</h2>
                <span>{groupSoldPlayers.length}</span>
              </header>

              <div className="results-table-wrap">
                <table className="summary-table results-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Player</th>
                      <th>2025 Team</th>
                      <th>Marked At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupSoldPlayers.map((player, index) => (
                      <tr key={player.name}>
                        <td>{index + 1}</td>
                        <td>{player.name}</td>
                        <td>{player.team2025}</td>
                        <td>
                          {auctionStatuses[player.name]?.updatedAt
                            ? new Date(auctionStatuses[player.name].updatedAt).toLocaleString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}

        {soldPlayers.length === 0 && (
          <div className="status-panel empty">
            <h2>No sold players yet</h2>
            <p>Mark players as Sold from the auction screen to show them here.</p>
          </div>
        )}
      </section>
    </main>
  );
}
