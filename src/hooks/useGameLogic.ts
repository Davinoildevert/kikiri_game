"use client";

import { useToast } from "@/hooks/use-toast";

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

interface WinHistoryEntry {
  zone: string;
  amount: number;
  player: string;
  timestamp: Date;
}

export function useGameLogic(
  allPlayers: Player[],
  setAllPlayers: (players: Player[]) => void,
  currentPlayer: Player,
  setCurrentPlayer: (player: Player) => void,
  setWinHistory: (updater: (history: WinHistoryEntry[]) => WinHistoryEntry[]) => void,
  setWinningZone: (zone: string | null) => void,
  setShowConfetti: (show: boolean) => void,
  onRoundEnd?: () => void
) {
  const { toast } = useToast();

  const addPlayer = () => {
    const newPlayer: Player = {
      id: `player${allPlayers.length + 1}`,
      name: `Joueur ${allPlayers.length + 1}`,
      balance: 1000,
      bets: {},
      totalWins: 0,
      isOnline: true
    };
    setAllPlayers([...allPlayers, newPlayer]);
    toast({
      title: "Nouveau joueur ajouté !",
      description: `${newPlayer.name} a rejoint la partie`,
    });
  };

  const placeBet = (zone: string, selectedChip: number) => {
    if (currentPlayer.balance >= selectedChip) {
      const updatedBets: Record<string, number> = {};
      // Si le joueur clique sur la même zone, on additionne
      if (Object.keys(currentPlayer.bets)[0] === zone) {
        updatedBets[zone] = (currentPlayer.bets[zone] || 0) + selectedChip;
      } else {
        // Sinon, nouvelle zone, on efface l'ancienne mise
        updatedBets[zone] = selectedChip;
      }
      // Calcul du remboursement éventuel si on change de zone
      const oldZone = Object.keys(currentPlayer.bets)[0];
      const oldAmount = oldZone && oldZone !== zone ? (currentPlayer.bets[oldZone] || 0) : 0;
      const updatedPlayer = {
        ...currentPlayer,
        bets: updatedBets,
        balance: currentPlayer.balance - selectedChip + oldAmount
      };
      setCurrentPlayer(updatedPlayer);
      setAllPlayers(allPlayers.map(p => p.id === currentPlayer.id ? updatedPlayer : p));
      toast({
        title: "Mise placée !",
        description: `${Object.values(updatedBets)[0]} jetons sur ${zone} par ${currentPlayer.name}`,
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

interface LastWin {
  zone: string;
  amount: number;
  player: string;
}

  const spinGame = (
    setIsSpinning: (spinning: boolean) => void,
    setLastWin: (win: LastWin | null) => void,
    setDiceResult: (result: DiceResult | null) => void
  ) => {
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

    setTimeout(() => {
      const diceRoll = rollDice();
      setDiceResult(diceRoll);
      const diceValues = [diceRoll.dice1, diceRoll.dice2, diceRoll.dice3];
      let totalWins = 0;
      const winningPlayers: string[] = [];
      let winningZoneId: string | null = null;

      // Traiter les gains pour tous les joueurs
      const updatedPlayers = allPlayers.map(player => {
        let playerWins = 0;
        let winAmount = 0;
        const zone = Object.keys(player.bets)[0];
        const amount = player.bets[zone] || 0;

        if (!zone || amount === 0) return { ...player, bets: {} };

        // Gérer les zones multiples (ex: "2-5")
        const zoneNumbers = zone.split('-').map(z => z.replace(/\D/g, '')).filter(Boolean);
        
        // Si la zone n'est pas un numéro simple ou double, ignorer
        if (zoneNumbers.length === 0) return { ...player, bets: {} };

        // Vérifier si au moins un des numéros de la zone sort
        const matchCount = zoneNumbers.reduce((acc, num) => acc + diceValues.filter(d => d === Number(num)).length, 0);

        if (matchCount > 0) {
          // Gain x3 si triple, sinon x2
          if (matchCount === 3 && zoneNumbers.length === 1) {
            winAmount = amount * 3;
          } else if (matchCount === 3 && zoneNumbers.length > 1) {
            winAmount = amount * 3;
          } else {
            winAmount = amount * 2;
          }
          playerWins += winAmount;
          totalWins += winAmount;
          winningPlayers.push(player.name);
          winningZoneId = zone;
          setWinHistory(prev => [
            { zone, amount: winAmount, player: player.name, timestamp: new Date() },
            ...prev.slice(0, 19)
          ]);
        }

        return {
          ...player,
          balance: player.balance + playerWins,
          totalWins: player.totalWins + playerWins,
          bets: {} // Clear bets after round
        };
      });

      setAllPlayers(updatedPlayers);
      setCurrentPlayer(updatedPlayers.find(p => p.id === currentPlayer.id) || currentPlayer);
      setWinningZone(winningZoneId);

      if (totalWins > 0) {
        if (totalWins >= 100) setShowConfetti(true);
        toast({
          title: "🎉 Félicitations !",
          description: `Dés: ${diceRoll.dice1}-${diceRoll.dice2}-${diceRoll.dice3}. Gagnants: ${winningPlayers.join(', ')}!`,
        });
      } else {
        toast({
          title: "Dommage...",
          description: `Dés: ${diceRoll.dice1}-${diceRoll.dice2}-${diceRoll.dice3}. Aucun gagnant cette fois !`,
          variant: "destructive"
        });
      }
      setIsSpinning(false);
      setTimeout(() => setWinningZone(null), 5000);
      
      // Appeler le callback de fin de manche si fourni
      if (onRoundEnd) {
        onRoundEnd();
      }
    }, 3000);
  };

  const getTotalBet = (player?: Player) => {
    const targetPlayer = player || currentPlayer;
    return Object.values(targetPlayer.bets).reduce((sum, bet) => sum + bet, 0);
  };

  return {
    addPlayer,
    placeBet,
    spinGame,
    getTotalBet,
    toast
  };
}
