"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dice6, Coins, Clock } from "lucide-react";
import PlateauKikiri from "@/components/PlateauKikiri";

interface Player {
  id: string;
  name: string;
  balance: number;
  bets: Record<string, number>;
  totalWins: number;
  isOnline: boolean;
}

interface DiceResult {
  dice1: number;
  dice2: number;
  dice3: number;
  sum: number;
}

interface GameBoardProps {
  gameRoom: string;
  isSpinning: boolean;
  diceResult: DiceResult | null;
  placeBet: (zone: string) => void;
  allPlayers: Player[];
  selectedChip: number;
  winningZone: string | null;
  currentPlayer: Player;
  chipValues: number[];
  setSelectedChip: (value: number) => void;
  spinGame: () => void;
  getTotalBet: () => number;
  canPlaceBets: boolean;
  bettingPhase: boolean;
}

export default function GameBoard({
  gameRoom,
  isSpinning,
  diceResult,
  placeBet,
  allPlayers,
  selectedChip,
  winningZone,
  currentPlayer,
  chipValues,
  setSelectedChip,
  spinGame,
  getTotalBet,
  canPlaceBets,
  bettingPhase,
}: GameBoardProps) {
  return (
    <div className="lg:col-span-3">
      <Card className="bg-black/20 backdrop-blur-sm border-white/10 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Dice6 className="w-6 h-6 text-yellow-400" />
            Plateau Kikiri - {gameRoom}
            {isSpinning && (
              <div className="flex items-center gap-2 ml-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-semibold">Lancement des dés...</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Message informatif quand les mises sont désactivées */}
            {!canPlaceBets && !isSpinning && !bettingPhase && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center z-20">
                <div className="text-center p-6 bg-white/10 rounded-lg border border-white/20">
                  <Clock className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                  <p className="text-white text-lg font-semibold mb-2">En attente de la prochaine manche</p>
                  <p className="text-white/70 text-sm">Cliquez sur "Démarrer une nouvelle manche" pour commencer à miser</p>
                </div>
              </div>
            )}
            
            <PlateauKikiri
              onZoneClick={canPlaceBets ? placeBet : undefined}
              allPlayers={allPlayers}
              isSpinning={isSpinning}
              selectedChip={selectedChip}
              winningZone={winningZone}
              currentPlayer={currentPlayer}
            />
          </div>

          {/* Animation de la coquille avec dés */}
          {isSpinning && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-20">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce mx-auto mb-4 flex items-center justify-center shadow-lg shadow-yellow-500/50 relative overflow-hidden">
                  <span className="text-4xl animate-spin">🐚</span>
                  {/* Dés qui bougent sous la coquille */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <div className="flex gap-1">
                      <div className="w-4 h-4 bg-white rounded animate-bounce"></div>
                      <div className="w-4 h-4 bg-white rounded animate-bounce animation-delay-100"></div>
                      <div className="w-4 h-4 bg-white rounded animate-bounce animation-delay-200"></div>
                    </div>
                  </div>
                </div>
                <p className="text-white text-xl font-bold animate-pulse">
                  Les 3 dés roulent sous la coquille...
                </p>
                {diceResult && (
                  <div className="mt-4 p-4 bg-white/10 rounded-lg">
                    <p className="text-white font-bold mb-2">Résultat des dés:</p>
                    <div className="flex justify-center gap-4 mb-2">
                      <div className="w-12 h-12 bg-white rounded flex items-center justify-center text-black font-bold text-xl">
                        {diceResult.dice1}
                      </div>
                      <div className="w-12 h-12 bg-white rounded flex items-center justify-center text-black font-bold text-xl">
                        {diceResult.dice2}
                      </div>
                      <div className="w-12 h-12 bg-white rounded flex items-center justify-center text-black font-bold text-xl">
                        {diceResult.dice3}
                      </div>
                    </div>
                    <p className="text-yellow-400 font-bold">Somme: {diceResult.sum}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contrôles de jeu */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <div className="flex gap-2">
          {chipValues.map(value => (
            <Button
              key={value}
              variant={selectedChip === value ? "default" : "outline"}
              onClick={() => setSelectedChip(value)}
              className={`
                w-14 h-14 rounded-full font-bold text-sm transition-all duration-300 transform hover:scale-110
                ${selectedChip === value
                  ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black border-yellow-400 shadow-lg shadow-yellow-400/50 scale-110'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40'
                }
              `}
            >
              {value}
            </Button>
          ))}
        </div>

        <Button
          onClick={spinGame}
          disabled={isSpinning || bettingPhase}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-lg disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/30"
        >
          {isSpinning ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Dés en cours...
            </div>
          ) : bettingPhase ? (
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Paris en cours...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Dice6 className="w-5 h-5" />
              Démarrer une nouvelle manche
            </div>
          )}
        </Button>

        {getTotalBet() > 0 && (
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2 border border-blue-400/30">
            <span className="text-white/70">Votre mise:</span>
            <span className="text-white font-bold text-lg">{getTotalBet()}</span>
            <Coins className="w-4 h-4 text-yellow-400" />
          </div>
        )}
      </div>
    </div>
  );
}
