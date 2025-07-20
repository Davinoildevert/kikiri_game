"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Dice6 } from "lucide-react";

export default function GameRules() {
  return (
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
          <p>Sélectionnez un jeton (valeur de votre mise)</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
          <p>Cliquez plusieurs fois sur une zone (numéro ou combinaison) pour additionner vos mises</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
          <p>Lancez les 3 dés sous la coquille</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
          <p>Gagnez si votre numéro (ou l'un de vos numéros) sort sur au moins un des dés !</p>
        </div>

        <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-400/20">
          <p className="text-white font-semibold mb-2 flex items-center gap-2">
            <Dice6 className="w-4 h-4 text-yellow-400" />
            Système de gains&nbsp;:
          </p>
          <p className="text-yellow-400 text-xs">• Si votre numéro sort sur au moins un dé : vous gagnez 2× votre mise</p>
          <p className="text-yellow-400 text-xs">• Si votre numéro sort sur les 3 dés : vous gagnez 3× votre mise</p>
          <p className="text-yellow-400 text-xs">• Si aucun de vos numéros ne sort : vous perdez votre mise</p>
        </div>
      </CardContent>
    </Card>
  );
}
