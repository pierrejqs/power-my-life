"use client";

import { useGameStore } from "@/store/gameStore";
import { GameController } from "@/components/game/GameController";
import { Scene } from "@/components/scene/Scene";
import { Dashboard } from "@/components/ui/Dashboard";
import { EventCard } from "@/components/ui/EventCard";
import { Narrator } from "@/components/ui/Narrator";
import { Onboarding } from "@/components/ui/Onboarding";
import { ScoreCard } from "@/components/ui/ScoreCard";
import { ShopPanel } from "@/components/ui/ShopPanel";

export function GameShell() {
  const phase = useGameStore((state) => state.phase);

  return (
    <div className="relative h-[100svh] w-full overflow-hidden bg-[#c6c7cf]">
      <Scene />
      <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-center justify-between md:inset-x-4 md:top-4">
        <div className="rounded-full border border-white/45 bg-[rgba(255,255,255,0.42)] px-5 py-3 text-[12px] font-extrabold uppercase tracking-[0.22em] text-[#5a427d] backdrop-blur md:px-7 md:text-sm">
          Power My Life
        </div>
        <div className="hidden rounded-full border border-white/45 bg-[rgba(255,255,255,0.42)] px-5 py-3 text-[12px] font-extrabold uppercase tracking-[0.22em] text-[#7d678f] backdrop-blur md:px-7 md:text-sm sm:block">
          systeme domestique
        </div>
      </div>
      <GameController />
      <Narrator />
      {phase === "ONBOARDING" && <Onboarding />}
      {(phase === "PLANNING" || phase === "SIMULATING" || phase === "RECAP") && (
        <Dashboard />
      )}
      {phase === "PLANNING" && <ShopPanel />}
      {phase === "EVENT" && <EventCard />}
      {phase === "SCORE" && <ScoreCard />}
    </div>
  );
}
