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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const users = JSON.parse(localStorage.getItem("casino_users") || "{}") as Record<string, CasinoUser>;
    const user = users[email];
    if (!user) {
      setError("Aucun compte trouvé pour cet email");
      setLoading(false);
      return;
    }
    if (user.password !== password) {
      setError("Mot de passe incorrect");
      setLoading(false);
      return;
    }
    // Connecte l'utilisateur
    localStorage.setItem("casino_current_user", email);
    setLoading(false);
    router.push("/lobby");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Card className="w-full max-w-md bg-black/40 border-white/10 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white text-2xl text-center">Connexion Casino Kikiri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Mot de passe"
                required
              />
            </div>
            {error && <div className="text-red-400 text-sm text-center">{error}</div>}
            <Button
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-2 rounded-lg mt-4"
              type="submit"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
          <div className="text-center mt-4">
            <a href="/register" className="text-yellow-400 hover:underline text-sm">Pas encore de compte ? S'inscrire</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
