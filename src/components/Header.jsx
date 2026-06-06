export default function Header({
  totalPlayers,
  visiblePlayers,
  onStartAuction,
  auctionSets,
  onChooseGroups,
  canStartAuction,
}) {
  return (
    <header className="hero">
      <div className="hero-visual hero-visual-bat" aria-hidden="true" />
      <div className="hero-visual hero-visual-ball" aria-hidden="true" />
      <div className="hero-visual hero-visual-stumps" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="hero-content">
        <div className="hero-actions">
          <div className="league-pill">NEPL Season 2026</div>
          <button type="button" className="choose-groups-button" onClick={onChooseGroups}>
            Choose Groups
          </button>
          <div className="auction-set-actions" aria-label="Start auction by player set">
            {auctionSets.map((set) => (
              <button
                key={set.id}
                type="button"
                className="start-auction-button"
                onClick={() => onStartAuction(set.id)}
                disabled={!canStartAuction || set.count === 0}
              >
                <span>{set.label}</span>
                <strong>{set.count}</strong>
              </button>
            ))}
          </div>
        </div>
        <h1>NEPL 2026 Player Auction</h1>
        <p>Cricket Player Listing</p>

        <div className="hero-stats" aria-label="Auction listing summary">
          <div>
            <strong>{totalPlayers}</strong>
            <span>Registered Players</span>
          </div>
          <div>
            <strong>{visiblePlayers}</strong>
            <span>In Current View</span>
          </div>
          <div>
            <strong>{auctionSets.length}</strong>
            <span>Auction Sets</span>
          </div>
        </div>
      </div>
    </header>
  );
}
