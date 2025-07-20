"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type CasinoUser = {
  email: string;
  password: string;
  pseudo: string;
  avatar: string;
  balance: number;
  createdAt: number;
};

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Avatar auto-généré (par défaut)
  const defaultAvatar = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(pseudo || "casino")}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // Validation simple
    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      setError("Email invalide");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Mot de passe trop court (min 6 caractères)");
      setLoading(false);
      return;
    }
    if (!pseudo.trim()) {
      setError("Pseudo requis");
      setLoading(false);
      return;
    }
    // Simule l'inscription (mock localStorage)
    const users = JSON.parse(localStorage.getItem("casino_users") || "{}") as Record<string, CasinoUser>;
    if (users[email]) {
      setError("Email déjà utilisé");
      setLoading(false);
      return;
    }
    users[email] = {
      email,
      password,
      pseudo,
      avatar: avatar || defaultAvatar,
      balance: 1000,
      createdAt: Date.now(),
    };
    localStorage.setItem("casino_users", JSON.stringify(users));
    // Connecte l'utilisateur
    localStorage.setItem("casino_current_user", email);
    setLoading(false);
    router.push("/lobby");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Card className="w-full max-w-md bg-black/40 border-white/10 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white text-2xl text-center">Créer un compte Casino Kikiri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <img
                src={avatar || defaultAvatar}
                alt="Avatar"
                className="w-20 h-20 rounded-full border-4 border-yellow-400 bg-white shadow-lg"
              />
              {/* Optionnel : upload avatar plus tard */}
            </div>
            <div>
              <label className="block text-white/80 mb-1">Pseudo</label>
              <input
                className="w-full rounded px-3 py-2 bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                type="text"
                value={pseudo}
                onChange={e => setPseudo(e.target.value)}
                placeholder="Votre pseudo"
                maxLength={16}
                required
              />
            </div>
            <div>
              <label className="block text-white/80 mb-1">Email</label>
              <input
                className="w-full rounded px-3 py-2 bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Votre email"
                required
              />
            </div>
            <div>
              <label className="block text-white/80 mb-1">Mot de passe</label>
              <input
                className="w-full rounded px-3 py-2 bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mot de passe (min 6 caractères)"
                required
              />
            </div>
            {error && <div className="text-red-400 text-sm text-center">{error}</div>}
            <Button
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-2 rounded-lg mt-4"
              type="submit"
              disabled={loading}
            >
              {loading ? "Création..." : "Créer mon compte"}
            </Button>
          </form>
          <div className="text-center mt-4">
            <a href="/login" className="text-yellow-400 hover:underline text-sm">Déjà inscrit ? Se connecter</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
