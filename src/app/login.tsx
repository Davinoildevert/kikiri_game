"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSocket } from "@/lib/socket";
import { useRouter } from "next/navigation";

export default function Login({ onLogin }: { onLogin?: (pseudo: string, room: string, isNewRoom: boolean) => void }) {
  const [pseudo, setPseudo] = useState("");
  const [room, setRoom] = useState("");
  const [startingBalance, setStartingBalance] = useState(1000);
  const [isNewRoom, setIsNewRoom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = () => {
    setLoading(true);
    setError(null);
    const socket = getSocket();
    // Attendre que socket.id soit bien défini avant de continuer
    function proceed() {
      if (!socket.id) {
        setTimeout(proceed, 50);
        return;
      }
      const player = { id: socket.id, name: pseudo, socketId: socket.id, balance: 1000 };
      if (isNewRoom) {
        socket.emit("createRoom", { name: room }, (res: any) => {
          if (res && res.code) {
            socket.emit("joinRoom", { code: res.code, player }, (joinRes: any) => {
              setLoading(false);
              if (joinRes && joinRes.success) {
                localStorage.setItem("playerId", socket.id || "");
                localStorage.setItem("playerName", pseudo);
                onLogin && onLogin(pseudo, res.code, true);
                router.push(`/room/${res.code}`);
              } else {
                setError(joinRes?.error || "Erreur lors de la connexion au salon");
              }
            });
          } else {
            setLoading(false);
            setError("Erreur lors de la création du salon");
          }
        });
      } else {
        socket.emit("joinRoom", { code: room, player }, (joinRes: any) => {
          setLoading(false);
          if (joinRes && joinRes.success) {
            localStorage.setItem("playerId", socket.id || "");
            localStorage.setItem("playerName", pseudo);
            onLogin && onLogin(pseudo, room, false);
            router.push(`/room/${room}`);
          } else {
            setError(joinRes?.error || "Salon introuvable ou plein");
          }
        });
      }
    }
    socket.connect();
    proceed();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Card className="w-full max-w-md bg-black/40 border-white/10 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white text-2xl text-center">Casino Kikiri – Connexion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-white/80 mb-1">Pseudo</label>
            <input
              className="w-full rounded px-3 py-2 bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              type="text"
              value={pseudo}
              onChange={e => setPseudo(e.target.value)}
              placeholder="Entrez votre pseudo"
              maxLength={16}
            />
          </div>
          <div>
            <label className="block text-white/80 mb-1">Salon</label>
            <input
              className="w-full rounded px-3 py-2 bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              type="text"
              value={room}
              onChange={e => setRoom(e.target.value.toUpperCase())}
              placeholder="Code du salon ou nom (ex: ABCD)"
              maxLength={12}
            />
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="newRoom" checked={isNewRoom} onChange={e => setIsNewRoom(e.target.checked)} />
              <label htmlFor="newRoom" className="text-white/70 text-xs">Créer un nouveau salon</label>
            </div>
          </div>
          {error && <div className="text-red-400 text-sm text-center">{error}</div>}
          <Button
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-2 rounded-lg mt-4"
            disabled={!pseudo || !room || loading}
            onClick={handleLogin}
          >
            {loading ? "Connexion..." : isNewRoom ? "Créer le salon et rejoindre" : "Rejoindre le salon"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
