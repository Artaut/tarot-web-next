// app/spread/page.tsx
import React from "react";
import Link from "next/link";

async function getSpread() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${baseUrl}/tarot/spread`, {
    cache: "no-store",
  });

  const data = await res.json();
  return Array.isArray(data) ? data : data.cards ?? [];
}

const POSITIONS = ["Geçmiş", "Şimdi", "Gelecek"];

export default async function SpreadPage() {
  const cards = await getSpread();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/"
          className="text-slate-300 hover:text-slate-50 text-sm mb-6 inline-block"
        >
          ← Günün Kartına Dön
        </Link>

        <h1 className="text-3xl font-bold mb-2">Geçmiş · Şimdi · Gelecek</h1>
        <p className="text-slate-300 mb-8">
          Bu açılım; geçmişin etkilerini, şu anki durumu ve geleceğe uzanan
          enerjiyi gösterir.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card: any, index: number) => (
            <div
              key={index}
              className="bg-slate-900/70 border border-sky-500/40 p-5 rounded-2xl shadow-md"
            >
              <p className="text-xs uppercase tracking-wider text-sky-300 mb-2">
                {POSITIONS[index]}
              </p>

              <h2 className="text-xl font-semibold mb-2">{card.name}</h2>

              <p className="text-sm text-slate-300 mb-4">{card.meaning}</p>

              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-sm">
                <h3 className="text-xs uppercase text-sky-300 mb-1">
                  Duygusal Yansıma
                </h3>
                <p>{card.loveMeaning}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
