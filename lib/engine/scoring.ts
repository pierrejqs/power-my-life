import type { DayResult, Score } from "@/lib/types/game";

export function computeScore(history: DayResult[], budgetRemaining: number): Score {
  const totalConsumption = history.reduce((sum, day) => sum + day.grid.consumptionKwh, 0);
  const totalImport = history.reduce((sum, day) => sum + day.grid.gridImportKwh, 0);
  const autonomyPercent =
    totalConsumption > 0
      ? Math.round(((totalConsumption - totalImport) / totalConsumption) * 100)
      : 0;
  const co2SavedKg = round(history.reduce((sum, day) => sum + day.co2SavedKg, 0));
  const totalScore = Math.round(
    autonomyPercent * 0.5 + co2SavedKg * 0.5 + budgetRemaining / 100
  );
  const tier =
    totalScore > 80 ? "pioneer" : totalScore > 50 ? "transition" : "dependent";

  return {
    autonomyPercent,
    co2SavedKg,
    budgetRemaining,
    totalScore,
    tier,
  };
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
