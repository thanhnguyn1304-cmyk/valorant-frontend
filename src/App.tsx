import StatCard from "./components/dashboard/StatCard";
import MatchRow from "./components/dashboard/MatchRow"; // import the new component

import { useState, useEffect, use } from "react";

interface MatchData {
  agentName: string;
  mapName: string;
  score: string;
  roundsWon: string;
  roundsLost: string;
  kda: string;
  kdRatio: string; // Added this!
  isWin: boolean;
  position: string;
  hsPercent: number;
  adr: number;
  acs: number;
}

function App() {
  // this is "mock data" - simulating what your python backend will send later
  const [recentMatches, setRecentMatches] = useState<MatchData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        console.log("Fetching matches from Python...");

        // A. Go to the Grocery Store (Your API)
        const response = await fetch("http://127.0.0.1:8000/matches");

        // B. Check if the store is actually open
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // C. Unpack the groceries (Convert JSON text to JS Array)
        const data = await response.json();

        // D. Stock the Pantry (Save to State)
        console.log("Data received:", data);
        setRecentMatches(data);
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      } finally {
        // E. Turn off the "Loading..." spinner regardless of success/fail
        setIsLoading(false);
      }
    };

    // Call it immediately
    fetchMatches();
  }, []); // <--- Empty Array = Run ONLY on first render

  return (
    <div className="min-h-screen bg-slate-900 p-10 text-slate-100">
      {/* section 1: the stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Damage/Round"
          value="150.5"
          isGood={true}
          subtext="Top 33.0%"
        />

        <StatCard title="Headshot %" value="34.7%" isGood={true} />
        <StatCard
          title="Win %"
          value="38.5%"
          isGood={false}
          subtext="Bottom 11%"
        />
        {/* you can add more cards here later */}
      </div>

      {/* section 2: the match history */}
      <h2 className="text-xl font-bold mb-4">Recent Matches</h2>
      {isLoading ? (
        <div>Loading recent matches...</div>
      ) : (
        <div className="flex flex-col">
          {recentMatches.map((match) => (
            <MatchRow
              key={match.id} // unique key for each row
              {...match}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
