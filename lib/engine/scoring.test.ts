import { describe, expect, it } from "vitest";
import * as fc from "fast-check";

import { computeScore } from "@/lib/engine/scoring";
import type { DayResult } from "@/lib/types/game";

const day: DayResult = {
  day: 1,
  weather: { type: "normal", solarMultiplier: 1, windMultiplier: 1, consumptionMultiplier: 1 },
  event: null,
  grid: {
    productionKwh: 8,
    consumptionKwh: 10,
    batteryLevel: 2,
    batteryCapacity: 10,
    gridImportKwh: 2,
    gridExportKwh: 0,
  },
  autonomyPercent: 80,
  co2SavedKg: 0.42,
  costEur: 0.5,
  narratorRecap: "ok",
};

describe("scoring", () => {
  it("computes final score tiers from history and budget", () => {
    const score = computeScore([day, { ...day, day: 2, co2SavedKg: 0.58 }], 3200);

    expect(score.autonomyPercent).toBe(80);
    expect(score.co2SavedKg).toBe(1);
    expect(score.totalScore).toBe(73);
    expect(score.tier).toBe("transition");
  });

  it("is deterministic for the same history and budget", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 5000 }), (budget) => {
        const once = computeScore([day], budget);
        const twice = computeScore([day], budget);
        expect(twice).toEqual(once);
      })
    );
  });
});
