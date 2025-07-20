"use client";

import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import GameHeader from "@/components/GameHeader";
import GameBoard from "@/components/GameBoard";
import PlayersPanel from "@/components/PlayersPanel";
import WinHistory from "@/components/WinHistory";
import GameRules from "@/components/GameRules";
import ConfettiEffect from "@/components/ConfettiEffect";
import BackgroundParticles from "@/components/BackgroundParticles";
import { useGameLogic } from "@/hooks/useGameLogic";

interface Player {
  id: string;
  name: string;
  balance: number;
  bets: Record<string, number>;
  totalWins: number;
  isOnline: boolean;
}

interface Confetti {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
}

interface DiceResult {
  dice1: number;
  dice2: number;
  dice3: number;
  sum: number;
}

export default function Home() {
  const [currentPlayer, setCurrentPlayer] = useState<Player>({
    id: 'player1',
    name: 'Joueur 1',
    balance: 1000,
    bets: {},
    totalWins: 0,
    isOnline: true
  });

  const [allPlayers, setAllPlayers] = useState<Player[]>([
    {
      id: 'player1',
      name: 'Joueur 1',
      balance: 1000,
      bets: {},
      totalWins: 0,
      isOnline: true
    }
  ]);

  const [selectedChip, setSelectedChip] = useState(10);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWin, setLastWin] = useState<{ zone: string; amount: number; player: string } | null>(null);
  const [winHistory, setWinHistory] = useState<Array<{ zone: string; amount: number; player: string; timestamp: Date }>>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [winningZone, setWinningZone] = useState<string | null>(null);
  const [diceResult, setDiceResult] = useState<DiceResult | null>(null);
  const [gameRoom, setGameRoom] = useState<string>('SALON-1');

  const chipValues = [1, 5, 10, 25, 50, 100];

  const { addPlayer, placeBet, spinGame, getTotalBet, toast } = useGameLogic(
    allPlayers,
    setAllPlayers,
    currentPlayer,
    setCurrentPlayer,
    setWinHistory,
    setWinningZone,
    setShowConfetti
  );

  const handlePlaceBet = (zone: string) => {
    if (!isSpinning) {
      placeBet(zone, selectedChip);
    }
  };

  const handleSpinGame = () => {
    spinGame(setIsSpinning, setLastWin, setDiceResult);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Confettis */}
      <ConfettiEffect 
        showConfetti={showConfetti}
        confetti={confetti}
        setShowConfetti={setShowConfetti}
        setConfetti={setConfetti}
      />

      {/* Particules de fond */}
      <BackgroundParticles />

      {/* Header */}
      <GameHeader
        currentPlayer={currentPlayer}
        gameRoom={gameRoom}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        addPlayer={addPlayer}
        toast={toast}
        setCurrentPlayer={setCurrentPlayer}
        setAllPlayers={setAllPlayers}
      />

      <main className="max-w-7xl mx-auto p-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Plateau de jeu */}
          <GameBoard
            gameRoom={gameRoom}
            isSpinning={isSpinning}
            diceResult={diceResult}
            placeBet={handlePlaceBet}
            allPlayers={allPlayers}
            selectedChip={selectedChip}
            winningZone={winningZone}
            currentPlayer={currentPlayer}
            chipValues={chipValues}
            setSelectedChip={setSelectedChip}
            spinGame={handleSpinGame}
            getTotalBet={getTotalBet}
          />

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Joueurs actifs */}
            <PlayersPanel
              allPlayers={allPlayers}
              currentPlayer={currentPlayer}
              setCurrentPlayer={setCurrentPlayer}
              getTotalBet={getTotalBet}
            />

            {/* Historique des gains */}
            <WinHistory winHistory={winHistory} />

            {/* Règles du jeu */}
            <GameRules />
          </div>
        </div>
      </main>

      <Toaster />
    </div>
  );
}
