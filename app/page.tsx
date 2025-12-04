// app/page.tsx
import React from "react";

async function getDailyCard() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL tanımlı değil");
  }

  const res = await fetch(`${baseUrl}/tarot/daily`, {
    // her istekte taze veri çek
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API hatası: ${res.status}`);
  }

  return res.json();
}

export default async function Home() {
  const data = await getDailyCard();

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <div className="w-full max-w-xl p-8 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl">
        <h1 className="text-3xl font-semibold mb-4 text-center">
          Günün Kartı (Test)
        </h1>

        <div className="text-sm mb-4 text-center text-slate-400">
          API: <code>{process.env.NEXT_PUBLIC_API_URL}/tarot/daily</code>
        </div>

        <pre className="bg-slate-950/60 border border-slate-800 p-4 rounded-lg text-xs overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </main>
  );
}
