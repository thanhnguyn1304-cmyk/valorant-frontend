import { motion } from 'framer-motion';
import { ArrowLeft, User } from 'lucide-react';
import MatchHistoryCard from './MatchHistoryCard';

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
    start_time?: string;
}

interface ProfileDashboardProps {
    puuid: string;
    playerName?: string;
    matches: MatchData[];
    isLoading: boolean;
    onBack: () => void;
    onMatchClick?: (matchId: string) => void;
}

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
        const losses = matches.filter(m => m.result === 'loss').length;
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
            // Just use "Recent" for now since we don't have proper date parsing
            const dateKey = 'Recent Matches';
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(match);
        });

        return groups;
    };

    const groupedMatches = groupMatchesByDate(matches);

    return (
        <div className="min-h-screen bg-surface">
            {/* Header Banner */}
            <div className="relative h-48 bg-gradient-to-r from-surface-100 via-surface-200 to-surface-100 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-val rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                </div>

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
                    <div className="w-24 h-24 rounded-xl bg-surface-300 border-4 border-surface flex items-center justify-center">
                        <User className="w-12 h-12 text-text-tertiary" />
                    </div>
                    <div className="pb-1">
                        <h1 className="text-3xl font-bold text-text-primary">{playerName || 'Player'}</h1>
                        <p className="text-text-tertiary text-sm font-mono">{puuid.slice(0, 20)}...</p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-surface-300 bg-surface-100">
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
            <div className="max-w-7xl mx-auto px-6 py-8">
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
                                <StatItem label="K/D Ratio" value={stats.avgKD} highlight={Number(stats.avgKD) >= 1} />
                                <StatItem label="Headshot %" value={`${stats.avgHS}%`} highlight={stats.avgHS >= 25} />
                                <StatItem label="ADR" value={stats.avgADR.toString()} />
                                <StatItem label="ACS" value={stats.avgACS.toString()} />
                                <StatItem label="Total Kills" value={stats.totalKills.toString()} />
                                <StatItem label="MVPs" value={stats.mvpCount.toString()} highlight={stats.mvpCount > 0} />
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
                                <PerformanceBar label="K/D" value={Number(stats.avgKD)} max={3} color="val" />
                                <PerformanceBar label="HS%" value={stats.avgHS} max={50} color="success" />
                                <PerformanceBar label="ADR" value={stats.avgADR} max={200} color="val" />
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
                            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                                {matches.slice(0, 8).map((match, index) => (
                                    <div
                                        key={match.id}
                                        className={`flex-shrink-0 px-3 py-2 rounded-lg text-center ${match.result === 'win'
                                            ? 'bg-success/10 border border-success/20'
                                            : 'bg-loss/10 border border-loss/20'
                                            }`}
                                    >
                                        <div className="text-text-tertiary text-xs mb-1">
                                            {index === 0 ? 'Latest' : `${index + 1} ago`}
                                        </div>
                                        <div className={`text-lg font-bold ${match.result === 'win' ? 'text-success' : 'text-loss'}`}>
                                            {match.roundsWon}:{match.roundsLost}
                                        </div>
                                        <div className="text-text-tertiary text-xs">K/D {match.kdRatio}</div>
                                    </div>
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
                                <div className="space-y-6">
                                    {Object.entries(groupedMatches).map(([date, dateMatches]) => (
                                        <div key={date}>
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-sm font-medium text-text-secondary">{date}</h3>
                                                <span className="text-xs text-text-tertiary">
                                                    {dateMatches.filter(m => m.result === 'win').length}W / {dateMatches.filter(m => m.result === 'loss').length}L
                                                </span>
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
                                    ))}
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
    highlight?: boolean;
}

const StatItem = ({ label, value, highlight = false }: StatItemProps) => (
    <div className="bg-surface-200 rounded-lg p-3">
        <div className="text-text-tertiary text-xs uppercase tracking-wider mb-1">{label}</div>
        <div className={`text-xl font-bold ${highlight ? 'text-val' : 'text-text-primary'}`}>{value}</div>
    </div>
);

// Performance Bar Component
interface PerformanceBarProps {
    label: string;
    value: number;
    max: number;
    color: 'val' | 'success';
}

const PerformanceBar = ({ label, value, max, color }: PerformanceBarProps) => {
    const percentage = Math.min((value / max) * 100, 100);
    const colorClasses = color === 'val' ? 'bg-val' : 'bg-success';

    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <span className="text-text-secondary text-sm">{label}</span>
                <span className="text-text-primary font-medium">{value}</span>
            </div>
            <div className="h-2 bg-surface-300 rounded-full overflow-hidden">
                <div
                    className={`h-full ${colorClasses} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default ProfileDashboard;
