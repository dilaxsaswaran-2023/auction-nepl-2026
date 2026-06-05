import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import Header from "./components/Header.jsx";
import Filters from "./components/Filters.jsx";
import PlayerCard from "./components/PlayerCard.jsx";
import AuctionView from "./components/AuctionView.jsx";

const initialFilters = {
  search: "",
  gender: "All",
  team2025: "All",
  battingStyle: "All",
  bowlingStyle: "All",
};

const auctionSets = [
  {
    id: "new-male",
    label: "New Male Players",
    file: "/data/new-male-players.csv",
    dataLabel: "New Male Players",
    matches: (player) => player.auctionSet === "New Male Players",
  },
  {
    id: "below-100-male",
    label: "Male Below 100 Points",
    file: "/data/male-below-100-points.csv",
    dataLabel: "Male Players Below 100 Points",
    matches: (player) => player.auctionSet === "Male Players Below 100 Points",
  },
  {
    id: "above-100-male",
    label: "Male 100+ Points",
    file: "/data/male-100-plus-points.csv",
    dataLabel: "Male Players 100+ Points",
    matches: (player) => player.auctionSet === "Male Players 100+ Points",
  },
  {
    id: "female",
    label: "Female Players",
    file: "/data/female-players.csv",
    dataLabel: "Female Players",
    matches: (player) => player.auctionSet === "Female Players",
  },
];

function uniqueValues(players, key) {
  return [...new Set(players.map((player) => player[key]).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b),
  );
}

function parsePlayerCsv(set) {
  return new Promise((resolve, reject) => {
    Papa.parse(set.file, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        resolve(
          data
            .map((player) => ({
              name: player.name?.trim() || "",
              gender: player.gender?.trim() || "N/A",
              team2025: player.team2025?.trim() || "New Player",
              lastyrpoints: player.lastyrpoints?.trim() || "N/A",
              auctionSet: set.dataLabel,
              battingStyle: player.battingStyle?.trim() || "N/A",
              bowlingStyle: player.bowlingStyle?.trim() || "N/A",
              image: player.image?.trim() || "",
            }))
            .filter((player) => player.name),
        );
      },
      error: reject,
    });
  });
}

function shufflePlayers(players) {
  return [...players]
    .map((player) => ({ player, sortKey: Math.random() }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ player }) => player);
}

export default function App() {
  const [players, setPlayers] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [auctionMode, setAuctionMode] = useState(false);
  const [auctionIndex, setAuctionIndex] = useState(0);
  const [auctionPlayers, setAuctionPlayers] = useState([]);
  const [auctionTitle, setAuctionTitle] = useState("");

  useEffect(() => {
    Promise.all(auctionSets.map(parsePlayerCsv))
      .then((playerGroups) => {
        setPlayers(playerGroups.flat());
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load player data. Please check the category CSV files in public/data.");
        setLoading(false);
      });
  }, []);

  const options = useMemo(
    () => ({
      genders: uniqueValues(players, "gender"),
      teams: uniqueValues(players, "team2025"),
      battingStyles: uniqueValues(players, "battingStyle"),
      bowlingStyles: uniqueValues(players, "bowlingStyle"),
    }),
    [players],
  );

  const filteredPlayers = useMemo(() => {
    const searchTerm = filters.search.toLowerCase().trim();

    return players.filter((player) => {
      const matchesSearch = player.name.toLowerCase().includes(searchTerm);
      const matchesGender = filters.gender === "All" || player.gender === filters.gender;
      const matchesTeam =
        filters.team2025 === "All" || player.team2025 === filters.team2025;
      const matchesBatting =
        filters.battingStyle === "All" || player.battingStyle === filters.battingStyle;
      const matchesBowling =
        filters.bowlingStyle === "All" || player.bowlingStyle === filters.bowlingStyle;

      return (
        matchesSearch &&
        matchesGender &&
        matchesTeam &&
        matchesBatting &&
        matchesBowling
      );
    });
  }, [filters, players]);

  const groupedPlayers = useMemo(
    () =>
      auctionSets
        .map((set) => ({
          id: set.id,
          label: set.label,
          players: filteredPlayers.filter(set.matches),
        }))
        .filter((set) => set.players.length > 0),
    [filteredPlayers],
  );

  const resetFilters = () => setFilters(initialFilters);

  const auctionSetButtons = useMemo(
    () =>
      auctionSets.map((set) => ({
        id: set.id,
        label: set.label,
        count: players.filter(set.matches).length,
      })),
    [players],
  );

  const startAuction = (setId) => {
    const selectedSet = auctionSets.find((set) => set.id === setId);
    const selectedPlayers = selectedSet ? players.filter(selectedSet.matches) : [];
    setAuctionPlayers(shufflePlayers(selectedPlayers));
    setAuctionTitle(selectedSet?.label || "Player Auction");
    setAuctionIndex(0);
    setAuctionMode(true);
  };

  if (auctionMode) {
    return (
      <AuctionView
        players={auctionPlayers}
        currentIndex={auctionIndex}
        onChangeIndex={setAuctionIndex}
        title={auctionTitle}
        onExit={() => setAuctionMode(false)}
      />
    );
  }

  return (
    <main className="app-shell">
      <Header
        totalPlayers={players.length}
        visiblePlayers={filteredPlayers.length}
        onStartAuction={startAuction}
        auctionSets={auctionSetButtons}
        canStartAuction={!loading && !error}
      />

      <section className="content-wrap" aria-label="Player directory">
        <Filters
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
          options={options}
        />

        {loading && (
          <div className="status-panel">
            <span className="loader" aria-hidden="true" />
            <p>Loading player auction list...</p>
          </div>
        )}

        {!loading && error && <div className="status-panel error">{error}</div>}

        {!loading && !error && filteredPlayers.length === 0 && (
          <div className="status-panel empty">
            <h2>No players found</h2>
            <p>Try clearing a filter or searching for another player name.</p>
            <button type="button" className="reset-button" onClick={resetFilters}>
              Reset filters
            </button>
          </div>
        )}

        {!loading && !error && filteredPlayers.length > 0 && (
          <section className="player-groups" aria-live="polite">
            {groupedPlayers.map((group) => (
              <section className="player-group" key={group.id}>
                <header className="player-group-header">
                  <h2>{group.label}</h2>
                  <span>{group.players.length}</span>
                </header>

                <div className="players-grid">
                  {group.players.map((player) => (
                    <PlayerCard key={`${player.name}-${player.team2025}`} player={player} />
                  ))}
                </div>
              </section>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}
