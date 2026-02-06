import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtext?: string;
    type: 'offensive' | 'utility' | 'neutral';
    icon?: LucideIcon;
    trend?: 'up' | 'down' | 'neutral';
}

const StatCard = ({ title, value, subtext, type, icon: Icon, trend }: StatCardProps) => {
    const isOffensive = type === 'offensive';
    const cornerClass = isOffensive ? 'gold-corner' : type === 'utility' ? 'silver-corner' : '';
    const glowClass = isOffensive ? 'hover:shadow-dragon-glow' : 'hover:shadow-phantom-glow';
    const accentColor = isOffensive ? 'text-dragon-300' : 'text-phantom-300';
    const iconBg = isOffensive ? 'bg-dragon-700/20' : 'bg-phantom-600/20';

    const getTrendIndicator = () => {
        if (!trend || trend === 'neutral') return null;
        const isUp = trend === 'up';
        return (
            <span className={`text-sm font-bold ${isUp ? 'text-dragon-300' : 'text-phantom-400'}`}>
                {isUp ? '↑' : '↓'}
            </span>
        );
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`
        shine-container glass-card rounded-xl p-5 
        ${cornerClass} ${glowClass}
        transition-all duration-300
      `}
        >
            {/* Header with icon and title */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-sm uppercase tracking-wider text-phantom-400">
                    {title}
                </h3>
                {Icon && (
                    <div className={`p-2 rounded-lg ${iconBg}`}>
                        <Icon className={`w-4 h-4 ${accentColor}`} strokeWidth={2} />
                    </div>
                )}
            </div>

            {/* Main value */}
            <div className="flex items-end gap-2">
                <span className={`font-display text-4xl font-bold ${accentColor}`}>
                    {value}
                </span>
                {getTrendIndicator()}
            </div>

            {/* Subtext */}
            {subtext && (
                <p className="mt-2 text-sm text-phantom-500 font-body">
                    {subtext}
                </p>
            )}

            {/* Bottom accent line */}
            <div
                className={`mt-4 h-0.5 rounded-full ${isOffensive
                    ? 'bg-gradient-to-r from-dragon-700 via-dragon-300 to-transparent'
                    : 'bg-gradient-to-r from-phantom-600 via-phantom-300 to-transparent'
                    }`}
            />
        </motion.div>
    );
};

export default StatCard;
