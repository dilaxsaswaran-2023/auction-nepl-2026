export default function Header({
  totalPlayers,
  visiblePlayers,
  onStartAuction,
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
          <button
            type="button"
            className="start-auction-button"
            onClick={onStartAuction}
            disabled={!canStartAuction}
          >
            Start Auctions
          </button>
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
            <strong>4</strong>
            <span>Skill Filters</span>
          </div>
        </div>
      </div>
    </header>
  );
}
