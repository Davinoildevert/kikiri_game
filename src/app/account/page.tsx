"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Type utilisateur identique à l'inscription
 type CasinoUser = {
  email: string;
  password: string;
  pseudo: string;
  avatar: string;
  balance: number;
  createdAt: number;
};

export default function AccountPage() {
  const [user, setUser] = useState<CasinoUser | null>(null);
  const [pseudo, setPseudo] = useState("");
  const [avatar, setAvatar] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [history] = useState([
    { date: "2025-07-16", game: "Kikiri", result: "+200€" },
    { date: "2025-07-15", game: "Kikiri", result: "-100€" },
    { date: "2025-07-14", game: "Kikiri", result: "+50€" },
  ]);
  // Historique mocké des transactions Stripe
  const [transactions] = useState([
    { date: "2025-07-16", type: "Dépot", amount: 100, status: "Succès" },
    { date: "2025-07-15", type: "Retrait", amount: 50, status: "Échec" },
    { date: "2025-07-14", type: "Dépot", amount: 200, status: "Succès" },
  ]);

  // Préparation des hooks/callbacks Stripe (mock)
  const handleDeposit = () => {
    // TODO: Intégration Stripe plus tard
    alert("Fonctionnalité à venir : dépôt via Stripe");
  };
  const handleWithdraw = () => {
    // TODO: Intégration Stripe plus tard
    alert("Fonctionnalité à venir : retrait via Stripe");
  };
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("casino_current_user");
    if (!email) {
      router.replace("/login");
      return;
    }
    const users = JSON.parse(localStorage.getItem("casino_users") || "{}") as Record<string, CasinoUser>;
    const currentUser = users[email];
    if (!currentUser) {
      router.replace("/login");
      return;
    }
    setUser(currentUser);
    setPseudo(currentUser.pseudo);
    setAvatar(currentUser.avatar);
    setPassword("");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("casino_current_user");
    router.push("/login");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!pseudo.trim()) {
      setError("Pseudo requis");
      return;
    }
    if (password && password.length < 6) {
      setError("Mot de passe trop court (min 6 caractères)");
      return;
    }
    const email = user?.email;
    if (!email) return;
    const users = JSON.parse(localStorage.getItem("casino_users") || "{}") as Record<string, CasinoUser>;
    const updatedUser = {
      ...users[email],
      pseudo,
      avatar,
      password: password ? password : users[email].password,
    };
    users[email] = updatedUser;
    localStorage.setItem("casino_users", JSON.stringify(users));
    setUser(updatedUser);
    setPassword("");
    setSuccess("Profil mis à jour !");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Card className="w-full max-w-md bg-black/40 border-white/10 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white text-2xl text-center">Mon compte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 flex flex-col items-center">
          <form onSubmit={handleSave} className="w-full flex flex-col items-center gap-4">
            <img
              src={avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-yellow-400 bg-white shadow-lg mb-2"
            />
            <div className="w-full">
              <label className="block text-white/80 mb-1">Avatar (URL ou Dicebear)</label>
              <input
                className="w-full rounded px-3 py-2 bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                type="text"
                value={avatar}
                onChange={e => setAvatar(e.target.value)}
                placeholder="URL de l'avatar"
              />
            </div>
            <div className="w-full">
              <label className="block text-white/80 mb-1">Pseudo</label>
              <input
                className="w-full rounded px-3 py-2 bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                type="text"
                value={pseudo}
                onChange={e => setPseudo(e.target.value)}
                maxLength={16}
                required
              />
            </div>
            <div className="w-full">
              <label className="block text-white/80 mb-1">Changer le mot de passe</label>
              <input
                className="w-full rounded px-3 py-2 bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Nouveau mot de passe (min 6 caractères)"
              />
            </div>
          <div className="w-full flex flex-col items-center gap-2 mt-2">
            <div className="text-yellow-400 text-xl font-bold">Solde : {user.balance} €</div>
            <div className="flex gap-2 mt-1">
              <Button type="button" className="bg-green-400 hover:bg-green-500 text-black font-bold px-4 py-1 rounded-lg" onClick={handleDeposit}>
                Déposer
              </Button>
              <Button type="button" className="bg-red-400 hover:bg-red-500 text-black font-bold px-4 py-1 rounded-lg" onClick={handleWithdraw}>
                Retirer
              </Button>
            </div>
            <div className="text-xs text-white/50">(Stripe à venir)</div>
          </div>
            {success && <div className="text-green-400 text-sm text-center w-full">{success}</div>}
            {error && <div className="text-red-400 text-sm text-center w-full">{error}</div>}
            <Button
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-2 rounded-lg mt-2"
              type="submit"
            >
              Enregistrer
            </Button>
          </form>
          <div className="w-full mt-6">
            <div className="text-white/80 text-lg mb-2">Historique des parties</div>
            <div className="bg-white/10 rounded-lg p-3 max-h-40 overflow-y-auto mb-6">
              {history.length === 0 ? (
                <div className="text-white/50 text-sm">Aucune partie jouée pour l’instant.</div>
              ) : (
                <table className="w-full text-white text-sm">
                  <thead>
                    <tr>
                      <th className="text-left">Date</th>
                      <th className="text-left">Jeu</th>
                      <th className="text-left">Résultat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h, i) => (
                      <tr key={i}>
                        <td>{h.date}</td>
                        <td>{h.game}</td>
                        <td>{h.result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="text-white/80 text-lg mb-2">Historique des transactions (mock Stripe)</div>
            <div className="bg-white/10 rounded-lg p-3 max-h-40 overflow-y-auto">
              {transactions.length === 0 ? (
                <div className="text-white/50 text-sm">Aucune transaction pour l’instant.</div>
              ) : (
                <table className="w-full text-white text-sm">
                  <thead>
                    <tr>
                      <th className="text-left">Date</th>
                      <th className="text-left">Type</th>
                      <th className="text-left">Montant</th>
                      <th className="text-left">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t, i) => (
                      <tr key={i}>
                        <td>{t.date}</td>
                        <td>{t.type}</td>
                        <td>{t.amount} €</td>
                        <td>{t.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <Button
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-2 rounded-lg mt-6"
            onClick={handleLogout}
          >
            Se déconnecter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
