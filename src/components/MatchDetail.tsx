import { useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy } from 'lucide-react';

interface PlayerData {
    puuid: string;
    user_id: string;
    user_tag: string;
    agent_name: string;
    agent_image: string;
    team_id: string;
    current_rank: string;
    current_rank_image: string;
    kills: number;
    deaths: number;
    assists: number;
    combat_score: number;
    damage_dealt: number;
    headshots: number;
    othershots: number;
    rounds_played: number;
    result: string;
    position: number;
    kda?: string;
    kdRatio?: string | number;
    adr?: number;
    acs?: number;
    hsPercent?: number;
    fmt_pos?: string;
}

interface MatchDetailData {
    id: string;
    map_name: string;
    start_time: number;
    duration_ms: number;
    winning_team: string;
    rounds_play: number;
    participations: PlayerData[];
}

interface MatchDetailProps {
    match: MatchDetailData | null;
    isLoading: boolean;
    onBack: () => void;
    currentPuuid?: string;
}

const MatchDetail = ({ match, isLoading, onBack, currentPuuid }: MatchDetailProps) => {
    // Lock body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onBack();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onBack]);

    // Separate teams
    const blueTeam = match?.participations?.filter(p => p.team_id === 'Blue').sort((a, b) => a.position - b.position) || [];
    const redTeam = match?.participations?.filter(p => p.team_id === 'Red').sort((a, b) => a.position - b.position) || [];

    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center"
            >
                {/* Dark overlay - click to close */}
                <div
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    onClick={onBack}
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 40, scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="relative z-10 w-[95vw] max-w-6xl max-h-[90vh] bg-surface-100 rounded-2xl border border-surface-300 shadow-2xl overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="flex items-center justify-between px-6 py-4 bg-surface-200 border-b border-surface-300 flex-shrink-0">
                        {isLoading ? (
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full border-2 border-val border-t-transparent animate-spin" />
                                <span className="text-text-secondary text-sm">Loading match details...</span>
                            </div>
                        ) : match ? (
                            <div className="flex items-center gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-text-primary">{match.map_name}</h2>
                                    <p className="text-text-tertiary text-sm">
                                        {formatDuration(match.duration_ms)} • {match.rounds_play} Rounds
                                    </p>
                                </div>
                                <div className="ml-4 text-right">
                                    <div className="text-text-tertiary text-xs uppercase">Winner</div>
                                    <div className={`text-lg font-bold ${match.winning_team === 'Blue' ? 'text-blue-400' : 'text-val'}`}>
                                        {match.winning_team} Team
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <span className="text-text-secondary">Match not found</span>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={onBack}
                            className="p-2 rounded-lg hover:bg-surface-300 transition-colors text-text-secondary hover:text-text-primary"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Scrollable Body */}
                    <div className="overflow-y-auto flex-1 p-6">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 rounded-full border-2 border-val border-t-transparent animate-spin" />
                                    <span className="text-text-secondary">Loading match details...</span>
                                </div>
                            </div>
                        ) : !match ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="text-center">
                                    <p className="text-text-secondary mb-4">Match not found</p>
                                    <button onClick={onBack} className="btn-primary">Close</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Blue Team */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-8"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-3 h-3 rounded-full bg-blue-400" />
                                        <h2 className="text-lg font-bold text-text-primary">Blue Team</h2>
                                        <span className={`badge ${blueTeam[0]?.result === 'win' ? 'badge-win' : 'badge-loss'}`}>
                                            {blueTeam[0]?.result === 'win' ? 'VICTORY' : 'DEFEAT'}
                                        </span>
                                    </div>
                                    <TeamTable players={blueTeam} currentPuuid={currentPuuid} teamColor="blue" />
                                </motion.div>

                                {/* Red Team */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-3 h-3 rounded-full bg-val" />
                                        <h2 className="text-lg font-bold text-text-primary">Red Team</h2>
                                        <span className={`badge ${redTeam[0]?.result === 'win' ? 'badge-win' : 'badge-loss'}`}>
                                            {redTeam[0]?.result === 'win' ? 'VICTORY' : 'DEFEAT'}
                                        </span>
                                    </div>
                                    <TeamTable players={redTeam} currentPuuid={currentPuuid} teamColor="red" />
                                </motion.div>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Team Table Component
interface TeamTableProps {
    players: PlayerData[];
    currentPuuid?: string;
    teamColor: 'blue' | 'red';
}

const TeamTable = ({ players, currentPuuid, teamColor }: TeamTableProps) => {
    const borderColor = teamColor === 'blue' ? 'border-l-blue-400' : 'border-l-val';

    return (
        <div className="card overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[1fr_60px_100px_80px_80px_80px_80px] gap-4 px-4 py-3 bg-surface-200 border-b border-surface-300 text-text-tertiary text-xs uppercase tracking-wider font-medium">
                <div>Player</div>
                <div className="text-center">Rank</div>
                <div className="text-center">K / D / A</div>
                <div className="text-center">K/D</div>
                <div className="text-center">ADR</div>
                <div className="text-center">HS%</div>
                <div className="text-center">ACS</div>
            </div>

            {/* Players */}
            {players.map((player, index) => {
                const isCurrentPlayer = player.puuid === currentPuuid;
                const kd = player.kdRatio || (player.deaths === 0 ? player.kills : (player.kills / player.deaths).toFixed(2));
                const adr = player.adr || Math.round(player.damage_dealt / player.rounds_played);
                const acs = player.acs || Math.round(player.combat_score / player.rounds_played);
                const hs = player.hsPercent || Math.round((player.headshots / (player.headshots + player.othershots)) * 100) || 0;
                const kda = player.kda || `${player.kills}/${player.deaths}/${player.assists}`;


                return (
                    <div
                        key={player.puuid}
                        className={`grid grid-cols-[1fr_60px_100px_80px_80px_80px_80px] gap-4 px-4 py-3 items-center border-l-4 ${borderColor} ${isCurrentPlayer ? 'bg-val/10' : index % 2 === 0 ? 'bg-surface-100' : 'bg-surface-100/50'
                            } hover:bg-surface-200 transition-colors`}
                    >
                        {/* Player Info */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-300">
                                    <img
                                        src={player.agent_image}
                                        alt={player.agent_name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect fill="%23232A31" width="40" height="40"/></svg>';
                                        }}
                                    />
                                </div>
                                {player.position === 1 && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded flex items-center justify-center">
                                        <Trophy className="w-3 h-3 text-black" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className={`font-medium ${isCurrentPlayer ? 'text-val' : 'text-text-primary'}`}>
                                    {player.user_id}
                                    <span className="text-text-muted">#{player.user_tag}</span>
                                </div>
                                <div className="text-text-tertiary text-xs">{player.agent_name}</div>
                            </div>
                        </div>

                        {/* Rank */}
                        <div className="flex items-center justify-center">
                            {player.current_rank_image ? (
                                <img
                                    src={`${API_BASE_URL}${player.current_rank_image}`}
                                    alt={player.current_rank}
                                    className="w-8 h-8 object-contain"
                                    title={player.current_rank}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                            ) : null}
                            <span className={`text-text-tertiary text-xs ${player.current_rank_image ? 'hidden' : ''}`}>
                                {player.current_rank || '—'}
                            </span>
                        </div>

                        {/* K/D/A */}
                        <div className="text-center font-medium text-text-primary">{kda}</div>

                        {/* K/D */}
                        <div className={`text-center font-bold ${Number(kd) >= 1 ? 'text-success' : 'text-loss'}`}>
                            {kd}
                        </div>

                        {/* ADR */}
                        <div className="text-center font-medium text-text-primary">
                            {adr}
                        </div>

                        {/* HS% */}
                        <div className="text-center font-medium text-text-primary">
                            {hs}%
                        </div>

                        {/* ACS */}
                        <div className="text-center font-bold text-text-primary">
                            {acs}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MatchDetail;
