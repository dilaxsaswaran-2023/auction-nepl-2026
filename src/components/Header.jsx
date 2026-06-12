export default function Header({
  totalPlayers,
  visiblePlayers,
  dashboardStats,
  onStartAuction,
  auctionSets,
  onChooseGroups,
  onShowAuctionOrder,
  onShowRetained,
  onShowSummary2025,
  canStartAuction,
}) {
  return (
    <>
      <nav className="top-nav" aria-label="Primary navigation">
        <a className="brand-lockup" href="#top" aria-label="NEPL Auction home">
          <span className="brand-mark">N</span>
          <span>
            <strong>NEPL Auction</strong>
            <small>Official 2026 Draft Desk</small>
          </span>
        </a>
        <div className="nav-links">
          <a href="#players">Players</a>
          <button type="button" onClick={onChooseGroups}>Groups</button>
          <button type="button" onClick={onShowRetained}>Retained</button>
          <button type="button" onClick={onShowSummary2025}>2025 Summary</button>
        </div>
      </nav>

      <header className="site-header">
        <div className="hero" id="top">
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
              <button type="button" className="choose-groups-button" onClick={onShowRetained}>
                Retained Players
              </button>
              <button type="button" className="choose-groups-button" onClick={onShowSummary2025}>
                2025 Auction Summary
              </button>
            </div>

            <div className="hero-stats" aria-label="Auction listing summary">
              <div>
                <strong>{totalPlayers}</strong>
                <span>Total Players</span>
              </div>
              <div>
                <strong>{dashboardStats?.teams || 0}</strong>
                <span>Teams</span>
              </div>
              <div>
                <strong>{auctionSets.length}</strong>
                <span>Categories</span>
              </div>
              <div>
                <strong>2026</strong>
                <span>Auction Year</span>
              </div>
            </div>

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

            <div className="hero-caption">
              <span>{visiblePlayers} players currently match the active directory view.</span>
            </div>

            <section className="control-center" aria-label="Auction Control Center">
              <div className="control-center-heading">
                <span>Auction Control Center</span>
                <h2>Auction Control Center</h2>
              </div>

              <div className="control-card-grid">
                <button type="button" className="control-card" onClick={onChooseGroups}>
                  <span className="control-icon" aria-hidden="true">▦</span>
                  <span>
                    <strong>Team Slot Assign</strong>
                    <small>Assign teams to auction slots in a clean and organized way.</small>
                  </span>
                </button>

                <button type="button" className="control-card accent" onClick={onShowAuctionOrder}>
                  <span className="control-icon" aria-hidden="true">⟳</span>
                  <span>
                    <strong>Auction Order Spinning</strong>
                    <small>Spin and generate the auction order fairly.</small>
                  </span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </header>
    </>
  );
}
