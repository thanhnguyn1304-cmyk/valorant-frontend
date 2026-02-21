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
    const [region, setRegion] = useState<string | null>(null);
    const [selectedMatch, setSelectedMatch] = useState<MatchDetailData | null>(null);
    const [isMatchLoading, setIsMatchLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Update state for Celery Polling
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateStatus, setUpdateStatus] = useState<string>('');
    const [updateProgress, setUpdateProgress] = useState(0);

    // Derived riotId and tagline from the single 'id' param
    const lastHyphenIndex = id?.lastIndexOf('-') ?? -1;
    const riotId = id && lastHyphenIndex !== -1 ? id.substring(0, lastHyphenIndex) : null;
    const tagline = id && lastHyphenIndex !== -1 ? id.substring(lastHyphenIndex + 1) : null;

    useEffect(() => {
        const fetchData = async () => {
            if (!id || lastHyphenIndex === -1 || !riotId || !tagline) {
                if (id) {
                    setError("Invalid profile URL. Expected format: name-tag");
                    setIsLoading(false);
                }
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                console.log(`Fetching profile for ${riotId}#${tagline}`);
                const playerResponse = await fetch(`${API_BASE_URL}/api/v1/players/${encodeURIComponent(riotId)}/${encodeURIComponent(tagline)}`);

                if (!playerResponse.ok) {
                    throw new Error('Player not found.');
                }

                const playerData = await playerResponse.json();
                setPuuid(playerData.puuid);
                setRegion(playerData.region);

                // 2. Get Matches (This is now instant via Redis/DB!)
                console.log('Fetching matches for:', playerData.region, playerData.puuid);
                const matchesResponse = await fetch(`${API_BASE_URL}/api/v1/matches/${playerData.region}/${playerData.puuid}`);

                if (!matchesResponse.ok) {
                    throw new Error('Failed to fetch matches.');
                }

                const matchesData = await matchesResponse.json();

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

    const handleUpdateMatches = async () => {
        if (!puuid || !region) return;
        try {
            setIsUpdating(true);
            setUpdateStatus('Starting background sync...');
            setUpdateProgress(0);

            // 1. Trigger the background Celery task
            const triggerResp = await fetch(`${API_BASE_URL}/api/v1/matches/${region}/${puuid}/update`, {
                method: 'POST'
            });
            if (!triggerResp.ok) throw new Error("Failed to start update.");
            const triggerData = await triggerResp.json();
            const taskId = triggerData.task_id;

            // 2. Poll for status every 1.5 seconds
            const pollInterval = setInterval(async () => {
                const statusResp = await fetch(`${API_BASE_URL}/api/v1/matches/update/status/${taskId}`);
                const statusData = await statusResp.json();

                if (statusData.state === 'SUCCESS') {
                    clearInterval(pollInterval);
                    setUpdateStatus('Sync complete!');
                    setUpdateProgress(100);

                    // 3. Refresh the matches list from the backend (which hits the cleared Redis cache)
                    const matchesResponse = await fetch(`${API_BASE_URL}/api/v1/matches/${region}/${puuid}`);
                    const matchesData = await matchesResponse.json();

                    setMatches(matchesData.map((match: any) => ({ ...match, match_id: match.match_id || match.id })));

                    setTimeout(() => setIsUpdating(false), 2000); // Hide progress bar after delay
                } else if (statusData.state === 'PROGRESS' && statusData.meta) {
                    setUpdateStatus(statusData.meta.status || 'Fetching from API...');
                    if (statusData.meta.total) {
                        setUpdateProgress(Math.round((statusData.meta.current / statusData.meta.total) * 100));
                    }
                } else if (statusData.state === 'FAILURE') {
                    clearInterval(pollInterval);
                    setUpdateStatus('Sync failed.');
                    setTimeout(() => setIsUpdating(false), 3000);
                }
            }, 1500);

        } catch (e) {
            console.error("Update failed", e);
            setUpdateStatus('Sync failed to start.');
            setTimeout(() => setIsUpdating(false), 3000);
        }
    };

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
                isUpdating={isUpdating}
                updateStatus={updateStatus}
                updateProgress={updateProgress}
                onUpdateMatches={handleUpdateMatches}
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
