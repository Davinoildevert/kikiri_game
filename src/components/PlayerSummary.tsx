"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CasinoUser = {
  email: string;
  password: string;
  pseudo: string;
  avatar: string;
  balance: number;
  createdAt: number;
};

export default function PlayerSummary() {
  const [user, setUser] = useState<CasinoUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("casino_current_user");
    if (!email) return;
    const users = JSON.parse(localStorage.getItem("casino_users") || "{}") as Record<string, CasinoUser>;
    const currentUser = users[email];
    if (currentUser) setUser(currentUser);
  }, []);

  if (!user) return null;

  return (
    <div className="flex items-center gap-3 bg-black/30 px-4 py-2 rounded-xl shadow border border-white/10">
      <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-yellow-400 bg-white" />
      <div className="flex flex-col">
        <span className="text-white font-semibold text-sm">{user.pseudo}</span>
        <span className="text-yellow-400 text-xs font-bold">{user.balance} €</span>
      </div>
      <button
        className="ml-4 px-3 py-1 bg-yellow-400 text-black rounded font-bold hover:bg-yellow-500 transition"
        onClick={() => router.push("/account")}
      >
        Mon compte
      </button>
    </div>
  );
}
