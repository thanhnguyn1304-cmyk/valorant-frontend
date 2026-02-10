import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Bot, ChevronDown, ChevronUp, Search, Database, PenTool } from 'lucide-react';

interface CoachReportProps {
    puuid: string;
}

const CoachReport = ({ puuid }: CoachReportProps) => {
    const [fullReport, setFullReport] = useState<string>('');
    const [displayedText, setDisplayedText] = useState<string>('');
    const [isTyping, setIsTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [hasReport, setHasReport] = useState(false);
    const [loadingStage, setLoadingStage] = useState(0); // 0: Idle, 1: Analyst, 2: Librarian, 3: Writer

    // Typewriter effect
    useEffect(() => {
        if (displayedText.length < fullReport.length) {
            setIsTyping(true);
            // Dynamic speed: punctuation pauses slightly longer
            const char = fullReport[displayedText.length];
            const delay = char === '.' || char === '\n' ? 30 : 10;

            const timeout = setTimeout(() => {
                setDisplayedText(fullReport.slice(0, displayedText.length + 1));
            }, delay);
            return () => clearTimeout(timeout);
        } else {
            setIsTyping(false);
            if (fullReport.length > 0) setLoadingStage(4); // Done
        }
    }, [fullReport, displayedText]);

    // Simulated Loading Stages
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isLoading && !fullReport) {
            setLoadingStage(1);
            interval = setInterval(() => {
                setLoadingStage(prev => (prev < 3 ? prev + 1 : prev));
            }, 800); // Advance stage every 800ms while waiting for first chunk
        }
        return () => clearInterval(interval);
    }, [isLoading, fullReport]);

    const generateReport = async () => {
        setIsLoading(true);
        setFullReport('');
        setDisplayedText('');
        setHasReport(true);
        setIsExpanded(true);
        setLoadingStage(0);

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/ai/report/${puuid}`);

            if (!response.ok) {
                throw new Error('Failed to generate report');
            }

            const reader = response.body?.getReader();
            if (!reader) return;

            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = decoder.decode(value);
                setFullReport(prev => prev + text);
                // Once we get data, we jump to "Drafting" step visually if not already
                setLoadingStage(3);
            }
        } catch (error) {
            console.error('Error generating report:', error);
            setFullReport('Failed to generate report. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to completely strip markdown symbols for clean headers
    const cleanHeader = (text: string) => {
        return text.replace(/[*#_]/g, '').trim();
    };

    // Helper to parse inline formatting (**bold** and *italic*)
    const parseInline = (text: string) => {
        // First split by bold
        const boldParts = text.split(/(\*\*.*?\*\*)/g);
        return boldParts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <span key={`b-${i}`} className="text-gray-100 font-bold drop-shadow-sm">{part.slice(2, -2)}</span>;
            }

            // Then split by italic (single asterisks)
            const italicParts = part.split(/(\*.*?\*)/g);
            return italicParts.map((subPart, j) => {
                if (subPart.startsWith('*') && subPart.endsWith('*') && subPart.length > 2) {
                    return <span key={`i-${i}-${j}`} className="italic text-primary-200">{subPart.slice(1, -1)}</span>;
                }
                return subPart; // Plain text
            });
        });
    };

    // Markdown Formatter
    const formatText = (text: string) => {
        return text.split('\n').map((line, i) => {
            const cleanLine = line.trim();

            // Horizontal Rule
            if (cleanLine === '---' || cleanLine === '***' || cleanLine === '___') {
                return <hr key={i} className="my-6 border-white/10" />;
            }

            // HEADERS: Detect # OR lines that are fully bolded (**Title**)
            // We use cleanHeader() to strip ALL * and # from these lines.
            const isMarkdownHeader = cleanLine.match(/^#{1,6}\s?/);
            const isBoldHeader = cleanLine.match(/^\*\*(.*)\*\*$/) && cleanLine.length < 80;

            if (isMarkdownHeader || isBoldHeader) {
                return (
                    <h3 key={i} className="text-xl font-bold text-primary-400 mt-8 mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary-400" />
                        {cleanHeader(cleanLine)}
                    </h3>
                );
            }

            // Bullet points (* or -)
            if (cleanLine.startsWith('* ') || cleanLine.startsWith('- ')) {
                const content = cleanLine.substring(2);
                return (
                    <div key={i} className="flex items-start gap-3 mb-2 pl-2 group">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary-400/50 flex-shrink-0 group-hover:bg-primary-400 transition-colors" />
                        <p className="flex-1 text-text-secondary leading-relaxed">
                            {parseInline(content)}
                        </p>
                    </div>
                );
            }

            // Normal text
            if (cleanLine === '') return <div key={i} className="h-4" />;

            return (
                <p key={i} className="text-text-secondary mb-3 whitespace-pre-wrap leading-relaxed">
                    {parseInline(line)}
                </p>
            );
        });
    };

    const getLoadingLabel = () => {
        switch (loadingStage) {
            case 1: return "Analyzing recent match performance...";
            case 2: return "Querying coaching strategy database...";
            case 3: return "Drafting personalized training plan...";
            default: return "Initializing AI Coach...";
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto mb-8 px-4 sm:px-6 lg:px-8">
            <motion.div
                layout
                className="bg-surface-100 rounded-xl border border-white/5 overflow-hidden shadow-lg backdrop-blur-sm"
            >
                {/* Header / Trigger */}
                <div className="p-4 flex items-center justify-between bg-surface-200/50 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-primary-500/20 to-primary-600/10 rounded-lg ring-1 ring-white/5">
                            <Bot className="w-6 h-6 text-primary-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                                AI Coach Analysis
                                {isTyping && <span className="flex w-2 h-2 rounded-full bg-primary-400 animate-pulse" />}
                            </h3>
                            <p className="text-xs text-text-tertiary">Personalized training plan & weakness detection</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {!hasReport && (
                            <button
                                onClick={generateReport}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 hover:scale-105 active:scale-95"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Generate Report
                                    </>
                                )}
                            </button>
                        )}

                        {hasReport && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={generateReport}
                                    title="Regenerate"
                                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-text-secondary hover:text-primary-400"
                                >
                                    <Sparkles className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-text-secondary"
                                >
                                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Report Content */}
                <AnimatePresence>
                    {(isExpanded || isLoading) && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-surface-100/30"
                        >
                            <div className="p-6 min-h-[150px]">
                                {/* Progress View */}
                                {isLoading && !displayedText && (
                                    <div className="flex flex-col items-center justify-center py-12 gap-6 w-full max-w-md mx-auto">
                                        <div className="relative w-full h-1 bg-surface-300 rounded-full overflow-hidden">
                                            <motion.div
                                                className="absolute top-0 left-0 h-full bg-primary-400"
                                                style={{ boxShadow: '0 0 10px rgba(255, 70, 85, 0.6)' }}
                                                initial={{ width: "0%" }}
                                                animate={{
                                                    width: loadingStage === 1 ? "30%" : loadingStage === 2 ? "60%" : "90%"
                                                }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        </div>

                                        <div className="flex justify-between w-full text-xs font-medium text-text-tertiary">
                                            <div className={`flex flex-col items-center gap-2 ${loadingStage >= 1 ? 'text-primary-400 transition-colors' : ''}`}>
                                                <Search className="w-5 h-5" />
                                                <span>Analyzing</span>
                                            </div>
                                            <div className={`flex flex-col items-center gap-2 ${loadingStage >= 2 ? 'text-primary-400 transition-colors' : ''}`}>
                                                <Database className="w-5 h-5" />
                                                <span>Searching</span>
                                            </div>
                                            <div className={`flex flex-col items-center gap-2 ${loadingStage >= 3 ? 'text-primary-400 transition-colors' : ''}`}>
                                                <PenTool className="w-5 h-5" />
                                                <span>Writing</span>
                                            </div>
                                        </div>

                                        <p className="text-sm text-text-secondary animate-pulse font-medium">
                                            {getLoadingLabel()}
                                        </p>
                                    </div>
                                )}

                                {/* Generated Text */}
                                {displayedText && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="prose prose-invert max-w-none"
                                    >
                                        <div className="leading-relaxed font-medium text-sm md:text-base">
                                            {formatText(displayedText)}
                                            {isTyping && (
                                                <span className="inline-block w-2 h-5 ml-1 bg-primary-400 animate-pulse align-middle" style={{ boxShadow: '0 0 8px rgba(255, 70, 85, 0.8)' }} />
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default CoachReport;
