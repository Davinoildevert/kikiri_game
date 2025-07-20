"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, AlertTriangle } from "lucide-react";

interface BettingTimerProps {
  isActive: boolean;
  onTimeUp: () => void;
  onTimerStart: () => void;
  bettingDuration?: number; // en secondes, défaut 30s
  className?: string;
}

export default function BettingTimer({ 
  isActive, 
  onTimeUp, 
  onTimerStart,
  bettingDuration = 30,
  className = ""
}: BettingTimerProps) {
  const [timeLeft, setTimeLeft] = useState(bettingDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [showRienNeVaPlus, setShowRienNeVaPlus] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<HTMLAudioElement>();

  const startTimer = useCallback(() => {
    setIsRunning(true);
    setTimeLeft(bettingDuration);
    setShowRienNeVaPlus(false);
    onTimerStart();

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Temps écoulé
          setIsRunning(false);
          setShowRienNeVaPlus(true);
          
          // Afficher "Rien ne va plus" pendant 1.5 secondes puis lancer les dés immédiatement
          setTimeout(() => {
            setShowRienNeVaPlus(false);
            onTimeUp();
          }, 1500);
          
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [bettingDuration, onTimerStart, onTimeUp]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(bettingDuration);
    setShowRienNeVaPlus(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [bettingDuration]);

  // Démarrer le timer quand isActive devient true
  useEffect(() => {
    if (isActive && !isRunning) {
      startTimer();
    } else if (!isActive && isRunning) {
      resetTimer();
    }
  }, [isActive, isRunning, startTimer, resetTimer]);

  // Nettoyage à la destruction du composant
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Calcul des pourcentages pour les animations
  const progressPercentage = ((bettingDuration - timeLeft) / bettingDuration) * 100;
  const isUrgent = timeLeft <= 10;
  const isCritical = timeLeft <= 5;

  // Sons d'alerte (optionnel)
  useEffect(() => {
    if (isUrgent && timeLeft > 0 && isRunning) {
      // Ici on pourrait jouer un son d'alerte
      // audioRef.current?.play();
    }
  }, [timeLeft, isUrgent, isRunning]);

  if (showRienNeVaPlus) {
    return (
      <div className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center ${className}`}>
        <Card className="bg-red-600/90 border-red-400 shadow-2xl animate-pulse">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-white mx-auto mb-4 animate-bounce" />
            <h2 className="text-4xl font-bold text-white mb-2">RIEN NE VA PLUS !</h2>
            <p className="text-white/90 text-lg">Les paris sont fermés</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isActive && !isRunning) {
    return null;
  }

  return (
    <Card className={`bg-black/30 backdrop-blur-sm border-white/20 shadow-xl ${className} ${isUrgent ? 'animate-pulse' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className={`w-5 h-5 ${isCritical ? 'text-red-400 animate-bounce' : isUrgent ? 'text-orange-400' : 'text-white'}`} />
            <span className="text-white font-semibold">Temps de mise</span>
          </div>
          <span className={`text-2xl font-bold ${isCritical ? 'text-red-400' : isUrgent ? 'text-orange-400' : 'text-white'}`}>
            {timeLeft}s
          </span>
        </div>
        
        {/* Barre de progression */}
        <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-linear rounded-full ${
              isCritical 
                ? 'bg-gradient-to-r from-red-500 to-red-600' 
                : isUrgent 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500'
                  : 'bg-gradient-to-r from-green-500 to-yellow-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
          
          {/* Effet de brillance */}
          <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
        
        {/* Messages contextuels */}
        <div className="mt-2 text-center">
          {isCritical ? (
            <p className="text-red-400 text-sm font-bold animate-bounce">⚠️ DERNIÈRES SECONDES !</p>
          ) : isUrgent ? (
            <p className="text-orange-400 text-sm font-semibold">🔥 Dépêchez-vous !</p>
          ) : (
            <p className="text-white/70 text-sm">Placez vos mises...</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
