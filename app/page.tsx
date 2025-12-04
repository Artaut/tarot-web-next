// app/page.tsx
import React from "react";
import Link from "next/link";

async function getDailyCard() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL tanımlı değil");
  }

  const res = await fetch(`${baseUrl}/tarot/daily`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API hatası: ${res.status}`);
  }

  return res.json();
}

export default async function Home() {
  const data = await getDailyCard();
  const card = data.card;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 p-6">
      <div className="w-full max-w-3xl p-8 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl">
        <h1 className="text-3xl font-bold mb-4 text-center">Günün Kartı</h1>

        <div className="text-sm mb-4 text-center text-slate-400">
          API: <code>{process.env.NEXT_PUBLIC_API_URL}/tarot/daily</code>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-lg text-xs overflow-x-auto mb-4">
          <h2 className="text-lg font-semibold mb-2">{card.name}</h2>
          <p className="text-slate-300 mb-3">{card.meaning}</p>

          <div className="grid gap-4">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3">
              <h3 className="text-xs uppercase tracking-wider text-pink-300 mb-1">Aşk</h3>
              <p className="text-slate-200 text-sm">{card.loveMeaning}</p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3">
              <h3 className="text-xs uppercase tracking-wider text-sky-300 mb-1">Kariyer</h3>
              <p className="text-slate-200 text-sm">{card.careerMeaning}</p>
            </div>
          </div>
        </div>
      </div>

      {/* === ALT MENÜ BUTONLARI === */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <Link
          href="/love-three"
          className="px-4 py-2 rounded-full border border-pink-500/60 text-pink-200 text-sm hover:bg-pink-500/10 transition"
        >
          ❤️ 3 Kart Aşk Açılımı
        </Link>

        <Link
          href="/spread"
          className="px-4 py-2 rounded-full border border-sky-500/60 text-sky-200 text-sm hover:bg-sky-500/10 transition"
        >
          🔮 Geçmiş · Şimdi · Gelecek
        </Link>
      </div>
    </main>
  );
}
