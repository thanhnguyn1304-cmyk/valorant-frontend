import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface MatchHistoryCardProps {
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
    onClick?: () => void;
}

const MatchHistoryCard = ({
    agent_name,
    agent_image,
    map,
    roundsWon,
    roundsLost,
    kda,
    kdRatio,
    result,
    fmt_pos,
    hsPercent,
    adr,
    acs,
    onClick,
}: MatchHistoryCardProps) => {
    const isWin = result === 'win';
    const isDraw = result === 'draw';

    // Result colors
    const resultBorderClass = isWin ? 'border-l-success' : isDraw ? 'border-l-yellow-500' : 'border-l-loss';
    const resultBgClass = isWin ? 'bg-success/5' : isDraw ? 'bg-yellow-500/5' : 'bg-loss/5';

    return (
        <motion.div
            whileHover={{ scale: 1.005, x: 2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={onClick}
            className={`relative flex items-center gap-8 p-4 rounded-r-lg border-l-4 ${resultBorderClass} ${resultBgClass} bg-surface-100 hover:bg-surface-200 transition-colors duration-200 cursor-pointer group`}
        >
            {/* Agent Icon */}
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-300 flex-shrink-0">
                <img
                    src={agent_image}
                    alt={agent_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect fill="%23232A31" width="40" height="40"/></svg>';
                    }}
                />
            </div>

            {/* Map & Mode Info */}
            <div className="flex-shrink-0 min-w-[100px]">
                <div className="text-text-primary font-semibold">{map}</div>
                <div className="text-text-tertiary text-xs uppercase tracking-wider">{agent_name}</div>
            </div>

            {/* Score */}
            <div className="flex items-center flex-shrink-0 min-w-[100px]">
                <span className={`text-2xl font-bold w-[36px] text-right ${isWin ? 'text-success' : isDraw ? 'text-yellow-500' : 'text-text-primary'}`}>
                    {roundsWon}
                </span>
                <span className="text-text-muted text-lg mx-1">:</span>
                <span className={`text-2xl font-bold w-[36px] text-left ${!isWin && !isDraw ? 'text-loss' : 'text-text-secondary'}`}>
                    {roundsLost}
                </span>
            </div>

            {/* Result Badge & Position */}
            <div className="flex items-center gap-2 flex-shrink-0 min-w-[120px]">
                <span className={`badge ${isWin ? 'badge-win' : isDraw ? 'badge-draw' : 'badge-loss'}`}>
                    {result.toUpperCase()}
                </span>
                {fmt_pos === 'MVP' ? (
                    <span className="badge badge-mvp">MVP</span>
                ) : fmt_pos === '2nd' ? (
                    <span className="badge badge-2nd">2nd</span>
                ) : fmt_pos === '3rd' ? (
                    <span className="badge badge-3rd">3rd</span>
                ) : (
                    <span className="badge badge-position">{fmt_pos}</span>
                )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-end gap-6 ml-auto">
                <StatCell label="K/D/A" value={kda} />
                <StatCell
                    label="K/D"
                    value={String(kdRatio)}
                    color={Number(kdRatio) > 1 ? 'success' : Number(kdRatio) < 1 ? 'loss' : 'primary'}
                />
                <StatCell
                    label="HS%"
                    value={`${hsPercent}%`}
                />
                <StatCell label="ADR" value={String(adr)} />
                <StatCell
                    label="ACS"
                    value={String(acs)}
                />
            </div>

            {/* Arrow indicator */}
            <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-text-secondary transition-colors flex-shrink-0" />
        </motion.div>
    );
};

// Stat Cell Component
interface StatCellProps {
    label: string;
    value: string;
    color?: 'success' | 'loss' | 'primary';
}

const StatCell = ({ label, value, color = 'primary' }: StatCellProps) => {
    const colorClass = color === 'success' ? 'text-success' : color === 'loss' ? 'text-loss' : 'text-text-primary';
    return (
        <div className="text-center w-[60px]">
            <div className="text-text-tertiary text-xs uppercase tracking-wider">{label}</div>
            <div className={`font-bold ${colorClass}`}>{value}</div>
        </div>
    );
};

export default MatchHistoryCard;
