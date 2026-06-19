"use client";

import { useGameStore } from "@/store/gameStore";

export function EventCard() {
  const currentEvent = useGameStore((state) => state.currentEvent);
  const acknowledgeEvent = useGameStore((state) => state.acknowledgeEvent);

  if (!currentEvent) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/45 px-4 backdrop-blur">
      <div className="panel hud-panel swiss-rule w-full max-w-xl p-5 pt-6 text-[#2d2545] shadow-2xl sm:p-6 sm:pt-7">
        <div className="mb-2 hud-label">Evenement</div>
        <h2 className="playful-display mb-3 text-2xl font-bold sm:text-3xl">
          {currentEvent.title}
        </h2>
        <p className="mb-3 text-sm leading-6 text-[#6c6185] sm:text-base">{currentEvent.description}</p>
        <p className="mb-6 rounded-[22px] border border-[#eee2f4] bg-white/70 px-4 py-3 text-sm text-[#43375e]">
          {currentEvent.narratorText}
        </p>
        <button
          type="button"
          onClick={() => acknowledgeEvent()}
          className="glass-button w-full rounded-full px-4 py-3 text-sm font-bold"
        >
          Compris
        </button>
      </div>
    </div>
  );
}
