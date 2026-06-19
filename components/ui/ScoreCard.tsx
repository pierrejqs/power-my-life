"use client";

import html2canvas from "html2canvas";
import { useRef } from "react";

import { NARRATOR_SCORE } from "@/lib/data/narrator";
import { formatEuros } from "@/lib/utils/energy";
import { useGameStore } from "@/store/gameStore";

const backgrounds = {
  pioneer: "from-[#fff7ef] via-[#fce8e3] to-[#e4fbf7]",
  transition: "from-[#fff6e8] via-[#ffe8d1] to-[#fde5df]",
  dependent: "from-[#f6f1ff] via-[#ece4ff] to-[#ddf6f3]",
} as const;

export function ScoreCard() {
  const score = useGameStore((state) => state.score);
  const resetGame = useGameStore((state) => state.resetGame);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!score) {
    return null;
  }

  async function handleShare() {
    if (!cardRef.current) {
      return;
    }

    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: null,
      scale: 2,
    });

    const link = document.createElement("a");
    link.download = "power-my-life-score.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  const narrator = NARRATOR_SCORE[score.tier];

  return (
    <div
      className={`absolute inset-0 z-30 flex items-center justify-center bg-gradient-to-b ${backgrounds[score.tier]} px-3 py-4 sm:px-4`}
    >
      <div
        ref={cardRef}
        className="panel hud-panel swiss-rule w-full max-w-2xl p-5 pt-6 text-[#2d2545] sm:p-8 sm:pt-7"
      >
        <div className="mb-2 hud-label">Power My Life</div>
        <h2 className="playful-display mb-1 text-3xl font-bold capitalize sm:text-5xl">
          {score.tier}
        </h2>
        <p className="mb-6 text-[#6c6185]">Mon bilan energetique sur 7 jours</p>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[24px] border border-[#f3dfb6] bg-[#fff4d9] p-4">
            <div className="text-xs text-[#8a6f47]">Autonomie</div>
            <div className="playful-display mt-2 text-3xl font-bold">{score.autonomyPercent}%</div>
          </div>
          <div className="rounded-[24px] border border-[#d9efed] bg-[#effbfa] p-4">
            <div className="text-xs text-[#4a7a79]">CO2 evite</div>
            <div className="playful-display mt-2 text-3xl font-bold">{score.co2SavedKg.toFixed(1)} kg</div>
          </div>
          <div className="rounded-[24px] border border-[#eeddf2] bg-[#fbf1ff] p-4">
            <div className="text-xs text-[#7d6997]">Budget restant</div>
            <div className="playful-display mt-2 text-2xl font-bold">{formatEuros(score.budgetRemaining)}</div>
          </div>
        </div>

        <div className="mb-4 rounded-[26px] border border-[#ffe0d3] bg-[#fff3ee] p-5">
          <div className="mb-1 text-xs uppercase tracking-[0.16em] text-[#a67b71]">
            Score total
          </div>
          <div className="playful-display text-4xl font-bold sm:text-5xl">{score.totalScore}</div>
        </div>

        <p className="mb-6 text-sm leading-6 text-[#43375e]">{narrator.text}</p>
        <div className="mb-6 text-xs uppercase tracking-[0.14em] text-[#8e80aa]">
          Defend Intelligence Hackathon 2026
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => handleShare()}
            className="glass-button flex-1 rounded-full px-4 py-3 text-sm font-bold"
          >
            Partager
          </button>
          <button
            type="button"
            onClick={() => resetGame()}
            className="rounded-full border border-[#e7dbf0] bg-white/68 px-4 py-3 text-sm font-bold text-[#5d5077]"
          >
            Rejouer
          </button>
        </div>
      </div>
    </div>
  );
}
