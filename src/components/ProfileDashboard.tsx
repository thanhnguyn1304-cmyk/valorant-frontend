import { motion } from 'framer-motion';
import { ArrowLeft, User } from 'lucide-react';
import MatchHistoryCard from './MatchHistoryCard';
import CoachReport from './CoachReport';

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

interface ProfileDashboardProps {
    puuid: string;
    playerName?: string;
    matches: MatchData[];
    isLoading: boolean;
    onBack: () => void;
    onMatchClick?: (matchId: string) => void;
}

// Helper function to calculate time ago from start_time
const getTimeAgo = (startTime?: string | number | Date): string => {
    if (!startTime) return 'Unknown';

    try {
        // Handle different date formats from backend
        let matchDate: Date;
        if (typeof startTime === 'string') {
            matchDate = new Date(startTime);
        } else if (typeof startTime === 'number') {
            // Could be Unix timestamp in seconds or milliseconds
            matchDate = startTime > 1e12 ? new Date(startTime) : new Date(startTime * 1000);
        } else {
            matchDate = startTime;
        }

        // Check if valid date
        if (isNaN(matchDate.getTime())) return 'Unknown';

        const now = new Date();
        const diffMs = now.getTime() - matchDate.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return `${Math.floor(diffDays / 7)}w ago`;
    } catch {
        return 'Unknown';
    }
};

