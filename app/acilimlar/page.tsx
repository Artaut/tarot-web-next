"use client";

import React, { useState } from "react";
import Link from "next/link";

type TarotCard = {
  id?: number;
  name?: string;
  meaning?: string;
  loveMeaning?: string;
  careerMeaning?: string;
  image?: string;
};

type SpreadId =
  | "cross-five"
  | "fate-seven"
  | "love-five"
  | "career-six"
  | "health-five";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const SPREADS: {
  id: SpreadId;
  label: string;
  endpoint: string;
  description: string;
}[] = [
  {
    id: "cross-five",
    label: "5 Kart Haç",
    endpoint: "/tarot/cross-five",
    description: "Genel durum, engeller ve olası sonuç üzerine klasik haç açılımı.",
  },
  {
    id: "fate-seven",
    label: "7 Kart Kader",
    endpoint: "/tarot/fate-seven",
    description:
      "Geçmiş, şimdi, gelecek ve kader yolundaki destekleyen / engelleyen enerjiler.",
  },
  {
    id: "love-five",
    label: "5 Kart Aşk",
    endpoint: "/tarot/love-five",
    description:
      "Sen, karşındaki kişi, aranızdaki bağ, engeller ve olası sonuç.",
  },
  {
    id: "career-six",
    label: "6 Kart Kariyer",
    endpoint: "/tarot/career-six",
    description:
      "Kariyer yolunda güçlü yanlar, zorluklar, fırsatlar ve sonuç.",
  },
  {
    id: "health-five",
    label: "5 Kart Sağlık",
    endpoint: "/tarot/health-five",
    description:
      "Genel enerji, beden, zihin, ruh ve şifa potansiyeline dair bir bakış.",
  },
];

export default function MultiSpreadsPage() {
  const [selectedSpread, setSelectedSpread] = useState<SpreadId>("cross-five");
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [targetName, setTargetName] = useState("");
  const isSomeoneElse = targetName.trim().length > 0;

  async function handleRead() {
    if (!API_BASE) {
      setError("NEXT_PUBLIC_API_URL tanımlı değil. Vercel ortam değişkenini kontrol et.");
      return;
    }

    const spread = SPREADS.find((s) => s.id === selectedSpread);
    if (!spread) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (isSomeoneElse) {
        params.set("intent", "someoneElse");
        params.set("name", targetName.trim());
      } else {
        params.set("intent", "self");
      }

      const query = params.toString();
      const url = `${API_BASE}${spread.endpoint}${query ? `?${query}` : ""}`;

      const res = await fetch(url, { cache: "no-store" });

      if (!res.ok) {
        throw new Error(`API hatası: ${res.status} – ${res.statusText}`);
      }

      const data = await res.json();

      const maybeArray = Array.isArray(data)
        ? data
        : data.cards ?? [];

      if (!Array.isArray(maybeArray)) {
        throw new Error("API beklenen formatta kart listesi döndürmedi.");
      }

      setCards(maybeArray as TarotCard[]);
    } catch (err: any) {
      setError(err.message || "Bilinmeyen bir hata oluştu.");
      setCards([]);
    } finally {
      setLoading(false);
    }
  }

  const currentSpread = SPREADS.find((s) => s.id === selectedSpread);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Üst bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/"
            className="text-slate-300 hover:text-slate-50 text-sm"
          >
            ← Günün Kartına Dön
          </Link>
          <div className="text-xs text-slate-400">
            API:{" "}
            <code className="text-slate-300">
              {API_BASE || "NEXT_PUBLIC_API_URL tanımlı değil"}
            </code>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2">
          Çoklu Tarot Açılımları
        </h1>
        <p className="text-slate-300 mb-6">
          Aşağıdan bir açılım tipi seç, istersen bir isim girerek{" "}
          <span className="font-semibold text-pink-300">başkası için</span>{" "}
          de niyet tutabilirsin.
        </p>

        {/* Niyet & Başkası İçin Alanı */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 md:items-end">
          <div className="flex-1">
            <label className="block text-sm mb-1 text-slate-200">
              Kime niyet ediyorsun?
            </label>
            <input
              type="text"
              className="w-full rounded-lg bg-slate-950/70 border border-slate-700 px-3 py-2 text-sm text-slate-50 outline-none focus:border-pink-500"
              placeholder="Boş bırakırsan kendin için açılır. Örn: Ayşe, Eski sevgilim, Annem..."
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-400">
              {isSomeoneElse
                ? `Niyet: ${targetName.trim()} için.`
                : "Niyet: Kendin için."}
            </p>
          </div>

          <button
            onClick={handleRead}
            disabled={loading}
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-pink-600 text-sm font-medium shadow-md hover:bg-pink-500 disabled:opacity-60 disabled:cursor-not-allowed transition md:self-auto"
          >
            {loading ? "Kartlar açılıyor..." : "Falı Aç"}
          </button>
        </div>

        {/* Açılım tipi seçimi */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {SPREADS.map((spread) => (
              <button
                key={spread.id}
                onClick={() => setSelectedSpread(spread.id)}
                className={`px-3 py-2 rounded-full text-xs md:text-sm border transition ${
                  selectedSpread === spread.id
                    ? "bg-sky-600 border-sky-400 text-slate-50"
                    : "bg-slate-900/70 border-slate-700 text-slate-200 hover:border-sky-500/70"
                }`}
              >
                {spread.label}
              </button>
            ))}
          </div>
          {currentSpread && (
            <p className="mt-3 text-sm text-slate-300">
              {currentSpread.description}
            </p>
          )}
        </div>

        {/* Hata mesajı */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/60 bg-red-950/40 p-4 text-sm text-red-100">
            <p className="font-semibold mb-1">Bir şeyler ters gitti.</p>
            <p>{error}</p>
          </div>
        )}

        {/* Kartlar alanı */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4">
          {cards.length === 0 && !error && (
            <p className="text-sm text-slate-400">
              Henüz kart çekilmedi. Niyetini belirleyip{" "}
              <span className="text-pink-300 font-semibold">“Falı Aç”</span>{" "}
              butonuna bas.
            </p>
          )}

          {cards.length > 0 && (
            <>
              <p className="text-sm text-slate-300 mb-4">
                Toplam{" "}
                <span className="font-semibold text-sky-300">
                  {cards.length}
                </span>{" "}
                kart açıldı{" "}
                {isSomeoneElse && (
                  <>
                    (
                    <span className="text-pink-300">
                      {targetName.trim()} için
                    </span>
                    ).
                  </>
                )}
              </p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {cards.map((card, index) => (
                  <div
                    key={card.id ?? index}
                    className="bg-slate-950/70 border border-slate-700 rounded-2xl p-3 flex flex-col justify-between"
                  >
                    <p className="text-[10px] uppercase tracking-widest text-sky-300 mb-1">
                      Kart {index + 1}
                    </p>
                    <h2 className="text-sm font-semibold mb-1">
                      {card.name ?? "Bilinmeyen Kart"}
                    </h2>
                    {card.meaning && (
                      <p className="text-xs text-slate-300 mb-2">
                        {card.meaning}
                      </p>
                    )}
                    {card.loveMeaning && (
                      <p className="text-[11px] text-pink-200 mb-1">
                        <span className="font-semibold">Aşk: </span>
                        {card.loveMeaning}
                      </p>
                    )}
                    {card.careerMeaning && (
                      <p className="text-[11px] text-slate-200">
                        <span className="font-semibold">Kariyer: </span>
                        {card.careerMeaning}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
