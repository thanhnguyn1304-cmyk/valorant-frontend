import { motion } from 'framer-motion';

interface RankCircleProps {
    currentRank: string;
    rr?: number; // Rank Rating 0-100
    tier?: number; // 0-24 for Valorant ranks
}

const RankCircle = ({ currentRank, rr = 50, tier = 12 }: RankCircleProps) => {
    const segments = 24; // Total rank segments
    const filledSegments = Math.min(tier, segments);
    const rrProgress = rr / 100;

    // Generate segment paths for the fan ring
    const generateSegments = () => {
        const segmentAngle = 360 / segments;
        const gap = 3; // Gap between segments in degrees
        const radius = 45;
        const innerRadius = 35;
        const centerX = 50;
        const centerY = 50;

        return Array.from({ length: segments }, (_, i) => {
            const startAngle = i * segmentAngle - 90 + gap / 2;
            const endAngle = startAngle + segmentAngle - gap;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            const x1 = centerX + innerRadius * Math.cos(startRad);
            const y1 = centerY + innerRadius * Math.sin(startRad);
            const x2 = centerX + radius * Math.cos(startRad);
            const y2 = centerY + radius * Math.sin(startRad);
            const x3 = centerX + radius * Math.cos(endRad);
            const y3 = centerY + radius * Math.sin(endRad);
            const x4 = centerX + innerRadius * Math.cos(endRad);
            const y4 = centerY + innerRadius * Math.sin(endRad);

            const pathD = `M ${x1} ${y1} L ${x2} ${y2} A ${radius} ${radius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1} Z`;

            const isFilled = i < filledSegments;
            const isCurrentSegment = i === filledSegments - 1;

            let fillColor = 'rgba(26, 26, 26, 0.5)'; // Empty segment
            if (isFilled) {
                // Gradient from phantom (low) to dragon (high)
                const progress = i / segments;
                if (progress < 0.33) {
                    fillColor = 'url(#phantomGradient)';
                } else if (progress < 0.66) {
                    fillColor = 'url(#mixedGradient)';
                } else {
                    fillColor = 'url(#dragonGradient)';
                }
            }

            return (
                <motion.path
                    key={i}
                    d={pathD}
                    fill={fillColor}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                    className={`${isCurrentSegment ? 'drop-shadow-lg' : ''}`}
                    style={{
                        filter: isCurrentSegment ? 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.6))' : undefined,
                    }}
                />
            );
        });
    };

    return (
        <div className="relative w-40 h-40">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Gradient definitions */}
                <defs>
                    <linearGradient id="phantomGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#A9B5D9" />
                        <stop offset="100%" stopColor="#2E004B" />
                    </linearGradient>
                    <linearGradient id="mixedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#A9B5D9" />
                        <stop offset="50%" stopColor="#D4AF37" />
                        <stop offset="100%" stopColor="#8B0000" />
                    </linearGradient>
                    <linearGradient id="dragonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#D4AF37" />
                        <stop offset="100%" stopColor="#FF4500" />
                    </linearGradient>
                    <linearGradient id="rrGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2E004B" />
                        <stop offset={`${rrProgress * 100}%`} stopColor="#D4AF37" />
                        <stop offset="100%" stopColor="#1A1A1A" />
                    </linearGradient>
                </defs>

                {/* Background glow */}
                <circle
                    cx="50"
                    cy="50"
                    r="30"
                    fill="none"
                    stroke="rgba(212, 175, 55, 0.1)"
                    strokeWidth="1"
                />

                {/* Fan segments */}
                {generateSegments()}

                {/* Inner RR progress ring */}
                <circle
                    cx="50"
                    cy="50"
                    r="28"
                    fill="none"
                    stroke="rgba(26, 26, 26, 0.8)"
                    strokeWidth="3"
                />
                <circle
                    cx="50"
                    cy="50"
                    r="28"
                    fill="none"
                    stroke="url(#rrGradient)"
                    strokeWidth="3"
                    strokeDasharray={`${rrProgress * 175.93} 175.93`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-sm font-bold text-dragon-300 tracking-wider">
                    {currentRank}
                </span>
                <span className="text-phantom-400 text-xs font-body">
                    {rr} RR
                </span>
            </div>
        </div>
    );
};

export default RankCircle;
