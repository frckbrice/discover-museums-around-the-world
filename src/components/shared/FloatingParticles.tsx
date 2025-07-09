'use client';

import { useEffect, useState } from 'react';

interface Particle {
    id: number;
    width: number;
    height: number;
    top: number;
    left: number;
    animationDuration: number;
    animationDelay: number;
}

export default function FloatingParticles() {
    const [particles, setParticles] = useState<Particle[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        // Generate particles only on client side
        const generateParticles = () => {
            const newParticles = Array.from({ length: 12 }, (_, i) => ({
                id: i,
                width: Math.random() * 8 + 2,
                height: Math.random() * 8 + 2,
                top: Math.random() * 100,
                left: Math.random() * 100,
                animationDuration: Math.random() * 10 + 10,
                animationDelay: Math.random() * 5,
            }));
            setParticles(newParticles);
        };

        generateParticles();
    }, []);

    // Don't render anything on server side
    if (!isClient) {
        return null;
    }

    return (
        <div className="absolute inset-0 z-10 opacity-30">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute rounded-full bg-white"
                    style={{
                        width: `${particle.width}px`,
                        height: `${particle.height}px`,
                        top: `${particle.top}%`,
                        left: `${particle.left}%`,
                        animation: `float ${particle.animationDuration}s linear infinite`,
                        animationDelay: `${particle.animationDelay}s`,
                    }}
                />
            ))}
        </div>
    );
} 