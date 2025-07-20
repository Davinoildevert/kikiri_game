"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlayerSummary from "@/components/PlayerSummary";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LobbyPage() {
  const router = useRouter();

  useEffect(() => {
    // Si pas connecté, redirige vers login
    const email = localStorage.getItem("casino_current_user");
    if (!email) {
      router.replace("/login");
    }
  }, [router]);

  // Mock rooms data
  const [rooms, setRooms] = useState([
    { id: "room1", name: "Room VIP", players: 2, maxPlayers: 5, capital: 1000, isPrivate: false },
    { id: "room2", name: "Kikiri Party", players: 1, maxPlayers: 4, capital: 500, isPrivate: true },
    { id: "room3", name: "Débutants", players: 3, maxPlayers: 6, capital: 200, isPrivate: false },
  ]);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [form, setForm] = useState({
    name: "",
    capital: 100,
    maxPlayers: 4,
    isPrivate: false,
    password: ""
  });
  const [formError, setFormError] = useState("");

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.name.trim()) {
      setFormError("Nom de room requis");
      return;
    }
    if (form.capital < 10) {
      setFormError("Capital minimum : 10 €");
      return;
    }
    if (form.maxPlayers < 2 || form.maxPlayers > 10) {
      setFormError("Joueurs : entre 2 et 10");
      return;
    }
    setRooms([
      ...rooms,
      {
        id: `room${rooms.length + 1}`,
        name: form.name,
        players: 1,
        maxPlayers: form.maxPlayers,
        capital: form.capital,
        isPrivate: form.isPrivate,
      },
    ]);
    setShowCreate(false);
    setForm({ name: "", capital: 100, maxPlayers: 4, isPrivate: false, password: "" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="w-full flex justify-end p-6">
        <PlayerSummary />
      </div>
      <Card className="w-full max-w-2xl bg-black/40 border-white/10 shadow-2xl mt-4">
        <CardHeader>
          <CardTitle className="text-white text-2xl text-center">Lobby Casino Kikiri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 flex flex-col items-center">
          <div className="w-full flex flex-col md:flex-row gap-4 justify-between items-center">
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded-lg transition"
              onClick={() => setShowCreate(true)}
            >
              Créer une room
            </button>
            <button
              className="bg-blue-400 hover:bg-blue-500 text-black font-bold px-4 py-2 rounded-lg transition"
              onClick={() => setShowJoin(true)}
            >
              Rejoindre une room
            </button>
      {/* Modal rejoindre une room */}
      {showJoin && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-black text-xl font-bold hover:text-red-500"
              onClick={() => { setShowJoin(false); setJoinCode(""); setJoinError(""); }}
              aria-label="Fermer"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Rejoindre une room</h2>
            <form onSubmit={e => { e.preventDefault(); setJoinError("(Mock) Fonctionnalité à venir"); }} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Entrer le code de la room</label>
                <input
                  className="w-full rounded px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  type="text"
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value)}
                  placeholder="Code de la room (ex: room1)"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-400 hover:bg-blue-500 text-black font-bold py-2 rounded-lg mt-2"
              >
                Rejoindre
              </button>
              {joinError && <div className="text-red-500 text-sm text-center">{joinError}</div>}
            </form>
            <div className="mt-6">
              <div className="text-gray-700 mb-2 font-semibold">Ou choisir une room :</div>
              <div className="max-h-40 overflow-y-auto">
                {rooms.length === 0 ? (
                  <div className="text-gray-400 text-sm">Aucune room disponible.</div>
                ) : (
                  <ul className="space-y-2">
                    {rooms.map(room => (
                      <li key={room.id} className="flex items-center justify-between bg-gray-100 rounded px-3 py-2">
                        <span>{room.name} <span className="text-xs text-gray-500">({room.id})</span></span>
                        <button
                          className="bg-blue-400 hover:bg-blue-500 text-black font-bold px-3 py-1 rounded-lg text-xs"
                          onClick={() => setJoinError("(Mock) Fonctionnalité à venir")}
                        >
                          Rejoindre
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
          </div>
          <div className="w-full mt-6">
            <div className="text-white/80 text-lg mb-2">Rooms disponibles</div>
            <div className="bg-white/10 rounded-lg p-3 max-h-64 overflow-y-auto">
              {rooms.length === 0 ? (
                <div className="text-white/50 text-sm">Aucune room disponible pour l’instant.</div>
              ) : (
                <table className="w-full text-white text-sm">
                  <thead>
                    <tr>
                      <th className="text-left">Nom</th>
                      <th className="text-left">Joueurs</th>
                      <th className="text-left">Capital</th>
                      <th className="text-left">Accès</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room) => (
                      <tr key={room.id}>
                        <td>{room.name}</td>
                        <td>{room.players} / {room.maxPlayers}</td>
                        <td>{room.capital} €</td>
                        <td>{room.isPrivate ? "Privé" : "Public"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal création de room */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-black text-xl font-bold hover:text-red-500"
              onClick={() => setShowCreate(false)}
              aria-label="Fermer"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Créer une room</h2>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Nom de la room</label>
                <input
                  className="w-full rounded px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Nom de la room"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Capital de départ (€)</label>
                <input
                  className="w-full rounded px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  type="number"
                  min={10}
                  value={form.capital}
                  onChange={e => setForm(f => ({ ...f, capital: Number(e.target.value) }))}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Nombre max de joueurs</label>
                <input
                  className="w-full rounded px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  type="number"
                  min={2}
                  max={10}
                  value={form.maxPlayers}
                  onChange={e => setForm(f => ({ ...f, maxPlayers: Number(e.target.value) }))}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="isPrivate"
                  type="checkbox"
                  checked={form.isPrivate}
                  onChange={e => setForm(f => ({ ...f, isPrivate: e.target.checked }))}
                />
                <label htmlFor="isPrivate" className="text-gray-700">Room privée (mot de passe)</label>
              </div>
              {form.isPrivate && (
                <div>
                  <label className="block text-gray-700 mb-1">Mot de passe</label>
                  <input
                    className="w-full rounded px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    type="password"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Mot de passe de la room"
                    required
                  />
                </div>
              )}
              {formError && <div className="text-red-500 text-sm text-center">{formError}</div>}
              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 rounded-lg mt-2"
              >
                Créer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
