import { useEffect, useMemo, useState } from "react";
import { getPlayerImageCandidates, placeholderImage } from "../utils/imageHelper.js";

export default function AuctionView({
  players,
  currentIndex,
  onChangeIndex,
  title,
  playerStatus,
  onMarkStatus,
  onExit,
}) {
  const player = players[currentIndex];
  const imageCandidates = useMemo(
    () => (player ? getPlayerImageCandidates(player) : [placeholderImage]),
    [player],
  );
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setImageIndex(0);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        onChangeIndex(players.length ? (currentIndex + 1) % players.length : 0);
      }

      if (event.key === "ArrowLeft") {
        onChangeIndex(players.length ? (currentIndex - 1 + players.length) % players.length : 0);
      }

      if (event.key === "Escape") {
        onExit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, onChangeIndex, onExit, players.length]);

  if (!player) {
    return (
      <main className="auction-stage empty">
        <button type="button" className="auction-exit" onClick={onExit}>
          Back to Players
        </button>
        <p>No players available for auction.</p>
      </main>
    );
  }

  const currentImage = imageCandidates[imageIndex] || placeholderImage;
  const isFirstPlayer = currentIndex === 0;
  const isLastPlayer = currentIndex === players.length - 1;
  const statusLabel = playerStatus?.status
    ? playerStatus.status.charAt(0).toUpperCase() + playerStatus.status.slice(1)
    : "Not marked";

  const handleImageError = () => {
    setImageIndex((current) =>
      current < imageCandidates.length - 1 ? current + 1 : current,
    );
  };

  const markAndMoveNext = (status) => {
    onMarkStatus(player, status);
    if (!isLastPlayer) {
      onChangeIndex(currentIndex + 1);
    }
  };

  return (
    <main className="auction-stage">
      <div className="auction-bg-ball" aria-hidden="true" />
      <div className="auction-bg-bat" aria-hidden="true" />

      <header className="auction-topbar">
        <div>
          <span>NEPL 2026 Live Auction</span>
          <strong>
            {title}: Player {currentIndex + 1} of {players.length}
          </strong>
        </div>
        <button type="button" className="auction-exit" onClick={onExit}>
          Back to Players
        </button>
      </header>

      <h1 className="auction-player-title">{player.name}</h1>

      <section className="auction-spotlight" aria-live="polite">
        <div className="auction-photo">
          <img src={currentImage} alt={player.name} onError={handleImageError} />
          <span className="auction-live-tag">On Auction</span>
        </div>

        <div className="auction-details">
          <span className="auction-lot">Lot #{String(currentIndex + 1).padStart(2, "0")}</span>
          <div className={`auction-status-panel ${playerStatus?.status || ""}`}>
            <span>Auction Status</span>
            <strong>{statusLabel}</strong>
          </div>

          <div className="auction-meta">
            <div>
              <span>Gender</span>
              <strong>{player.gender}</strong>
            </div>
            <div>
              <span>2025 Team</span>
              <strong>{player.team2025}</strong>
            </div>
          </div>

          <div className="auction-skills">
            <div className="auction-skill batting">
              <span>Batting Style</span>
              <strong>{player.battingStyle}</strong>
            </div>
            <div className="auction-skill bowling">
              <span>Bowling Style</span>
              <strong>{player.bowlingStyle}</strong>
            </div>
          </div>

          <div className="auction-controls" aria-label="Auction navigation">
            <button
              type="button"
              onClick={() => onChangeIndex(Math.max(currentIndex - 1, 0))}
              disabled={isFirstPlayer}
            >
              Previous
            </button>
            <button
              type="button"
              className="primary"
              onClick={() => onChangeIndex(Math.min(currentIndex + 1, players.length - 1))}
              disabled={isLastPlayer}
            >
              Next Player
            </button>
          </div>

          <div className="auction-result-controls" aria-label="Mark auction result">
            <button type="button" className="sold" onClick={() => markAndMoveNext("sold")}>
              Sold
            </button>
            <button type="button" className="unsold" onClick={() => markAndMoveNext("unsold")}>
              Unsold
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
