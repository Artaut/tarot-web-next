// app/spread/page.tsx
import React from "react";
import Link from "next/link";

type TarotCard = {
  id?: number;
  name?: string;
  meaning?: string;
  loveMeaning?: string;
  careerMeaning?: string;
  image?: string;
};

type SpreadResult = {
  cards: TarotCard[];
  error: string | null;
};

async function getSpread(): Promise<SpreadResult> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    return {
      cards: [],
      error: "NEXT_PUBLIC_API_URL tanımlı değil (Vercel ortam değişkenini kontrol et).",
    };
  }

  try {
    const res = await fetch(`${baseUrl}/tarot/spread`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        cards: [],
        error: `API hatası: ${res.status} (${res.statusText})`,
      };
    }

    let data: any;
    try {
      data = await res.json();
    } catch {
      return {
        cards: [],
        error: "API'den geçerli JSON yanıt alınamadı.",
      };
    }

    const maybeArray = Array.isArray(data)
      ? data
      : data.cards ?? data.spread ?? [];

    if (!Array.isArray(maybeArray)) {
      return {
        cards: [],
        error: "API beklenen formatta veri döndürmedi.",
      };
    }

    return {
      cards: maybeArray as TarotCard[],
      error: null,
    };
  } catch (e) {
    return {
      cards: [],
      error: "Sunucuya bağlanırken bir hata oluştu.",
    };
  }
}

const POSITIONS = ["Geçmiş", "Şimdi", "Gelecek"];

export default async function SpreadPage() {
  const { cards, error } = await getSpread();

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

        {/* Hata varsa kullanıcıya düzgün mesaj göster */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/60 bg-red-950/40 p-4 text-sm text-red-100">
            <p className="font-semibold mb-1">Bir şeyler ters gitti.</p>
            <p>{error}</p>
            <p className="mt-2 text-xs text-red-200/80">
              Eğer bu hata sık oluyorsa, /tarot/spread endpoint'ini backend
              tarafında kontrol etmek iyi olabilir.
            </p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card, index) => (
            <div
              key={card.id ?? index}
              className="bg-slate-900/70 border border-sky-500/40 p-5 rounded-2xl shadow-md"
            >
              <p className="text-xs uppercase tracking-wider text-sky-300 mb-2">
                {POSITIONS[index] ?? `Pozisyon ${index + 1}`}
              </p>

              <h2 className="text-xl font-semibold mb-2">
                {card.name ?? "Bilinmeyen Kart"}
              </h2>

              {card.meaning && (
                <p className="text-sm text-slate-300 mb-4">{card.meaning}</p>
              )}

              {card.loveMeaning && (
                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-sm mb-2">
                  <h3 className="text-xs uppercase text-sky-300 mb-1">
                    Duygusal Yansıma
                  </h3>
                  <p>{card.loveMeaning}</p>
                </div>
              )}

              {card.careerMeaning && (
                <p className="text-xs text-slate-400">
                  <span className="font-semibold text-slate-200">
                    Kariyer:
                  </span>{" "}
                  {card.careerMeaning}
                </p>
              )}
            </div>
          ))}
        </div>

        {cards.length === 0 && !error && (
          <p className="mt-6 text-sm text-slate-400">
            Henüz gösterilecek kart yok. Backend /tarot/spread yanıtını
            kontrol etmek gerekebilir.
          </p>
        )}
      </div>
    </main>
  );
}
