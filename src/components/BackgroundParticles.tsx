"use client";

import { useEffect, useState } from "react";

interface BackgroundParticle {
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
}

export default function BackgroundParticles() {
  const [backgroundParticles, setBackgroundParticles] = useState<BackgroundParticle[]>([]);

  useEffect(() => {
    // Génère les particules une seule fois côté client
    const particles = Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 2}s`,
    }));
    setBackgroundParticles(particles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {backgroundParticles.map((p, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.animationDelay,
            animationDuration: p.animationDuration,
          }}
        />
      ))}
    </div>
  );
}
