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

function uniqueValues(players, key) {
  return [...new Set(players.map((player) => player[key]).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b),
  );
}

export default function App() {
  const [players, setPlayers] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [auctionMode, setAuctionMode] = useState(false);
  const [auctionIndex, setAuctionIndex] = useState(0);

  useEffect(() => {
    Papa.parse("/data/players.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        const normalized = data
          .map((player) => ({
            name: player.name?.trim() || "",
            gender: player.gender?.trim() || "N/A",
            team2025: player.team2025?.trim() || "New Player",
            battingStyle: player.battingStyle?.trim() || "N/A",
            bowlingStyle: player.bowlingStyle?.trim() || "N/A",
            image: player.image?.trim() || "",
          }))
          .filter((player) => player.name);

        setPlayers(normalized);
        setLoading(false);
      },
      error: () => {
        setError("Could not load player data. Please check public/data/players.csv.");
        setLoading(false);
      },
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

  const resetFilters = () => setFilters(initialFilters);

  const startAuction = () => {
    setAuctionIndex(0);
    setAuctionMode(true);
  };

  if (auctionMode) {
    return (
      <AuctionView
        players={filteredPlayers}
        currentIndex={auctionIndex}
        onChangeIndex={setAuctionIndex}
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
        canStartAuction={!loading && !error && filteredPlayers.length > 0}
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
          <section className="players-grid" aria-live="polite">
            {filteredPlayers.map((player) => (
              <PlayerCard key={`${player.name}-${player.team2025}`} player={player} />
            ))}
          </section>
        )}
      </section>
    </main>
  );
}
