import { useMemo, useState } from "react";
import { getPlayerImageCandidates, placeholderImage } from "../utils/imageHelper.js";

export default function PlayerCard({ player }) {
  const imageCandidates = useMemo(() => getPlayerImageCandidates(player), [player]);
  const [imageIndex, setImageIndex] = useState(0);
  const currentImage = imageCandidates[imageIndex] || placeholderImage;

  const handleImageError = () => {
    setImageIndex((current) =>
      current < imageCandidates.length - 1 ? current + 1 : current,
    );
  };

  return (
    <article className="player-card">
      <div className="photo-wrap">
        <img src={currentImage} alt={player.name} onError={handleImageError} />
        <span className="auction-ribbon">Available</span>
        <span className="status-dot" aria-hidden="true" />
      </div>

      <div className="card-body">
        <div className="player-heading">
          <h2>{player.name}</h2>
          <span className="gender-badge">{player.gender}</span>
        </div>

        <div className="team-badge">
          <span>2025 Team</span>
          <strong>{player.team2025}</strong>
        </div>

        <div className="points-badge">
          <span>Base Price</span>
          <strong>TBD</strong>
          <small>2025 Points: {player.lastyrpoints}</small>
        </div>

        <div className="profile-row">
          <span className="profile-badge">
            <small>Age</small>
            {player.age}
          </span>
          <span className="profile-badge">
            <small>Membership</small>
            {player.membershipNo}
          </span>
        </div>

        <div className="skill-row">
          <span className="skill-badge batting">
            <small>Batting</small>
            {player.battingStyle}
          </span>
          <span className="skill-badge bowling">
            <small>Bowling</small>
            {player.bowlingStyle}
          </span>
        </div>

        <div className="bid-preview">
          <span>Current Bid</span>
          <strong>Awaiting Auction</strong>
        </div>

      </div>
    </article>
  );
}
