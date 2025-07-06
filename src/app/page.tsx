"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import {
  Coins,
  Trophy,
  Gift,
  Dice6,
  Crown,
  Sparkles,
  Volume2,
  VolumeX,
  Star,
  Zap,
  TrendingUp,
  Users,
  UserPlus,
  Settings
} from "lucide-react";

interface Bet {
  zone: string;
  amount: number;
  multiplier: number;
}

interface Confetti {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
}

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
  const { toast } = useToast();

  const chipValues = [1, 5, 10, 25, 50, 100];

  // Zones basées sur l'image originale avec correspondance des sommes de dés (3-18)
  const gameZones = [
    { id: "1-4", label: "1-4", multiplier: 2.5, color: "red", diceRange: [3, 4, 5] },
    { id: "2-4", label: "2-4", multiplier: 2.5, color: "black", diceRange: [6, 7] },
    { id: "3-5", label: "3-5", multiplier: 2.5, color: "black", diceRange: [8, 9] },
    { id: "3-6", label: "3-6", multiplier: 2.5, color: "black", diceRange: [10, 11] },
    { id: "2-5", label: "2-5", multiplier: 3, color: "center", diceRange: [12, 13] },
    { id: "2-6", label: "2-6", multiplier: 2.5, color: "black", diceRange: [14, 15] },
    { id: "1-6", label: "1-6", multiplier: 2.5, color: "red", diceRange: [16, 17, 18] },
    { id: "red-dots", label: "Points Rouges", multiplier: 2, color: "red", diceRange: [3, 6, 9, 12, 15, 18] },
    { id: "black-dots", label: "Points Noirs", multiplier: 2, color: "black", diceRange: [4, 5, 7, 8, 10, 11, 13, 14, 16, 17] },
  ];

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
  }, [showConfetti]);

  const addPlayer = () => {
    const newPlayer: Player = {
      id: `player${allPlayers.length + 1}`,
      name: `Joueur ${allPlayers.length + 1}`,
      balance: 1000,
      bets: {},
      totalWins: 0,
      isOnline: true
    };
    setAllPlayers(prev => [...prev, newPlayer]);
    toast({
      title: "Nouveau joueur ajouté !",
      description: `${newPlayer.name} a rejoint la partie`,
    });
  };

  const placeBet = (zone: string) => {
    if (currentPlayer.balance >= selectedChip && !isSpinning) {
      const updatedPlayer = {
        ...currentPlayer,
        bets: {
          ...currentPlayer.bets,
          [zone]: (currentPlayer.bets[zone] || 0) + selectedChip
        },
        balance: currentPlayer.balance - selectedChip
      };

      setCurrentPlayer(updatedPlayer);
      setAllPlayers(prev => prev.map(p => p.id === currentPlayer.id ? updatedPlayer : p));

      toast({
        title: "Mise placée !",
        description: `${selectedChip} jetons sur ${zone} par ${currentPlayer.name}`,
      });
    } else if (currentPlayer.balance < selectedChip) {
      toast({
        title: "Solde insuffisant",
        description: "Pas assez de jetons pour cette mise",
        variant: "destructive"
      });
    }
  };

  const rollDice = (): DiceResult => {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const dice3 = Math.floor(Math.random() * 6) + 1;
    return {
      dice1,
      dice2,
      dice3,
      sum: dice1 + dice2 + dice3
    };
  };

  const spinGame = () => {
    const hasAnyBets = allPlayers.some(player => Object.keys(player.bets).length > 0);

    if (!hasAnyBets) {
      toast({
        title: "Aucune mise",
        description: "Au moins un joueur doit placer une mise",
        variant: "destructive"
      });
      return;
    }

    setIsSpinning(true);
    setLastWin(null);
    setWinningZone(null);
    setDiceResult(null);

    // Animation de 3 secondes avec dés
    setTimeout(() => {
      const diceRoll = rollDice();
      setDiceResult(diceRoll);

      // Trouver la zone gagnante basée sur la somme des dés
      const winningGameZone = gameZones.find(zone =>
        zone.diceRange.includes(diceRoll.sum)
      ) || gameZones[0];

      setWinningZone(winningGameZone.id);
      let totalWins = 0;
      const winningPlayers: string[] = [];

      // Traiter les gains pour tous les joueurs
      const updatedPlayers = allPlayers.map(player => {
        let playerWins = 0;
        const newBets = { ...player.bets };

        Object.entries(player.bets).forEach(([zone, amount]) => {
          if (zone === winningGameZone.id) {
            const winAmount = Math.floor(amount * winningGameZone.multiplier);
            playerWins += winAmount;
            totalWins += winAmount;
            winningPlayers.push(player.name);

            setWinHistory(prev => [
              { zone, amount: winAmount, player: player.name, timestamp: new Date() },
              ...prev.slice(0, 19)
            ]);
          }
        });

        return {
          ...player,
          balance: player.balance + playerWins,
          totalWins: player.totalWins + playerWins,
          bets: {} // Clear bets after round
        };
      });

      setAllPlayers(updatedPlayers);
      setCurrentPlayer(prev => updatedPlayers.find(p => p.id === prev.id) || prev);

      if (totalWins > 0) {
        if (totalWins >= 100) {
          setShowConfetti(true);
        }

        toast({
          title: "🎉 Félicitations !",
          description: `Dés: ${diceRoll.dice1}-${diceRoll.dice2}-${diceRoll.dice3} (somme: ${diceRoll.sum}). Gagnants: ${winningPlayers.join(', ')}!`,
        });
      } else {
        toast({
          title: "Dommage...",
          description: `Dés: ${diceRoll.dice1}-${diceRoll.dice2}-${diceRoll.dice3} (somme: ${diceRoll.sum}) → ${winningGameZone.label}. Tentez votre chance !`,
          variant: "destructive"
        });
      }

      setIsSpinning(false);
      setTimeout(() => setWinningZone(null), 5000);
    }, 3000);
  };

  const getTotalBet = (player?: Player) => {
    const targetPlayer = player || currentPlayer;
    return Object.values(targetPlayer.bets).reduce((sum, bet) => sum + bet, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Confettis */}
      {showConfetti && (
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
      )}

      {/* Particules de fond */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
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
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{currentPlayer.name.charAt(0)}</span>
              </div>
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

      <main className="max-w-7xl mx-auto p-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Plateau de jeu */}
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
                  <OriginalKikiriBoard
                    allPlayers={allPlayers}
                    placeBet={placeBet}
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
                            <div className="w-4 h-4 bg-white rounded animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-4 h-4 bg-white rounded animate-bounce" style={{ animationDelay: '100ms' }}></div>
                            <div className="w-4 h-4 bg-white rounded animate-bounce" style={{ animationDelay: '200ms' }}></div>
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
                disabled={isSpinning}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-lg disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/30"
              >
                {isSpinning ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Dés en cours...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Dice6 className="w-5 h-5" />
                    Lancer les 3 dés !
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Joueurs actifs */}
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

            {/* Historique des gains */}
            <Card className="bg-black/20 backdrop-blur-sm border-white/10 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Derniers Gains
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {winHistory.length > 0 ? (
                  winHistory.slice(0, 8).map((win, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0 animate-in slide-in-from-top duration-300">
                      <div>
                        <span className="text-white/80 text-sm">{win.zone}</span>
                        <p className="text-white/60 text-xs">{win.player}</p>
                      </div>
                      <Badge variant="secondary" className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-400/30">
                        <Coins className="w-3 h-3 mr-1" />
                        +{win.amount}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-white/50 text-sm text-center py-4">
                    Aucun gain récent
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Règles du jeu */}
            <Card className="bg-black/20 backdrop-blur-sm border-white/10 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Comment jouer ?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 text-sm space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                  <p>Sélectionnez un jeton</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                  <p>Cliquez sur une zone pour parier</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                  <p>Lancez les 3 dés sous la coquille</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
                  <p>Gagnez selon la somme des dés !</p>
                </div>

                <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-400/20">
                  <p className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Dice6 className="w-4 h-4 text-yellow-400" />
                    Système de dés:
                  </p>
                  <p className="text-yellow-400 text-xs">• Somme 3-18 détermine la zone</p>
                  <p className="text-yellow-400 text-xs">• Multiplicateurs: x2 à x3</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Toaster />
    </div>
  );
}

// Composant du plateau Kikiri original
function OriginalKikiriBoard({
  allPlayers,
  placeBet,
  isSpinning,
  selectedChip,
  winningZone,
  currentPlayer
}: {
  allPlayers: Player[];
  placeBet: (zone: string) => void;
  isSpinning: boolean;
  selectedChip: number;
  winningZone?: string | null;
  currentPlayer: Player;
}) {
  return (
    <div className="w-full max-w-5xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-lg p-6 shadow-2xl border-4 border-yellow-400/30">
      {/* Plateau basé sur l'image exacte */}
      <div className="grid grid-cols-4 gap-2 border-4 border-black bg-white">

        {/* Première ligne - Points */}
        <div className="border-2 border-black bg-gray-50 p-4 flex items-center justify-center relative min-h-[100px]">
          <div className="grid grid-cols-1 gap-2">
            <div className="w-4 h-4 bg-black rounded-full mx-auto"></div>
            <div className="w-4 h-4 bg-black rounded-full mx-auto"></div>
          </div>
          <BetOverlay
            zone="black-dots"
            bets={allPlayers.map(p => ({ player: p.name, amount: p.bets["black-dots"] || 0 }))}
            onClick={() => placeBet("black-dots")}
            isWinning={winningZone === "black-dots"}
            currentPlayer={currentPlayer}
          />
        </div>

        <div className="border-2 border-black bg-gray-50 p-4 flex items-center justify-center relative min-h-[100px]">
          <div className="grid grid-cols-1 gap-2">
            <div className="w-4 h-4 bg-black rounded-full mx-auto"></div>
            <div className="w-4 h-4 bg-black rounded-full mx-auto"></div>
            <div className="w-4 h-4 bg-black rounded-full mx-auto"></div>
          </div>
          <BetOverlay
            zone="black-dots"
            bets={allPlayers.map(p => ({ player: p.name, amount: p.bets["black-dots"] || 0 }))}
            onClick={() => placeBet("black-dots")}
            isWinning={winningZone === "black-dots"}
            currentPlayer={currentPlayer}
          />
        </div>

        <div className="border-2 border-black bg-gray-50 p-4 flex items-center justify-center relative min-h-[100px]">
          <div className="grid grid-cols-2 gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          </div>
          <BetOverlay
            zone="red-dots"
            bets={allPlayers.map(p => ({ player: p.name, amount: p.bets["red-dots"] || 0 }))}
            onClick={() => placeBet("red-dots")}
            isWinning={winningZone === "red-dots"}
            currentPlayer={currentPlayer}
          />
        </div>

        <div className="border-2 border-black bg-gray-50 p-4 flex items-center justify-center relative min-h-[100px]">
          <div className="grid grid-cols-2 gap-2">
            <div className="w-4 h-4 bg-black rounded-full"></div>
            <div className="w-4 h-4 bg-black rounded-full"></div>
            <div className="w-4 h-4 bg-black rounded-full"></div>
            <div className="w-4 h-4 bg-black rounded-full"></div>
          </div>
          <BetOverlay
            zone="black-dots"
            bets={allPlayers.map(p => ({ player: p.name, amount: p.bets["black-dots"] || 0 }))}
            onClick={() => placeBet("black-dots")}
            isWinning={winningZone === "black-dots"}
            currentPlayer={currentPlayer}
          />
        </div>

        {/* Deuxième ligne - Zone centrale avec X */}
        <div className="border-2 border-black bg-gray-50 p-4 flex items-center justify-center relative min-h-[100px]">
          <div className="w-8 h-8 bg-red-500 rounded-full shadow-lg"></div>
          <BetOverlay
            zone="red-dots"
            bets={allPlayers.map(p => ({ player: p.name, amount: p.bets["red-dots"] || 0 }))}
            onClick={() => placeBet("red-dots")}
            isWinning={winningZone === "red-dots"}
            currentPlayer={currentPlayer}
          />
        </div>

        {/* Zone avec diagonale gauche */}
        <div className="border-2 border-black bg-gray-50 relative min-h-[100px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-bold text-2xl text-black">2-4</span>
          </div>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="100" x2="100" y2="0" stroke="black" strokeWidth="3" />
          </svg>
          <BetOverlay
            zone="2-4"
            bets={allPlayers.map(p => ({ player: p.name, amount: p.bets["2-4"] || 0 }))}
            onClick={() => placeBet("2-4")}
            isWinning={winningZone === "2-4"}
            currentPlayer={currentPlayer}
          />
        </div>

        {/* Zone avec diagonale droite */}
        <div className="border-2 border-black bg-gray-50 relative min-h-[100px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-bold text-2xl text-black">3-5</span>
          </div>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="100" y2="100" stroke="black" strokeWidth="3" />
          </svg>
          <BetOverlay
            zone="3-5"
            bets={allPlayers.map(p => ({ player: p.name, amount: p.bets["3-5"] || 0 }))}
            onClick={() => placeBet("3-5")}
            isWinning={winningZone === "3-5"}
            currentPlayer={currentPlayer}
          />
        </div>

        <div className="border-2 border-black bg-gray-50 p-4 flex items-center justify-center relative min-h-[100px]">
          <div className="grid grid-cols-1 gap-2">
            <div className="w-4 h-4 bg-black rounded-full mx-auto"></div>
            <div className="w-4 h-4 bg-black rounded-full mx-auto"></div>
          </div>
          <BetOverlay
            zone="black-dots"
            bets={allPlayers.map(p => ({ player: p.name, amount: p.bets["black-dots"] || 0 }))}
            onClick={() => placeBet("black-dots")}
            isWinning={winningZone === "black-dots"}
            currentPlayer={currentPlayer}
          />
        </div>

        {/* Troisième ligne */}
        <div className="border-2 border-black bg-gray-50 flex items-center justify-center relative min-h-[100px]">
          <span className="font-bold text-2xl text-red-600">1-4</span>
          <BetOverlay
            zone="1-4"
            bets={allPlayers.map(p => ({ player: p.name, amount: p.bets["1-4"] || 0 }))}
            onClick={() => placeBet("1-4")}
            isWinning={winningZone === "1-4"}
            currentPlayer={currentPlayer}
          />
        </div>

        <div className="border-2 border-black bg-gray-50 flex items-center justify-center relative min-h-[100px]">
          <span className="font-bold text-2xl text-black">3-6</span>
          <BetOverlay
            zone="3-6"
            bets={allPlayers.map(p => ({ player: p.name, amount: p.bets["3-6"] || 0 }))}
            onClick={() => placeBet("3-6")}
            isWinning={winningZone === "3-6"}
            currentPlayer={currentPlayer}
          />
        </div>

        <div className="border-2 border-black bg-gray-50 flex items-center justify-center relative min-h-[100px]">
          <span className="font-bold text-2xl text-black">2-5</span>
          <BetOverlay
            zone="2-5"
            bets={allPlayers.map(p => ({ player: p.name, amount: p.bets["2-5"] || 0 }))}
            onClick={() => placeBet("2-5")}
            isWinning={winningZone === "2-5"}
            currentPlayer={currentPlayer}
          />
        </div>

        <div className="border-2 border-black bg-gray-50 p-4 flex items-center justify-center relative min-h-[100px]">
          <div className="grid grid-cols-2 gap-1">
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
          </div>
          <BetOverlay
            zone="black-dots"
            bets={allPlayers.map(p => ({ player: p.name, amount: p.bets["black-dots"] || 0 }))}
            onClick={() => placeBet("black-dots")}
            isWinning={winningZone === "black-dots"}
            currentPlayer={currentPlayer}
          />
        </div>

        {/* Quatrième ligne */}
        <div className="border-2 border-black bg-gray-50 flex items-center justify-center relative min-h-[100px]">
          <span className="font-bold text-2xl text-red-600">1-6</span>
          <BetOverlay
            zone="1-6"
            bets={allPlayers.map(p => ({ player: p.name, amount: p.bets["1-6"] || 0 }))}
            onClick={() => placeBet("1-6")}
            isWinning={winningZone === "1-6"}
            currentPlayer={currentPlayer}
          />
        </div>

        <div className="border-2 border-black bg-gray-50 flex items-center justify-center relative min-h-[100px]">
          <span className="font-bold text-2xl text-black">2-6</span>
          <BetOverlay
            zone="2-6"
            bets={allPlayers.map(p => ({ player: p.name, amount: p.bets["2-6"] || 0 }))}
            onClick={() => placeBet("2-6")}
            isWinning={winningZone === "2-6"}
            currentPlayer={currentPlayer}
          />
        </div>

        <div className="col-span-2 border-2 border-black bg-gray-50 p-4 flex items-center justify-center relative min-h-[100px]">
          <div className="grid grid-cols-3 gap-1">
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
          </div>
          <BetOverlay
            zone="black-dots"
            bets={allPlayers.map(p => ({ player: p.name, amount: p.bets["black-dots"] || 0 }))}
            onClick={() => placeBet("black-dots")}
            isWinning={winningZone === "black-dots"}
            currentPlayer={currentPlayer}
          />
        </div>
      </div>
    </div>
  );
}

// Overlay pour les mises multijoueurs
function BetOverlay({
  zone,
  bets,
  onClick,
  isWinning = false,
  currentPlayer
}: {
  zone: string;
  bets: Array<{ player: string; amount: number }>;
  onClick: () => void;
  isWinning?: boolean;
  currentPlayer: Player;
}) {
  const activeBets = bets.filter(bet => bet.amount > 0);
  const currentPlayerBet = currentPlayer.bets[zone] || 0;

  return (
    <div
      className={`absolute inset-0 cursor-pointer transition-all duration-300 group ${
        isWinning
          ? 'bg-green-400/40 animate-pulse'
          : 'hover:bg-yellow-400/20'
      }`}
      onClick={onClick}
    >
      {/* Afficher les mises de tous les joueurs */}
      {activeBets.length > 0 && (
        <div className="absolute top-1 right-1 flex flex-col gap-1">
          {activeBets.map((bet, index) => (
            <div
              key={index}
              className={`text-xs font-bold rounded px-2 py-1 shadow-lg ${
                bet.player === currentPlayer.name
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-500 text-white'
              }`}
            >
              {bet.player.charAt(0)}: {bet.amount}
            </div>
          ))}
        </div>
      )}

      {isWinning && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-lg shadow-lg animate-bounce">
            🎉 GAGNANT !
          </div>
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-bold px-3 py-1 rounded-lg shadow-lg">
          Parier ({currentPlayer.name})
        </div>
      </div>
    </div>
  );
}
