// app/love-three/page.tsx
import React from "react";
import Link from "next/link";

async function getLoveThreeSpread() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${baseUrl}/tarot/love-three`, {
    cache: "no-store",
  });

  const data = await res.json();
  return Array.isArray(data) ? data : data.cards ?? [];
}

const POSITIONS = ["Sen", "Partner", "İlişkinin Enerjisi"];

export default async function LoveThreePage() {
  const cards = await getLoveThreeSpread();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/"
          className="text-slate-300 hover:text-slate-50 text-sm mb-6 inline-block"
        >
          ← Günün Kartına Dön
        </Link>

        <h1 className="text-3xl font-bold mb-2">3 Kart Aşk Açılımı</h1>
        <p className="text-slate-300 mb-8">
          Bu açılım; seni, partnerini ve ilişkinin enerjisini gösterir.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card: any, index: number) => (
            <div
              key={index}
              className="bg-slate-900/70 border border-pink-500/40 p-5 rounded-2xl shadow-md"
            >
              <p className="text-xs uppercase tracking-wider text-pink-300 mb-2">
                {POSITIONS[index]}
              </p>

              <h2 className="text-xl font-semibold mb-2">{card.name}</h2>

              <p className="text-sm text-slate-300 mb-4">{card.meaning}</p>

              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-sm">
                <h3 className="text-xs uppercase text-pink-300 mb-1">
                  Aşk Mesajı
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