const ProfileDashboard = ({ puuid, playerName, matches, isLoading, onBack, onMatchClick }: ProfileDashboardProps) => {
    // Calculate aggregate stats from matches
    const calculateStats = () => {
        if (matches.length === 0) {
            return {
                totalMatches: 0,
                wins: 0,
                losses: 0,
                winRate: 0,
                avgKD: '0.00',
                avgHS: 0,
                avgADR: 0,
                avgACS: 0,
                totalKills: 0,
                totalDeaths: 0,
                totalAssists: 0,
                mvpCount: 0,
            };
        }

        const wins = matches.filter(m => m.result === 'win').length;
        const losses = matches.filter(m => m.result === 'lose' || m.result === 'loss').length;
        const mvpCount = matches.filter(m => m.fmt_pos === 'MVP').length;
        const totalKD = matches.reduce((acc, m) => acc + Number(m.kdRatio), 0);
        const totalHS = matches.reduce((acc, m) => acc + m.hsPercent, 0);
        const totalADR = matches.reduce((acc, m) => acc + m.adr, 0);
        const totalACS = matches.reduce((acc, m) => acc + m.acs, 0);

        // Parse KDA to get totals
        let totalKills = 0, totalDeaths = 0, totalAssists = 0;
        matches.forEach(m => {
            const [k, d, a] = m.kda.split('/').map(Number);
            totalKills += k || 0;
            totalDeaths += d || 0;
            totalAssists += a || 0;
        });

        return {
            totalMatches: matches.length,
            wins,
            losses,
            winRate: Math.round((wins / matches.length) * 100),
            avgKD: (totalKD / matches.length).toFixed(2),
            avgHS: Math.round(totalHS / matches.length),
            avgADR: Math.round(totalADR / matches.length),
            avgACS: Math.round(totalACS / matches.length),
            totalKills,
            totalDeaths,
            totalAssists,
            mvpCount,
        };
    };

    const stats = calculateStats();

    // Group matches by date
    const groupMatchesByDate = (matches: MatchData[]) => {
        const groups: { [key: string]: MatchData[] } = {};

        matches.forEach(match => {
            let dateKey = 'Unknown Date';

            if (match.start_time) {
                try {
                    let matchDate: Date;
                    if (typeof match.start_time === 'string') {
                        matchDate = new Date(match.start_time);
                    } else if (typeof match.start_time === 'number') {
                        // Unix timestamp - could be seconds or milliseconds
                        matchDate = match.start_time > 1e12 ? new Date(match.start_time) : new Date(match.start_time * 1000);
                    } else {
                        matchDate = match.start_time;
                    }

                    if (!isNaN(matchDate.getTime())) {
                        // Format as "Feb 8" style
                        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        dateKey = `${months[matchDate.getMonth()]} ${matchDate.getDate()}`;
                    }
                } catch {
                    dateKey = 'Unknown Date';
                }
            }

            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(match);
        });

        return groups;
    };

    const groupedMatches = groupMatchesByDate(matches);

    return (
        <div className="min-h-screen relative bg-surface">
            {/* Global Background */}
            <div className="fixed inset-0 z-0">
                <img
                    src="/images/hero-background.jpg"
                    alt=""
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-surface/95" />
            </div>

            {/* Header Banner */}
            <div className="relative z-10 h-48 bg-gradient-to-r from-surface-100 via-surface-200 to-surface-100 overflow-hidden">
                <img
                    src="/images/valorant-banner.jpg"
                    alt="Valorant Background"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-surface/40" />

                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={onBack}
                    className="absolute top-6 left-6 flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-medium">Back</span>
                </motion.button>

                {/* Player Info */}
                <div className="absolute bottom-6 left-6 flex items-end gap-4">
                    <div className="w-24 h-24 rounded-xl bg-surface-300 border-4 border-surface flex items-center justify-center overflow-hidden">
                        {matches.length >= 3 ? (
                            <img
                                src={matches[2].agent_image}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : matches.length > 0 ? (
                            <img
                                src={matches[0].agent_image}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-12 h-12 text-text-tertiary" />
                        )}
                    </div>
                    <div className="pb-1">
                        <h1 className="text-3xl font-bold text-text-primary">{playerName || 'Player'}</h1>
                        <p className="text-text-tertiary text-sm font-mono">{puuid.slice(0, 20)}...</p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="relative z-10 border-b border-surface-300 bg-surface-100/95 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6">
                    <nav className="flex gap-1">
                        <button className="px-4 py-3 text-sm font-medium text-val border-b-2 border-val">
                            Overview
                        </button>
                        <button className="px-4 py-3 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                            Matches
                        </button>
                        <button className="px-4 py-3 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                            Agents
                        </button>
                        <button className="px-4 py-3 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                            Maps
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Stats Overview */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Competitive Overview Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card p-6"
                        >
                            <h2 className="text-lg font-bold text-text-primary mb-4">Competitive Overview</h2>

                            {/* Win/Loss */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex-1">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-text-primary">{stats.winRate}%</span>
                                        <span className="text-text-tertiary text-sm">Win Rate</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-success font-medium">{stats.wins}W</span>
                                        <span className="text-text-muted">/</span>
                                        <span className="text-loss font-medium">{stats.losses}L</span>
                                    </div>
                                </div>
                                <div className="w-16 h-16 rounded-full bg-surface-200 flex items-center justify-center">
                                    <div className="text-2xl font-bold text-text-primary">{stats.totalMatches}</div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <StatItem label="K/D Ratio" value={stats.avgKD} />
                                <StatItem label="Headshot %" value={`${stats.avgHS}%`} />
                                <StatItem label="ADR" value={stats.avgADR.toString()} />
                                <StatItem label="ACS" value={stats.avgACS.toString()} />
                                <StatItem label="Total Kills" value={stats.totalKills.toString()} />
                                <StatItem label="MVPs" value={stats.mvpCount.toString()} />
                            </div>
                        </motion.div>

                        {/* Performance Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="card p-6"
                        >
                            <h2 className="text-lg font-bold text-text-primary mb-4">Performance</h2>
                            <div className="space-y-4">
                                <PerformanceBar label="K/D" value={Number(stats.avgKD)} max={3} />
                                <PerformanceBar label="HS%" value={stats.avgHS} max={50} />
                                <PerformanceBar label="ADR" value={stats.avgADR} max={200} />
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Match History */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {/* Recent Scores Preview */}
                            <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-3 pt-2 scrollbar-hide">
                                {matches.slice(0, 8).map((match, index) => (
                                    <motion.div
                                        key={match.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        className={`flex-shrink-0 relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ${match.result === 'win'
                                            ? 'bg-gradient-to-br from-success/20 via-success/10 to-transparent border border-success/30 hover:border-success/50'
                                            : 'bg-gradient-to-br from-loss/20 via-loss/10 to-transparent border border-loss/30 hover:border-loss/50'
                                            }`}
                                        style={{ minWidth: '140px' }}
                                    >
                                        {/* Glow effect */}
                                        <div className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 ${match.result === 'win' ? 'bg-success/5' : 'bg-loss/5'
                                            }`} />

                                        <div className="relative p-3">
                                            {/* Time badge */}
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${index === 0
                                                    ? 'bg-val/20 text-val'
                                                    : 'bg-surface-300 text-text-tertiary'
                                                    }`}>
                                                    {index === 0 ? 'LATEST' : getTimeAgo(match.start_time)}
                                                </span>
                                            </div>

                                            {/* Agent + Score row */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-8 h-8 rounded-lg overflow-hidden bg-surface-300 flex-shrink-0">
                                                    <img
                                                        src={match.agent_image}
                                                        alt={match.agent_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className={`text-xl font-bold ${match.result === 'win' ? 'text-success' : 'text-loss'}`}>
                                                    {match.roundsWon}
                                                    <span className="text-text-muted mx-0.5">:</span>
                                                    {match.roundsLost}
                                                </div>
                                            </div>

                                            {/* Map name */}
                                            <div className="text-text-secondary text-xs font-medium mb-1">{match.map}</div>

                                            {/* Stats row */}
                                            <div className="flex items-center gap-3 text-[11px]">
                                                <span className={`font-semibold ${Number(match.kdRatio) > 1 ? 'text-success' :
                                                    Number(match.kdRatio) < 1 ? 'text-loss' : 'text-text-primary'
                                                    }`}>
                                                    {match.kdRatio} KD
                                                </span>
                                                <span className="text-text-muted">•</span>
                                                <span className="text-text-primary">{match.acs} ACS</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Match List */}
                            {isLoading ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 rounded-full border-2 border-val border-t-transparent animate-spin" />
                                        <span className="text-text-secondary">Loading matches...</span>
                                    </div>
                                </div>
                            ) : matches.length === 0 ? (
                                <div className="card p-12 text-center">
                                    <p className="text-text-secondary">No matches found for this player.</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* AI Coach Report */}
                                    <div className="mb-8">
                                        <CoachReport puuid={puuid} />
                                    </div>

                                    <div className="space-y-6">
                                        {Object.entries(groupedMatches).map(([date, dateMatches]) => {
                                            // Calculate daily stats
                                            const wins = dateMatches.filter(m => m.result === 'win').length;
                                            const losses = dateMatches.filter(m => m.result === 'lose' || m.result === 'loss').length;

                                            const avgKD = (dateMatches.reduce((sum, m) => sum + Number(m.kdRatio || 0), 0) / dateMatches.length).toFixed(2);
                                            const avgHS = Math.round(dateMatches.reduce((sum, m) => sum + (m.hsPercent || 0), 0) / dateMatches.length);
                                            const avgADR = Math.round(dateMatches.reduce((sum, m) => sum + (m.adr || 0), 0) / dateMatches.length);
                                            const avgACS = Math.round(dateMatches.reduce((sum, m) => sum + (m.acs || 0), 0) / dateMatches.length);

                                            return (
                                                <div key={date}>
                                                    <div className="flex items-center gap-4 md:gap-6 p-4 mb-2 bg-surface-200 rounded-r-lg border border-surface-300 border-l-4 border-l-transparent">
                                                        {/* Agent icon placeholder - matches w-14 in match row */}
                                                        <div className="w-12 md:w-14 flex-shrink-0 flex items-center justify-center">
                                                            <span className="text-xl md:text-2xl font-bold text-text-primary">{dateMatches.length}</span>
                                                        </div>
                                                        {/* Map info placeholder - matches w-32 ml-2 in match row */}
                                                        <div className="flex-shrink-0 w-24 md:w-32 ml-0 md:ml-2">
                                                            <div className="text-text-primary font-bold text-lg">{date}</div>
                                                            <div className="text-text-tertiary text-xs">Matches</div>
                                                        </div>
                                                        {/* Rank icon spacer - matches w-14 in match row */}
                                                        <div className="flex-shrink-0 w-10 md:w-14 hidden sm:block" />
                                                        {/* W/L aligned to score column - matches w-36 in match row */}
                                                        <div className="flex-shrink-0 w-28 md:w-36 flex items-center justify-center">
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-success font-black text-xl md:text-2xl">{wins}W</span>
                                                                <span className="text-text-muted text-lg md:text-xl">//</span>
                                                                <span className="text-loss font-black text-xl md:text-2xl">{losses}L</span>
                                                            </div>
                                                        </div>
                                                        {/* Result badge spacer - matches w-28 ml-8 in match row */}
                                                        <div className="flex-shrink-0 w-24 md:w-28 ml-2 md:ml-4" />

                                                        {/* Spacer to push stats right */}
                                                        <div className="flex-1" />

                                                        {/* Stats - aligned with match row stats */}
                                                        <div className="flex items-center justify-end gap-1 md:gap-2 flex-shrink-0 pr-2 md:pr-4">
                                                            <div className="text-center w-[60px] md:w-[80px]">
                                                                <div className="text-text-secondary text-[10px] md:text-xs uppercase tracking-wider">K/D</div>
                                                                <div className={`text-lg md:text-xl font-black ${Number(avgKD) > 1 ? 'text-success' : Number(avgKD) < 1 ? 'text-loss' : 'text-text-primary'}`}>
                                                                    {avgKD}
                                                                </div>
                                                            </div>
                                                            <div className="text-center w-[60px] md:w-[80px]">
                                                                <div className="text-text-secondary text-[10px] md:text-xs uppercase tracking-wider">HS%</div>
                                                                <div className="text-lg md:text-xl font-black text-text-primary">{avgHS}%</div>
                                                            </div>
                                                            <div className="text-center w-[60px] md:w-[80px] hidden xl:block">
                                                                <div className="text-text-secondary text-[10px] md:text-xs uppercase tracking-wider">ADR</div>
                                                                <div className="text-lg md:text-xl font-black text-text-primary">{avgADR}</div>
                                                            </div>
                                                            <div className="text-center w-[60px] md:w-[80px]">
                                                                <div className="text-text-secondary text-[10px] md:text-xs uppercase tracking-wider">ACS</div>
                                                                <div className="text-lg md:text-xl font-black text-text-primary">{avgACS}</div>
                                                            </div>
                                                        </div>
                                                        {/* Spacer for arrow */}
                                                        <div className="w-5 flex-shrink-0" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        {dateMatches.map((match) => (
                                                            <MatchHistoryCard
                                                                key={match.id}
                                                                {...match}
                                                                onClick={() => onMatchClick?.(match.match_id || String(match.id))}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Stat Item Component
interface StatItemProps {
    label: string;
    value: string;
}

const StatItem = ({ label, value }: StatItemProps) => (
    <div className="bg-surface-200 rounded-lg p-3">
        <div className="text-text-tertiary text-xs uppercase tracking-wider mb-1">{label}</div>
        <div className="text-xl font-bold text-text-primary">{value}</div>
    </div>
);

// Performance Bar Component
interface PerformanceBarProps {
    label: string;
    value: number;
    max: number;
}

const PerformanceBar = ({ label, value, max }: PerformanceBarProps) => {
    const percentage = Math.min((value / max) * 100, 100);

    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <span className="text-text-secondary text-sm">{label}</span>
                <span className="text-text-primary font-medium">{value}</span>
            </div>
            <div className="h-2 bg-surface-300 rounded-full overflow-hidden">
                <div
                    className="h-full bg-text-secondary rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default ProfileDashboard;
