"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Coins,
  Crown,
  Volume2,
  VolumeX,
  Gift,
  Sparkles,
  Users,
  UserPlus,
  Star,
  Zap,
} from "lucide-react";

interface Player {
  id: string;
  name: string;
  balance: number;
  bets: Record<string, number>;
  totalWins: number;
  isOnline: boolean;
  avatar?: string;
}

interface GameHeaderProps {
  currentPlayer: Player;
  gameRoom: string;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  addPlayer: () => void;
  toast: any;
  setCurrentPlayer: (player: Player) => void;
  setAllPlayers: (updater: (players: Player[]) => Player[]) => void;
}

export default function GameHeader({
  currentPlayer,
  gameRoom,
  soundEnabled,
  setSoundEnabled,
  addPlayer,
  toast,
  setCurrentPlayer,
  setAllPlayers,
}: GameHeaderProps) {
  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4 relative z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/25">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Casino Kikiri</h1>
            <div className="flex items-center gap-2">
              <p className="text-white/70 text-sm">Jeu traditionnel moderne</p>
              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-400/30">
                <Users className="w-3 h-3 mr-1" />
                {gameRoom}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Joueur actuel */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-blue-400/30">
            {currentPlayer.avatar ? (
              <img src={currentPlayer.avatar} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-yellow-400 bg-white" />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{currentPlayer.name.charAt(0)}</span>
              </div>
            )}
            <div>
              <p className="text-white text-sm font-semibold">{currentPlayer.name}</p>
              <div className="flex items-center gap-1">
                <Coins className="w-3 h-3 text-yellow-400" />
                <span className="text-yellow-400 text-xs font-bold">{currentPlayer.balance.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={addPlayer}
            variant="outline"
            size="sm"
            className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30 text-white hover:bg-green-500/30"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Ajouter Joueur
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-white hover:bg-white/10 transition-all duration-300"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30 text-white hover:bg-purple-500/30 transition-all duration-300">
                <Gift className="w-4 h-4 mr-2" />
                Cadeaux
                <Sparkles className="w-4 h-4 ml-2 text-yellow-400" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900/95 border-gray-700 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Cadeaux Quotidiens
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400" />
                          Bonus quotidien
                        </p>
                        <p className="text-white/80 text-sm">100 jetons gratuits</p>
                      </div>
                      <Button
                        onClick={() => {
                          const updatedPlayer = { ...currentPlayer, balance: currentPlayer.balance + 100 };
                          setCurrentPlayer(updatedPlayer);
                          setAllPlayers(prev => prev.map(p => p.id === currentPlayer.id ? updatedPlayer : p));
                          toast({
                            title: "🎁 Cadeau réclamé !",
                            description: "+100 jetons ajoutés à votre solde"
                          });
                        }}
                        className="bg-white text-purple-600 hover:bg-white/90 transition-all duration-300 shadow-lg"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Réclamer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
