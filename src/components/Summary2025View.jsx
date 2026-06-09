const summaryTeams = [
  {
    code: "JJ",
    name: "Jaffna Jaguars",
    color: "#ff0a67",
    purseRemaining: 10,
    players: [
      ["Thineshwaran", 460],
      ["Kirushanthan", 100],
      ["Nivegithan", 20],
      ["Women Player-1", 0],
      ["Thirukumaran", 80],
      ["Mukunthan", 50],
      ["Patkunarasa Kajendran", 20],
      ["K. Umasangar", 80],
      ["Tenojan P", 280],
      ["Venkadeswaran", 20],
      ["Kabilrajh", 20],
      ["Jegan T", 20],
      ["M E Sutharsan", 20],
      ["V.Subramaniam Sutharshan", 20],
    ],
  },
  {
    code: "KPH",
    name: "Kilinochchi Power Hitters",
    color: "#facc15",
    purseRemaining: 50,
    players: [
      ["Piratheep", 400],
      ["Sutharsan", 20],
      ["Manikanth", 100],
      ["Women Player-2", 0],
      ["Seharan", 40],
      ["Tisiyanthan", 40],
      ["Latheepan", 20],
      ["Baskaran Keshikan", 30],
      ["Luxman. R", 70],
      ["S.Agalyan", 70],
      ["Thanojan", 200],
      ["Eng.S.Niruparan", 20],
      ["Vettinathan", 120],
      ["A.Kajeevan", 20],
    ],
  },
  {
    code: "MMB",
    name: "Mannar Master Blasters",
    color: "#2f9b68",
    purseRemaining: 110,
    players: [
      ["Thiruthanikan", 480],
      ["Brunthavan", 70],
      ["Women Player-3", 0],
      ["Mithunan", 50],
      ["Athavan", 40],
      ["B.Delepan", 50],
      ["T Kirushan", 40],
      ["Soban", 80],
      ["Dilaxsaswaran", 80],
      ["Srisiva", 50],
      ["Gowsykan", 30],
      ["Kajarathan", 30],
      ["K.Yathuganesh", 30],
      ["A.Sivatheepan", 60],
    ],
  },
  {
    code: "NW",
    name: "Northern Warriors",
    color: "#10b981",
    purseRemaining: 20,
    players: [
      ["Dinesh", 500],
      ["Piruthevi", 20],
      ["Senthur", 60],
      ["Women Player-4", 0],
      ["V.P.Kajan", 20],
      ["Arunkumar", 100],
      ["Thiruvel", 120],
      ["Poorveekan", 200],
      ["Sutharsan. S", 60],
      ["T.Thivaakaran", 20],
      ["Parasuram", 20],
      ["Sivakumar", 20],
      ["Jeyadarsan", 20],
      ["Kirubagaran", 20],
    ],
  },
  {
    code: "PP",
    name: "Peninsula Panthers",
    color: "#f8fafc",
    purseRemaining: 30,
    players: [
      ["Nithursan", 40],
      ["Kopisankar", 20],
      ["Women Player-5", 0],
      ["Kiruchikan", 70],
      ["Balakumar", 80],
      ["Keerththigan", 260],
      ["Kopithan Sabapathipillai", 50],
      ["Anojan", 200],
      ["Thanusan", 200],
      ["T Sureshkumar", 20],
      ["Subhankan", 20],
      ["Nagulraj", 30],
      ["N Mathavan", 160],
      ["V.J.Theiventhira", 20],
    ],
  },
  {
    code: "VFB",
    name: "Vavuniya Fire Breathers",
    color: "#ef1b16",
    purseRemaining: 0,
    players: [
      ["George Jeevatharshan", 70],
      ["Kajenthiran", 20],
      ["Thapothanan", 140],
      ["Women Player-6", 0],
      ["Piranavan", 50],
      ["Janusan", 20],
      ["Panugopikan", 30],
      ["S.kirisanthan", 50],
      ["Sivalingam Jeyapragash", 30],
      ["Charvakgnan", 50],
      ["Vivek", 360],
      ["Paraneetharan", 160],
      ["Nirenchan", 200],
      ["S.Sarvaraja", 20],
    ],
  },
];

function totalPoints(players) {
  return players.reduce((sum, [, points]) => sum + points, 0);
}

function topPlayer(players) {
  return players.reduce((top, current) => (current[1] > top[1] ? current : top), players[0]);
}

function pointsBand(points) {
  if (points >= 300) return "elite";
  if (points >= 100) return "high";
  if (points === 0) return "zero";
  return "standard";
}

export default function Summary2025View({ onBack }) {
  return (
    <main className="summary-page">
      <header className="summary-topbar">
        <div>
          <span>NEPL Season 2025</span>
          <h1>2025 Auction Summary</h1>
        </div>
        <button type="button" className="slots-back-button" onClick={onBack}>
          Back to Players
        </button>
      </header>

      <section className="summary-teams">
        {summaryTeams.map((team) => {
          const total = totalPoints(team.players);
          const [topName, topPoints] = topPlayer(team.players);
          const average = Math.round(total / team.players.length);

          return (
          <section
            className="summary-team"
            key={team.code}
            style={{ "--team-color": team.color }}
          >
            <header className="summary-team-header">
              <div>
                <span>{team.code}</span>
                <h2>{team.name}</h2>
              </div>
              <div className="summary-team-stats">
                <span>Total</span>
                <strong>{total}</strong>
                <span>Purse Remaining</span>
                <strong>{team.purseRemaining}</strong>
              </div>
            </header>

            <div className="summary-highlights">
              <div>
                <span>Top Buy</span>
                <strong>{topName}</strong>
                <small>{topPoints} pts</small>
              </div>
              <div>
                <span>Roster</span>
                <strong>{team.players.length}</strong>
                <small>players</small>
              </div>
              <div>
                <span>Average</span>
                <strong>{average}</strong>
                <small>pts/player</small>
              </div>
            </div>

            <table className="summary-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {team.players.map(([player, points], index) => (
                  <tr className={`points-${pointsBand(points)}`} key={`${team.code}-${player}`}>
                    <td>{index + 1}</td>
                    <td>{player}</td>
                    <td>{points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          );
        })}
      </section>
    </main>
  );
}
