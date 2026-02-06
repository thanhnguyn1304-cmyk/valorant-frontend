import { useEffect, useState } from 'react';

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
    duration: number;
}

const Background = () => {
    const [mistParticles, setMistParticles] = useState<Particle[]>([]);
    const [emberParticles, setEmberParticles] = useState<Particle[]>([]);

    useEffect(() => {
        // Generate mist particles for left side
        const mist: Particle[] = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            x: Math.random() * 40, // Left 40% of screen
            y: Math.random() * 100,
            size: Math.random() * 100 + 50,
            delay: Math.random() * 5,
            duration: Math.random() * 10 + 15,
        }));
        setMistParticles(mist);

        // Generate ember particles for right side
        const embers: Particle[] = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: 60 + Math.random() * 40, // Right 40% of screen
            y: Math.random() * 100,
            size: Math.random() * 8 + 2,
            delay: Math.random() * 3,
            duration: Math.random() * 8 + 10,
        }));
        setEmberParticles(embers);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Base gradient */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at 20% 50%, rgba(46, 0, 75, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(139, 0, 0, 0.1) 0%, transparent 50%), #0A0A0A'
                }}
            />

            {/* Mist particles (Phantom - Left side) */}
            {mistParticles.map((particle) => (
                <div
                    key={`mist-${particle.id}`}
                    className="absolute rounded-full"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        background: 'radial-gradient(circle, rgba(169, 181, 217, 0.15) 0%, transparent 70%)',
                        animation: `mistFloat ${particle.duration}s ease-in-out infinite`,
                        animationDelay: `${particle.delay}s`,
                    }}
                />
            ))}

            {/* Ember particles (Dragon - Right side) */}
            {emberParticles.map((particle) => (
                <div
                    key={`ember-${particle.id}`}
                    className="absolute rounded-full"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        background: 'radial-gradient(circle, rgba(255, 69, 0, 0.6) 0%, rgba(212, 175, 55, 0.3) 50%, transparent 70%)',
                        animation: `emberFloat ${particle.duration}s ease-in-out infinite`,
                        animationDelay: `${particle.delay}s`,
                        boxShadow: '0 0 10px rgba(255, 69, 0, 0.3)',
                    }}
                />
            ))}

            {/* Subtle noise texture overlay */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />
        </div>
    );
};

export default Background;
