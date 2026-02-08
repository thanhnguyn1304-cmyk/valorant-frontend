import { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import ProfileDashboard from './components/ProfileDashboard';
import MatchDetail from './components/MatchDetail';

interface MatchData {
  id: number;
  match_id?: string;
  agent_name: string;
  agent_image: string;
  map: string;
  roundsWon: number;
  roundsLost: number;
  kda: string;
  kdRatio: string | number;
  result: string;
  fmt_pos: string;
  hsPercent: number;
  adr: number;
  acs: number;
  start_time?: string | number | Date;
  kills?: number;
  deaths?: number;
  assists?: number;
  rounds_played?: number;
}

interface PlayerInfo {
  riotId: string;
  tagline: string;
  puuid: string;
  region: string;
}

interface MatchDetailData {
  id: string;
  map_name: string;
  start_time: number;
  duration_ms: number;
  winning_team: string;
  rounds_play: number;
  participations: any[];
}

type View = 'landing' | 'profile' | 'matchDetail';

function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMatchLoading, setIsMatchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (riotId: string, tagline: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Get PUUID from Riot ID and Tagline
      console.log(`Looking up player: ${riotId}#${tagline}`);
      const playerResponse = await fetch(`http://127.0.0.1:8000/api/v1/players/${riotId}/${tagline}`);

      if (!playerResponse.ok) {
        throw new Error('Player not found. Please check your Riot ID and Tagline.');
      }

      const playerData = await playerResponse.json();
      console.log('Player data:', playerData);

      setPlayerInfo({
        riotId,
        tagline,
        puuid: playerData.puuid,
        region: playerData.region,
      });

      setCurrentView('profile');
    } catch (err) {
      console.error('Failed to fetch player:', err);
      setError(err instanceof Error ? err.message : 'Failed to find player');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentView === 'matchDetail') {
      setCurrentView('profile');
      setSelectedMatch(null);
    } else {
      setCurrentView('landing');
      setMatches([]);
      setPlayerInfo(null);
      setError(null);
    }
  };

  const handleMatchClick = async (matchId: string) => {
    setIsMatchLoading(true);
    setCurrentView('matchDetail');

    try {
      console.log('Fetching match details for:', matchId);
      const response = await fetch(`http://127.0.0.1:8000/api/v1/matches/${matchId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch match: ${response.status}`);
      }

      const data = await response.json();
      console.log('Match detail data:', data);
      setSelectedMatch(data);
    } catch (error) {
      console.error('Failed to fetch match details:', error);
      setSelectedMatch(null);
    } finally {
      setIsMatchLoading(false);
    }
  };

  // Fetch matches when viewing profile
  useEffect(() => {
    if (currentView === 'profile' && playerInfo?.puuid && playerInfo?.region) {
      const fetchMatches = async () => {
        setIsLoading(true);
        try {
          console.log('Fetching matches for:', playerInfo.region, playerInfo.puuid);
          const response = await fetch(`http://127.0.0.1:8000/api/v1/matches/${playerInfo.region}/${playerInfo.puuid}`);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          console.log('Match data received:', data);

          // Map the response to include match_id for clicking
          const mappedMatches = data.map((match: any) => ({
            ...match,
            match_id: match.match_id || match.id,
          }));

          setMatches(mappedMatches);
        } catch (error) {
          console.error('Failed to fetch matches:', error);
          setMatches([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchMatches();
    }
  }, [currentView, playerInfo?.puuid, playerInfo?.region]);

  return (
    <div className="min-h-screen bg-surface">
      {currentView === 'landing' && (
        <HeroSection
          onSearch={handleSearch}
          isLoading={isLoading}
          error={error}
        />
      )}

      {currentView === 'profile' && (
        <ProfileDashboard
          puuid={playerInfo?.puuid || ''}
          playerName={playerInfo ? `${playerInfo.riotId}#${playerInfo.tagline}` : ''}
          matches={matches}
          isLoading={isLoading}
          onBack={handleBack}
          onMatchClick={handleMatchClick}
        />
      )}

      {currentView === 'matchDetail' && (
        <MatchDetail
          match={selectedMatch}
          isLoading={isMatchLoading}
          onBack={handleBack}
          currentPuuid={playerInfo?.puuid}
        />
      )}
    </div>
  );
}

export default App;
