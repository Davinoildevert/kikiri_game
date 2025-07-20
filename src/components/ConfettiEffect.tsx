"use client";

import { useEffect } from "react";

interface Confetti {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
}

interface ConfettiEffectProps {
  showConfetti: boolean;
  confetti: Confetti[];
  setShowConfetti: (show: boolean) => void;
  setConfetti: (confetti: Confetti[]) => void;
}

export default function ConfettiEffect({
  showConfetti,
  confetti,
  setShowConfetti,
  setConfetti,
}: ConfettiEffectProps) {
  // Animation des confettis
  useEffect(() => {
    if (showConfetti) {
      const newConfetti: Confetti[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'][Math.floor(Math.random() * 6)],
        size: Math.random() * 8 + 4,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: Math.random() * 3 + 2
        }
      }));
      setConfetti(newConfetti);

      const interval = setInterval(() => {
        setConfetti(prev => prev.map(c => ({
          ...c,
          x: c.x + c.velocity.x,
          y: c.y + c.velocity.y,
          velocity: {
            ...c.velocity,
            y: c.velocity.y + 0.1
          }
        })).filter(c => c.y < window.innerHeight + 10));
      }, 16);

      const timeout = setTimeout(() => {
        setShowConfetti(false);
        setConfetti([]);
      }, 4000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [showConfetti, setShowConfetti, setConfetti]);

  if (!showConfetti) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confetti.map(c => (
        <div
          key={c.id}
          className="absolute rounded-full"
          style={{
            left: c.x,
            top: c.y,
            width: c.size,
            height: c.size,
            backgroundColor: c.color,
            transform: `rotate(${c.x * 0.1}deg)`
          }}
        />
      ))}
    </div>
  );
}
