import StatCard from "./components/dashboard/StatCard";
import MatchRow from "./components/dashboard/MatchRow"; // import the new component

function App() {
  // this is "mock data" - simulating what your python backend will send later
  const recentMatches = [
    {
      id: 1,
      agentName: "Sova",
      mapName: "Pearl",
      roundsWon: "10",
      roundsLost: "13",
      score: "10 - 13",
      kda: "17/18/1",
      kdRatio: "0.9",
      isWin: false,
      position: "8th",
      hsPercent: "42",
      adr: "109",
      acs: "186",
    },
    {
      id: 2,
      agentName: "Clove",
      mapName: "Haven",
      roundsWon: "9",
      roundsLost: "13",
      score: "9 - 13",
      kda: "20/19/14",
      kdRatio: "1.1",
      isWin: false,
      position: "3rd",
      hsPercent: "29",
      adr: "180",
      acs: "283",
    },
    {
      id: 3,
      agentName: "Clove",
      mapName: "Bind",
      roundsWon: "8",
      roundsLost: "13",
      score: "8 - 13",
      kda: "16/18/6",
      kdRatio: "0.9",
      isWin: false,
      position: "6th",
      hsPercent: "48",
      adr: "143",
      acs: "215",
    },
    {
      id: 4,
      agentName: "Clove",
      mapName: "Corrode",
      roundsWon: "13",
      roundsLost: "11",
      score: "13 - 11",
      kda: "29/21/8",
      kdRatio: "1.4",
      isWin: true,
      position: "MVP",
      hsPercent: "36",
      adr: "216",
      acs: "333",
    },
  ];

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

      <div className="flex flex-col">
        {recentMatches.map((match) => (
          <MatchRow
            key={match.id} // unique key for each row
            agentName={match.agentName}
            mapName={match.mapName}
            score={match.score}
            roundsWon={match.roundsWon}
            roundsLost={match.roundsLost}
            kda={match.kda}
            kdRatio={match.kdRatio}
            isWin={match.isWin}
            position={match.position}
            hsPercent={match.hsPercent}
            adr={match.adr}
            acs={match.acs}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
