"use client";

import { formatCO2, formatEuros, formatKwh } from "@/lib/utils/energy";
import { useGameStore } from "@/store/gameStore";

const WEATHER_LABELS = {
  sunny: "☀️ Soleil",
  cloudy: "☁️ Nuages",
  stormy: "🌪️ Tempete",
  hot: "🥵 Chaleur",
  cold: "❄️ Froid",
  normal: "🌤️ Stable",
};

function Meter({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "good" | "warn" | "danger";
}) {
  const color =
    tone === "good" ? "bg-[#8ed081]" : tone === "warn" ? "bg-[#f2b45a]" : "bg-[#ff7a6b]";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-[#5d5077]">
        <span>{label}</span>
        <span className="playful-display">{Math.round(value)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#eadff4]">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

export function Dashboard() {
  const day = useGameStore((state) => state.day);
  const weather = useGameStore((state) => state.weather);
  const budget = useGameStore((state) => state.budget);
  const history = useGameStore((state) => state.history);
  const grid = useGameStore((state) => state.grid);

  const lastDay = history.at(-1);
  const autonomy = lastDay?.autonomyPercent ?? 0;
  const co2SavedGrams = (history.reduce((sum, item) => sum + item.co2SavedKg, 0) || 0) * 1000;

  return (
    <aside className="absolute bottom-4 left-3 top-20 z-10 flex w-[min(21rem,calc(50vw-2rem))] min-w-[17rem] flex-col gap-3 md:left-4 md:top-20 xl:w-[22rem]">
      <div className="panel hud-chip w-fit rounded-full px-4 py-2 text-xs font-bold text-[#57427b] md:px-4 md:py-3 md:text-sm">
        {WEATHER_LABELS[weather.type]}
      </div>

      <div className="panel hud-panel swiss-rule min-h-0 flex-1 overflow-hidden p-4 pt-6 md:p-5 md:pt-7">
        <div className="control-scroll flex h-full flex-col overflow-y-auto pr-1">
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-[#e8dbf4] pb-4">
          <div>
            <div className="hud-label mb-2">Jour {day} · micro reseau</div>
            <div className="playful-display text-xl font-bold text-[#2d2545] md:text-2xl">
              Tableau de bord
            </div>
            <div className="mt-1 text-xs text-[#695c86] md:text-sm">
              Lecture rapide de la maison avant arbitrage.
            </div>
          </div>
          <div className="rounded-[22px] border border-[#f1dcb2] bg-[#fff4d9] px-3 py-2 text-right text-[11px] text-[#7f6540] md:text-xs">
            <div className="uppercase tracking-[0.22em]">Production</div>
            <div className="playful-display mt-1 text-base font-bold text-[#2d2545] md:text-lg">
              {formatKwh(grid.productionKwh)}
            </div>
          </div>
        </div>

        <div className="space-y-4 pb-4">
          <Meter
            label="Autonomie"
            value={autonomy}
            tone={autonomy > 60 ? "good" : autonomy >= 30 ? "warn" : "danger"}
          />
          <div className="grid gap-2 text-sm text-[#5d5077]">
            <div className="flex items-center justify-between border-t border-[#ece3f4] px-0 py-2">
              <span>CO2 evite</span>
              <span className="playful-display text-[#2d2545]">{formatCO2(co2SavedGrams)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-[#ece3f4] px-0 py-2">
              <span>Budget restant</span>
              <span className={`playful-display ${budget < 500 ? "text-[#ef476f]" : "text-[#2d2545]"}`}>
                {formatEuros(budget)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-[#ece3f4] px-0 py-2">
              <span>Batterie</span>
              <span className="playful-display text-[#2d2545]">
                {grid.batteryLevel.toFixed(1)} / {grid.batteryCapacity.toFixed(0)} kWh
              </span>
            </div>
          </div>
        </div>

        <div className="mt-auto border-t border-[#e8dbf4] pt-4">
          <div className="mb-3 rounded-[20px] border border-[#dfebea] bg-[#effbfa] px-4 py-3 text-sm text-[#47706f]">
          <div>Consommation du jour</div>
          <div className="playful-display text-lg font-bold text-[#2d2545]">
            {formatKwh(grid.consumptionKwh)}
          </div>
          </div>
          <div>
            <div className="mb-2 text-xs uppercase tracking-[0.16em] text-[#8a7ca7]">Cycle</div>
            <div className="control-scroll flex gap-2 overflow-x-auto pb-1">
            {Array.from({ length: 7 }).map((_, index) => {
              const stepDay = index + 1;
              const status =
                stepDay < day
                  ? "bg-[#5bc0be] text-white"
                  : stepDay === day
                    ? "bg-[#ff6b6b] text-white"
                    : "border border-[#e8dbf4] bg-white/70 text-[#927faf]";
              return (
                <div
                  key={stepDay}
                  className={`flex h-9 min-w-9 items-center justify-center rounded-full text-xs font-bold shadow-sm ${status}`}
                >
                  {stepDay}
                </div>
              );
            })}
            </div>
          </div>
        </div>
        </div>
      </div>
    </aside>
  );
}
