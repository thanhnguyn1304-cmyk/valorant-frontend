import { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
    onSearch: (riotId: string, tagline: string) => void;
    isLoading?: boolean;
    error?: string | null;
}

const HeroSection = ({ onSearch, isLoading = false, error = null }: HeroSectionProps) => {
    const [searchValue, setSearchValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const trimmed = searchValue.trim();
        if (!trimmed.includes('#')) {
            return;
        }

        const [riotId, tagline] = trimmed.split('#');
        if (riotId && tagline) {
            onSearch(riotId, tagline);
        }
    };

    const isValidFormat = searchValue.includes('#') && searchValue.split('#').length === 2 && searchValue.split('#')[1].length > 0;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface to-surface-100" />

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-val rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-val/50 rounded-full blur-[128px]" />
            </div>

            {/* Main content */}
            <div className="relative z-10 w-full max-w-2xl mx-auto text-center">
                {/* Logo and Title */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    {/* Valorant Logo */}
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
                            <path
                                d="M50 10L90 50L50 90L10 50L50 10Z"
                                fill="#FF4655"
                            />
                            <path
                                d="M50 25L75 50L50 75L25 50L50 25Z"
                                fill="#0E1015"
                            />
                        </svg>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                            <span className="text-white">VALORANT</span>
                            <span className="text-val"> STATS</span>
                        </h1>
                    </div>
                    <p className="text-text-secondary text-lg">
                        Check Detailed Valorant Stats and Leaderboards
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full"
                >
                    <div className="relative flex items-center bg-surface-100 rounded-lg border border-surface-300 overflow-hidden group focus-within:border-val transition-colors duration-200">
                        {/* Search Icon */}
                        <div className="flex items-center justify-center w-14 h-14 bg-val">
                            <Search className="w-6 h-6 text-white" />
                        </div>

                        {/* Input */}
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Find a Player, ie. player#NA1"
                            className="flex-1 h-14 px-4 bg-transparent text-text-primary placeholder-text-muted text-lg focus:outline-none"
                            disabled={isLoading}
                        />

                        {/* Submit Button */}
                        {isValidFormat && (
                            <motion.button
                                type="submit"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-10 px-6 mr-2 bg-val hover:bg-val-600 rounded-lg text-white font-semibold transition-colors duration-200 disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    </span>
                                ) : (
                                    'SEARCH'
                                )}
                            </motion.button>
                        )}
                    </div>
                </motion.form>

                {/* Error message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 px-4 py-3 bg-loss/10 border border-loss/20 rounded-lg"
                    >
                        <p className="text-loss text-sm">{error}</p>
                    </motion.div>
                )}

                {/* Helper text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-text-tertiary text-sm"
                >
                    Enter your Riot ID and Tagline separated by #
                </motion.p>
            </div>

            {/* Bottom Stats Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <div className="flex items-center gap-8 px-8 py-4 bg-surface-100/80 backdrop-blur-sm rounded-xl border border-surface-300">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-surface-300 rounded flex items-center justify-center">
                            <svg className="w-4 h-4 text-text-secondary" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-text-tertiary text-xs">Season Ends</p>
                            <p className="text-text-primary font-bold">Episode 10</p>
                        </div>
                    </div>
                    <div className="w-px h-10 bg-surface-300" />
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-surface-300 rounded flex items-center justify-center">
                            <svg className="w-4 h-4 text-text-secondary" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-text-tertiary text-xs">Players Tracked</p>
                            <p className="text-text-primary font-bold">138,000,000+</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default HeroSection;
