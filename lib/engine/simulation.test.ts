import { describe, expect, it } from "vitest";
import * as fc from "fast-check";

import type { Equipment, UserProfile, WeatherState } from "@/lib/types/game";
import {
  calcAutonomy,
  calcCO2Saved,
  calcConsumption,
  calcDayCost,
  calcSolarProduction,
  calcWindProduction,
  simulateDay,
} from "@/lib/engine/simulation";

const profile: UserProfile = {
  houseType: "maison",
  occupants: "couple",
  region: "sud",
};

const fairWeather: WeatherState = {
  type: "normal",
  solarMultiplier: 1,
  windMultiplier: 1,
  consumptionMultiplier: 1,
};

const equipment: Equipment[] = [
  { id: "solar-panel", name: "Panneau solaire", type: "solar", count: 2, purchasedOnDay: 1 },
  { id: "battery", name: "Batterie domestique", type: "battery", count: 1, purchasedOnDay: 1 },
  { id: "windmill", name: "Micro-eolienne", type: "windmill", count: 1, purchasedOnDay: 1 },
];

describe("simulation", () => {
  it("computes solar and wind production from catalog and weather", () => {
    expect(calcSolarProduction(equipment, fairWeather, "sud")).toBe(4.4);
    expect(calcWindProduction(equipment, fairWeather)).toBe(2);
  });

  it("applies efficiency equipment and weather to consumption", () => {
    const optimised = calcConsumption(
      profile,
      [
        { id: "thermostat", name: "Thermostat intelligent", type: "thermostat", count: 1, purchasedOnDay: 1 },
        { id: "led", name: "Ampoules LED", type: "led", count: 1, purchasedOnDay: 1 },
      ],
      fairWeather
    );

    expect(optimised).toBe(20.19);
  });

  it("charges and discharges the battery before importing or exporting", () => {
    const result = simulateDay(profile, equipment, fairWeather, 4, 10);

    expect(result.productionKwh).toBe(6.4);
    expect(result.gridImportKwh).toBeGreaterThan(0);
    expect(result.batteryLevel).toBe(0);
    expect(calcAutonomy(result)).toBeGreaterThanOrEqual(0);
  });

  it("computes cost and CO2 savings", () => {
    expect(calcDayCost(10)).toBe(2.52);
    expect(calcCO2Saved(6, 10, "sud")).toBe(0.23);
  });

  it("maintains core grid invariants across arbitrary values", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 1.5, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0, max: 2, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0.8, max: 1.4, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0, max: 10, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0, max: 10, noNaN: true, noDefaultInfinity: true }),
        (solarMultiplier, windMultiplier, consumptionMultiplier, batteryLevel, capacity) => {
          const weather: WeatherState = {
            type: "normal",
            solarMultiplier,
            windMultiplier,
            consumptionMultiplier,
          };

          const result = simulateDay(
            profile,
            equipment,
            weather,
            Math.min(batteryLevel, capacity),
            capacity
          );

          expect(result.batteryLevel).toBeGreaterThanOrEqual(0);
          expect(result.batteryLevel).toBeLessThanOrEqual(capacity + 0.01);
          expect(result.gridImportKwh).toBeGreaterThanOrEqual(0);
          expect(result.gridExportKwh).toBeGreaterThanOrEqual(0);
        }
      )
    );
  });
});
