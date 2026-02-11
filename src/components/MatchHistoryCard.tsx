import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';
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
    current_rank_image?: string;
    current_rank?: string;
    onClick?: () => void;
}

const MatchHistoryCard = ({
    agent_name,
    agent_image,
    map,
    roundsWon,
    roundsLost,

    kdRatio,
    result,
    fmt_pos,
    hsPercent,
    adr,
    acs,
    current_rank_image,
    current_rank,
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
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-300 flex-shrink-0 ring-1 ring-white/10 shadow-lg">
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
            <div className="flex-shrink-0 w-32 ml-2">
                <div className="text-text-primary font-bold text-xl leading-tight tracking-wide">{map}</div>
                <div className="text-text-secondary text-base font-medium tracking-wider mt-0.5 uppercase opacity-90">{agent_name}</div>
            </div>

            {/* Rank Icon */}
            <div className="flex-shrink-0 w-14 flex items-center justify-start">
                {current_rank_image ? (
                    <img
                        src={`${API_BASE_URL}${current_rank_image}`}
                        alt={current_rank || 'Rank'}
                        className="w-12 h-12 object-contain"
                        title={current_rank}
                    />
                ) : (
                    <div className="w-12 h-12" />
                )}
            </div>

            {/* Score - Fixed width columns for proper alignment */}
            <div className="flex items-center flex-shrink-0 w-36 justify-center rounded-lg py-1.5">
                <span className={`w-10 text-right text-3xl font-black tabular-nums ${isWin ? 'text-success' : isDraw ? 'text-yellow-500' : 'text-text-primary'}`}>
                    {roundsWon}
                </span>
                <span className="w-6 text-center text-text-muted/60 text-xl font-light px-1">:</span>
                <span className={`w-10 text-left text-3xl font-black tabular-nums ${!isWin && !isDraw ? 'text-loss' : 'text-text-secondary'}`}>
                    {roundsLost}
                </span>
            </div>

            {/* Result Badge & Position - Center aligned column */}
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0 w-28 justify-center ml-8">
                <span
                    className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-widest w-full text-center shadow-lg border-2 ${isWin
                        ? 'bg-success/20 text-success border-success/50'
                        : isDraw
                            ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50'
                            : 'bg-loss/20 text-loss border-loss/50'
                        }`}
                >
                    {result === 'win' ? 'Victory' : result === 'draw' ? 'Draw' : 'Defeat'}
                </span>
                {fmt_pos === 'MVP' ? (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-yellow-500 text-gray-900 w-full text-center tracking-wider shadow-md">
                        MVP
                    </span>
                ) : fmt_pos === '2nd' ? (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-slate-400 text-gray-900 w-full text-center tracking-wider shadow-md">
                        2nd
                    </span>
                ) : fmt_pos === '3rd' ? (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-amber-600 text-gray-900 w-full text-center tracking-wider shadow-md">
                        3rd
                    </span>
                ) : (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-surface-300 text-text-secondary border border-white/10 w-full text-center">
                        {fmt_pos}
                    </span>
                )}
            </div>

            {/* Spacer to push stats right */}
            <div className="flex-1" />

            {/* Stats Section - Fixed widths to align with header */}
            <div className="flex items-center gap-2 flex-shrink-0 justify-end ml-auto pr-4">
                <div className="text-center w-[80px]">
                    <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest mb-1 opacity-80">K/D</div>
                    <div className={`text-xl font-black ${Number(kdRatio) > 1 ? 'text-success' : Number(kdRatio) < 1 ? 'text-loss' : 'text-text-primary'}`}>
                        {kdRatio}
                    </div>
                </div>

                <div className="text-center w-[80px]">
                    <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest mb-1 opacity-80">HS%</div>
                    <div className="text-xl font-black text-text-primary">{hsPercent}%</div>
                </div>

                {/* ADR - Uniform white color like HS% and ACS */}
                <div className="text-center w-[80px] hidden xl:block">
                    <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest mb-1 opacity-80">ADR</div>
                    <div className="text-xl font-black text-text-primary">{adr}</div>
                </div>

                <div className="text-center w-[80px]">
                    <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest mb-1 opacity-80">ACS</div>
                    <div className="text-xl font-black text-text-primary">{acs}</div>
                </div>
            </div>

            {/* Arrow indicator */}
            <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-text-secondary transition-colors flex-shrink-0" />
        </motion.div>
    );
};

export default MatchHistoryCard;
