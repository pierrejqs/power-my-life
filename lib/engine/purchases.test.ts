import { describe, expect, it } from "vitest";
import * as fc from "fast-check";

import { getEquipmentItem } from "@/lib/engine/purchases";
import {
  applyEquipmentPurchase,
  getMaxRoofSlots,
  getPurchaseAvailability,
} from "@/lib/engine/purchases";
import type { Equipment, UserProfile } from "@/lib/types/game";

const maison: UserProfile = { houseType: "maison", occupants: "couple", region: "sud" };
const studio: UserProfile = { houseType: "studio", occupants: "solo", region: "centre" };

describe("purchases", () => {
  it("enforces roof capacity from house type", () => {
    const solar = getEquipmentItem("solar-panel");
    expect(solar).toBeDefined();
    expect(getMaxRoofSlots(studio)).toBe(2);
    expect(
      getPurchaseAvailability(studio, [], 5000, 2, solar!)
    ).toEqual({ allowed: false, reason: "roof_full" });
  });

  it("blocks unique duplicate purchases and garden-only gear in studio", () => {
    const windmill = getEquipmentItem("windmill")!;
    const battery = getEquipmentItem("battery")!;
    const owned: Equipment[] = [
      { id: "battery", name: "Batterie domestique", type: "battery", count: 1, purchasedOnDay: 1 },
    ];

    expect(getPurchaseAvailability(studio, [], 5000, 0, windmill)).toEqual({
      allowed: false,
      reason: "needs_garden",
    });
    expect(getPurchaseAvailability(maison, owned, 5000, 0, battery)).toEqual({
      allowed: false,
      reason: "unique_owned",
    });
  });

  it("never allows budget to go negative under repeated arbitrary purchases", () => {
    fc.assert(
      fc.property(fc.array(fc.constantFrom("solar-panel", "battery", "windmill", "thermostat", "led", "offpeak")), (ids) => {
        let state = {
          budget: 5000,
          equipment: [] as Equipment[],
          roofSlotsUsed: 0,
          day: 1,
          profile: maison,
        };

        for (const id of ids) {
          const applied = applyEquipmentPurchase(state, id);
          state = { ...state, ...applied };
          expect(state.budget).toBeGreaterThanOrEqual(0);
          expect(state.roofSlotsUsed).toBeLessThanOrEqual(6);
        }
      })
    );
  });
});
