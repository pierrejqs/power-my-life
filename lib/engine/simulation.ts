import {
  CONSUMPTION_KWH_DAY,
  EDF_PRICE_KWH,
  RTE_CARBON_INTENSITY_G_KWH,
  SOLAR_PEAK_HOURS,
} from "@/lib/data/profiles";
import type { Equipment, GridState, UserProfile, WeatherState } from "@/lib/types/game";

export function calcSolarProduction(
  equipment: Equipment[],
  weather: WeatherState,
  region: NonNullable<UserProfile["region"]>
): number {
  const panels = equipment.find((item) => item.type === "solar");
  if (!panels) {
    return 0;
  }

  const kwPerPanel = 0.4;
  return panels.count * kwPerPanel * SOLAR_PEAK_HOURS[region] * weather.solarMultiplier;
}

export function calcWindProduction(equipment: Equipment[], weather: WeatherState): number {
  const windmill = equipment.find((item) => item.type === "windmill");
  if (!windmill) {
    return 0;
  }
  return 2 * weather.windMultiplier;
}

export function calcConsumption(
  profile: UserProfile,
  equipment: Equipment[],
  weather: WeatherState
): number {
  if (!profile.houseType || !profile.occupants) {
    return 0;
  }

  let base = CONSUMPTION_KWH_DAY[profile.houseType][profile.occupants];

  if (equipment.some((item) => item.type === "thermostat")) {
    base *= 0.85;
  }
  if (equipment.some((item) => item.type === "led")) {
    base *= 0.95;
  }
  if (equipment.some((item) => item.type === "offpeak")) {
    base *= 0.9;
  }

  base *= weather.consumptionMultiplier;
  return round(base);
}

export function simulateDay(
  profile: UserProfile,
  equipment: Equipment[],
  weather: WeatherState,
  currentBatteryLevel: number,
  batteryCapacity: number
): GridState {
  if (!profile.region) {
    throw new Error("Profile region is required");
  }

  const production =
    calcSolarProduction(equipment, weather, profile.region) +
    calcWindProduction(equipment, weather);
  const consumption = calcConsumption(profile, equipment, weather);

  let batteryLevel = currentBatteryLevel;
  let gridImport = 0;
  let gridExport = 0;

  const surplus = production - consumption;

  if (surplus >= 0) {
    const canCharge = Math.min(surplus, batteryCapacity - batteryLevel);
    batteryLevel += canCharge;
    gridExport = Math.max(0, surplus - canCharge);
  } else {
    const deficit = Math.abs(surplus);
    const canDischarge = Math.min(deficit, batteryLevel);
    batteryLevel -= canDischarge;
    gridImport = Math.max(0, deficit - canDischarge);
  }

  return {
    productionKwh: round(production),
    consumptionKwh: round(consumption),
    batteryLevel: round(batteryLevel),
    batteryCapacity: round(batteryCapacity),
    gridImportKwh: round(gridImport),
    gridExportKwh: round(gridExport),
  };
}

export function calcCO2Saved(
  gridImportKwh: number,
  baseConsumptionKwh: number,
  region: NonNullable<UserProfile["region"]>
): number {
  const intensity = RTE_CARBON_INTENSITY_G_KWH[region];
  const savedKwh = Math.max(0, baseConsumptionKwh - gridImportKwh);
  return round((savedKwh * intensity) / 1000);
}

export function calcDayCost(gridImportKwh: number, multiplier = 1): number {
  return round(gridImportKwh * EDF_PRICE_KWH * multiplier);
}

export function calcAutonomy(grid: GridState): number {
  if (grid.consumptionKwh === 0) {
    return 100;
  }
  const selfCovered = grid.consumptionKwh - grid.gridImportKwh;
  return Math.round((selfCovered / grid.consumptionKwh) * 100);
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
