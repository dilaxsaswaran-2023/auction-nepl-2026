import { useMemo, useState } from "react";
import { getPlayerImageCandidates, placeholderImage } from "../utils/imageHelper.js";

const purseTotal = 1200;

const retainedTeams = [
  {
    code: "NW",
    name: "Northern Warriors",
    players: [
      { displayName: "S Senthur", membershipNo: "M-7822", matchName: "S.Senthur" },
      { displayName: "Piruthevi", membershipNo: "AM-20676", matchName: "C.Piruthevi" },
      { displayName: "K Poorvikan", membershipNo: "AM-27738", matchName: "K.Poorveekan" },
    ],
  },
  {
    code: "JJ",
    name: "Jaffna Jaguars",
    players: [
      { displayName: "K Umasankar", membershipNo: "AM-33502", matchName: "K.Umasangar" },
      { displayName: "P Tenojan", membershipNo: "AM-33607", matchName: "P.Tenojan" },
      { displayName: "K Kirushnthan", membershipNo: "AM-31462", matchName: "K.Kirushanthan" },
    ],
  },
  {
    code: "PP",
    name: "Penninsula Panthers",
    players: [
      { displayName: "S Thanushan", membershipNo: "AM-28432", matchName: "S.Thanusan" },
      { displayName: "Balakumar", membershipNo: "AM-29300", matchName: "M.Balakumar" },
      { displayName: "A Kirushigan", membershipNo: "_", matchName: "A.Kirushikan" },
    ],
  },
  {
    code: "VFB",
    name: "Vavuniya Fire Breathers",
    players: [
      { displayName: "S Paraneetharan", membershipNo: "AM-25814", matchName: "S.Paraneetharan" },
      { displayName: "N Vivek", membershipNo: "AM-23966", matchName: "N.Vivek" },
      { displayName: "S Charvakgnan", membershipNo: "AM-29330", matchName: "S.Charvakgnan" },
    ],
  },
  {
    code: "KPH",
    name: "Killinochchi Power Hitters",
    players: [
      { displayName: "V Thanojan", membershipNo: "AM-32661", matchName: "V.Thanojan" },
      { displayName: "P Manikanth", membershipNo: "AM-29832", matchName: "P.Manikanth" },
      { displayName: "B Seharan", membershipNo: "M-9392", matchName: "B.Seharan" },
    ],
  },
  {
    code: "MMB",
    name: "Mannar Master Blasters",
    players: [
      { displayName: "Dilaxsaswaran", membershipNo: "AM-33154", matchName: "N.Dilaxsaswaran" },
      { displayName: "Brunthavan", membershipNo: "AM-21791", matchName: "M.Brunthavan" },
      { displayName: "S Athavan", membershipNo: "AM-23262", matchName: "S.Athavan" },
    ],
  },
];

function pointsValue(player) {
  const value = Number(player?.lastyrpoints);
  return Number.isFinite(value) ? value : 0;
}

function RetainedPlayerCard({ retainedPlayer, player }) {
  const imageCandidates = useMemo(
    () => (player ? getPlayerImageCandidates(player) : [placeholderImage]),
    [player],
  );
  const [imageIndex, setImageIndex] = useState(0);
  const currentImage = imageCandidates[imageIndex] || placeholderImage;
  const points = player ? player.lastyrpoints : "N/A";

  const handleImageError = () => {
    setImageIndex((current) =>
      current < imageCandidates.length - 1 ? current + 1 : current,
    );
  };

  return (
    <article className="retained-card">
      <div className="retained-photo">
        <img src={currentImage} alt={player?.name || retainedPlayer.displayName} onError={handleImageError} />
      </div>
      <div className="retained-card-body">
        <h3>{player?.name || retainedPlayer.displayName}</h3>
        <div className="retained-meta">
          <span>
            <small>Membership</small>
            {retainedPlayer.membershipNo}
          </span>
          <span>
            <small>Retention</small>
            {points}
          </span>
          <span>
            <small>Age</small>
            {player?.age || "N/A"}
          </span>
          <span>
            <small>Gender</small>
            {player?.gender || "N/A"}
          </span>
        </div>
        <div className="retained-skills">
          <span>{player?.battingStyle || "N/A"}</span>
          <span>{player?.bowlingStyle || "N/A"}</span>
        </div>
      </div>
    </article>
  );
}

export default function RetainedView({ players, onBack }) {
  const playersByName = useMemo(
    () => new Map(players.map((player) => [player.name, player])),
    [players],
  );

  return (
    <main className="retained-page">
      <header className="retained-topbar">
        <div>
          <span>NEPL Season 2026</span>
          <h1>Retained Players</h1>
        </div>
        <button type="button" className="slots-back-button" onClick={onBack}>
          Back to Players
        </button>
      </header>

      <section className="retained-teams">
        {retainedTeams.map((team) => {
          const teamPlayers = team.players.map((retainedPlayer) => ({
            retainedPlayer,
            player: playersByName.get(retainedPlayer.matchName),
          }));
          const totalRetention = teamPlayers.reduce(
            (sum, item) => sum + pointsValue(item.player),
            0,
          );
          const balance = purseTotal - totalRetention;

          return (
            <section className="retained-team" key={team.code}>
              <header className="retained-team-header">
                <div>
                  <span>{team.code}</span>
                  <h2>{team.name}</h2>
                </div>
                <div className="retained-balance">
                  <span>Retained</span>
                  <strong>{totalRetention}</strong>
                  <span>Balance</span>
                  <strong>{balance}</strong>
                </div>
              </header>

              <div className="retained-grid">
                {teamPlayers.map(({ retainedPlayer, player }) => (
                  <RetainedPlayerCard
                    key={`${team.code}-${retainedPlayer.displayName}`}
                    retainedPlayer={retainedPlayer}
                    player={player}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </section>
    </main>
  );
}
