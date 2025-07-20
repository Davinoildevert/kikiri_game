"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Coins } from "lucide-react";

interface WinHistoryProps {
  winHistory: Array<{ zone: string; amount: number; player: string; timestamp: Date }>;
}

export default function WinHistory({ winHistory }: WinHistoryProps) {
  return (
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
  );
}
