"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Users } from "lucide-react";

interface Player {
  id: string;
  name: string;
  balance: number;
  bets: Record<string, number>;
  totalWins: number;
  isOnline: boolean;
}

interface PlayersPanelProps {
  allPlayers: Player[];
  currentPlayer: Player;
  setCurrentPlayer: (player: Player) => void;
  getTotalBet: (player?: Player) => number;
}

export default function PlayersPanel({
  allPlayers,
  currentPlayer,
  setCurrentPlayer,
  getTotalBet,
}: PlayersPanelProps) {
  return (
    <Card className="bg-black/20 backdrop-blur-sm border-white/10 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          Joueurs ({allPlayers.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {allPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`p-3 rounded-lg border transition-all cursor-pointer ${
              player.id === currentPlayer.id
                ? 'bg-blue-500/20 border-blue-400/50'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
            onClick={() => setCurrentPlayer(player)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  player.id === currentPlayer.id ? 'bg-blue-500' : 'bg-gray-500'
                }`}>
                  <span className="text-white text-xs font-bold">{player.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{player.name}</p>
                  <div className="flex items-center gap-1">
                    <Coins className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-400 text-xs">{player.balance}</span>
                  </div>
                </div>
              </div>
              {getTotalBet(player) > 0 && (
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                  Mise: {getTotalBet(player)}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
