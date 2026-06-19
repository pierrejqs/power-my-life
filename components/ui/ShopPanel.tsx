"use client";

import type { TouchEvent as ReactTouchEvent } from "react";
import { useState } from "react";

import { EQUIPMENT_CATALOG } from "@/lib/data/equipment";
import { NARRATOR_SHOP_HINTS } from "@/lib/data/narrator";
import { getMaxRoofSlots, getPurchaseAvailability } from "@/lib/engine/purchases";
import { formatEuros } from "@/lib/utils/energy";
import { useGameStore } from "@/store/gameStore";

const reasonLabels = {
  missing_profile: "Profil incomplet",
  insufficient_budget: "Budget insuffisant",
  unique_owned: "Deja achete",
  needs_garden: "Jardin requis",
  roof_full: "Toit complet",
};

export function ShopPanel() {
  const phase = useGameStore((state) => state.phase);
  const profile = useGameStore((state) => state.profile);
  const budget = useGameStore((state) => state.budget);
  const equipment = useGameStore((state) => state.equipment);
  const roofSlotsUsed = useGameStore((state) => state.roofSlotsUsed);
  const isShopSheetOpen = useGameStore((state) => state.isShopSheetOpen);
  const purchaseEquipment = useGameStore((state) => state.purchaseEquipment);
  const requestDayStart = useGameStore((state) => state.requestDayStart);
  const setShopSheetOpen = useGameStore((state) => state.setShopSheetOpen);
  const setNarrator = useGameStore((state) => state.setNarrator);

  const maxRoofSlots = getMaxRoofSlots(profile);
  const ownedCount = equipment.length;
  const isRunning = phase === "SIMULATING";
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  function handleTouchStart(event: ReactTouchEvent<HTMLDivElement>) {
    setDragStartY(event.touches[0]?.clientY ?? null);
    setDragOffset(0);
  }

  function handleTouchMove(event: ReactTouchEvent<HTMLDivElement>) {
    if (dragStartY === null) {
      return;
    }

    const currentY = event.touches[0]?.clientY;
    if (currentY === undefined) {
      return;
    }

    const nextOffset = Math.max(0, currentY - dragStartY);
    setDragOffset(nextOffset);
  }

  function handleTouchEnd() {
    if (dragOffset > 90) {
      setShopSheetOpen(false);
    }

    setDragStartY(null);
    setDragOffset(0);
  }

  if (!isShopSheetOpen) {
    return (
      <aside className="absolute bottom-4 right-3 top-20 z-10 flex w-[min(22rem,calc(50vw-2rem))] min-w-[18rem] items-start justify-end md:right-4 xl:w-[24rem]">
        <button
          type="button"
          onClick={() => setShopSheetOpen(true)}
          className="panel hud-chip flex items-center gap-3 rounded-full px-4 py-3 text-left text-[#57427b]"
        >
          <span className="h-2 w-2 rounded-full bg-[#ff6b6b]" />
          <span className="playful-display text-sm font-bold">Equipements</span>
          <span className="text-xs text-[#7f7698]">{ownedCount} actif{ownedCount > 1 ? "s" : ""}</span>
        </button>
      </aside>
    );
  }

  return (
    <aside className="absolute bottom-4 right-3 top-20 z-10 w-[min(22rem,calc(50vw-2rem))] min-w-[18rem] md:right-4 xl:w-[24rem]">
      <div
        className="panel hud-panel swiss-rule flex h-full flex-col overflow-hidden p-3 pt-5 transition-transform duration-200 ease-out md:p-5 md:pt-7"
        style={{ transform: dragOffset ? `translateY(${dragOffset}px)` : undefined }}
      >
        <div className="mb-2 flex items-center justify-center lg:hidden">
          <div
            className="flex w-full justify-center py-2"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            <div className="h-1.5 w-12 rounded-full bg-[#ddcfec]" />
          </div>
        </div>
        <div className="mb-3 flex items-start justify-between gap-3 border-b border-[#e8dbf4] pb-3 md:mb-4 md:gap-4 md:pb-4">
          <div>
            <div className="hud-label mb-2">Arbitrages</div>
            <div className="playful-display text-lg font-bold text-[#2d2545] md:text-2xl">
              Equipements
            </div>
            <div className="mt-1 text-[11px] text-[#695c86] md:text-sm">
              Choisis ce qui stabilise vraiment la maison.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="rounded-[20px] border border-[#d9edf0] bg-[#effbfa] px-3 py-2 text-right text-[10px] text-[#4d7a79] md:text-xs">
              <div className="uppercase tracking-[0.22em]">Toit</div>
              <div className="playful-display text-sm text-[#2d2545]">
                {roofSlotsUsed}/{maxRoofSlots || 0} slots
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#7f7698] md:text-[11px]">
                {ownedCount} actif{ownedCount > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>

        <div className="control-scroll min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
          {EQUIPMENT_CATALOG.map((item) => {
            const availability = getPurchaseAvailability(
              profile,
              equipment,
              budget,
              roofSlotsUsed,
              item
            );

            return (
              <div
                key={item.id}
                className="rounded-[20px] border border-[#eee2f4] bg-white/72 p-2.5 md:rounded-[22px] md:p-4"
                onMouseEnter={() => {
                  const hint = NARRATOR_SHOP_HINTS[item.id];
                  setNarrator(hint.text, hint.tone);
                }}
                onFocus={() => {
                  const hint = NARRATOR_SHOP_HINTS[item.id];
                  setNarrator(hint.text, hint.tone);
                }}
              >
                <div className="mb-2 flex items-start justify-between gap-2 md:gap-3">
                  <div className="flex gap-2 md:gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-[14px] border border-white/60 bg-[#fff4d9] text-lg shadow-sm md:h-11 md:w-11 md:rounded-[18px] md:text-2xl">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="line-clamp-2 text-sm font-semibold leading-4 text-[#2d2545] md:text-base md:leading-5">
                        {item.name}
                      </div>
                      <div className="mt-1 text-xs text-[#6c6185]">
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <div className="playful-display shrink-0 text-sm text-[#2d2545]">
                    {formatEuros(item.cost)}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!availability.allowed}
                  onClick={() => purchaseEquipment(item.id)}
                  className="glass-button w-full rounded-full px-2 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 md:px-3 md:text-sm"
                >
                  {availability.allowed
                    ? "Acheter"
                    : reasonLabels[availability.reason ?? "missing_profile"]}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-3 border-t border-[#e8dbf4] pt-3 md:mt-4 md:pt-4">
          <button
            type="button"
            disabled={phase !== "PLANNING" || isRunning}
            onClick={() => requestDayStart()}
            className="glass-button w-full rounded-full px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isRunning ? "Simulation en cours" : "Lancer le jour"}
          </button>
        </div>
      </div>
    </aside>
  );
}
