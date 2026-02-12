import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import ProfileDashboard from '../components/ProfileDashboard';
import MatchDetail from '../components/MatchDetail';

// Types (copied/shared from App.tsx - ideally should be in a types file)
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

interface MatchDetailData {
    id: string;
    map_name: string;
    start_time: number;
    duration_ms: number;
    winning_team: string;
    rounds_play: number;
    participations: any[];
}

const ProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true); // Start loading immediately
    const [matches, setMatches] = useState<MatchData[]>([]);
    const [puuid, setPuuid] = useState<string | null>(null);
    const [selectedMatch, setSelectedMatch] = useState<MatchDetailData | null>(null);
    const [isMatchLoading, setIsMatchLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Derived riotId and tagline from the single 'id' param
    const lastHyphenIndex = id?.lastIndexOf('-') ?? -1;
    const riotId = id && lastHyphenIndex !== -1 ? id.substring(0, lastHyphenIndex) : null;
    const tagline = id && lastHyphenIndex !== -1 ? id.substring(lastHyphenIndex + 1) : null;

    useEffect(() => {
        const fetchData = async () => {
            if (!id || lastHyphenIndex === -1 || !riotId || !tagline) {
                // Only set error if id is present but invalid. 
                // If id is missing entirely, it's likely an initial render or router issue, but let's be safe.
                if (id) {
                    setError("Invalid profile URL. Expected format: name-tag");
                    setIsLoading(false);
                }
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                // 1. Get Player Info (to get PUUID)
                // We need to decodeURIComponent because react-router might give us encoded strings or we might need to send them cleanly
                // Actually fetching with encoded params in URL
                // const rID = decodeURIComponent(riotId); // No longer needed, riotId is already decoded from the URL segment
                // const tLine = decodeURIComponent(tagline); // No longer needed, tagline is already decoded from the URL segment

                console.log(`Fetching profile for ${riotId}#${tagline}`);
                const playerResponse = await fetch(`${API_BASE_URL}/api/v1/players/${encodeURIComponent(riotId)}/${encodeURIComponent(tagline)}`);

                if (!playerResponse.ok) {
                    throw new Error('Player not found.');
                }

                const playerData = await playerResponse.json();
                setPuuid(playerData.puuid);

                // 2. Get Matches
                console.log('Fetching matches for:', playerData.region, playerData.puuid);
                const matchesResponse = await fetch(`${API_BASE_URL}/api/v1/matches/${playerData.region}/${playerData.puuid}`);

                if (!matchesResponse.ok) {
                    throw new Error('Failed to fetch matches.');
                }

                const matchesData = await matchesResponse.json();

                // Map the response
                const mappedMatches = matchesData.map((match: any) => ({
                    ...match,
                    match_id: match.match_id || match.id,
                }));

                setMatches(mappedMatches);

            } catch (err) {
                console.error('Error loading profile:', err);
                setError(err instanceof Error ? err.message : 'Failed to load profile');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, riotId, tagline, lastHyphenIndex]);

    const handleMatchClick = async (matchId: string) => {
        setIsMatchLoading(true);
        setSelectedMatch(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/matches/${matchId}`);
            if (!response.ok) throw new Error('Failed to fetch match');
            const data = await response.json();
            setSelectedMatch(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsMatchLoading(false);
        }
    };

    const handleCloseMatch = () => {
        setSelectedMatch(null);
    };

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-surface text-text-primary gap-4">
                <h1 className="text-2xl font-bold">Error</h1>
                <p className="text-text-secondary">{error}</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-val text-white rounded hover:bg-val-dark"
                >
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <>
            <ProfileDashboard
                puuid={puuid || ''}
                playerName={`${decodeURIComponent(riotId || '')}#${decodeURIComponent(tagline || '')}`}
                matches={matches}
                isLoading={isLoading}
                onBack={() => navigate('/')}
                onMatchClick={handleMatchClick}
            />

            {(selectedMatch || isMatchLoading) && (
                <MatchDetail
                    match={selectedMatch}
                    isLoading={isMatchLoading}
                    onBack={handleCloseMatch}
                    currentPuuid={puuid || undefined}
                />
            )}
        </>
    );
};

export default ProfilePage;
