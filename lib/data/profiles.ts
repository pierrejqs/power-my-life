import type { HouseType, Occupants, Region } from "@/lib/types/game";

export const CONSUMPTION_KWH_DAY: Record<HouseType, Record<Occupants, number>> = {
  studio: { solo: 8, couple: 11, famille: 14 },
  appart: { solo: 12, couple: 17, famille: 22 },
  maison: { solo: 18, couple: 25, famille: 35 },
};

export const SOLAR_PEAK_HOURS: Record<Region, number> = {
  sud: 5.5,
  centre: 3.8,
  nord: 2.9,
};

export const RTE_CARBON_INTENSITY_G_KWH: Record<Region, number> = {
  sud: 58,
  centre: 52,
  nord: 48,
};

export const EDF_PRICE_KWH = 0.2516;
export const INITIAL_BUDGET = 5000;

export const ROOF_SLOTS: Record<HouseType, number> = {
  studio: 2,
  appart: 3,
  maison: 6,
};

export const EVENT_WEIGHTS: Record<Region, Record<string, number>> = {
  sud: {
    heatwave: 0.25,
    cold: 0.05,
    sunny: 0.2,
    cloudy: 0.1,
    stormy: 0.1,
    gridprice: 0.1,
    nightgaming: 0.15,
    blackout: 0.05,
  },
  centre: {
    heatwave: 0.1,
    cold: 0.12,
    sunny: 0.15,
    cloudy: 0.2,
    stormy: 0.1,
    gridprice: 0.1,
    nightgaming: 0.15,
    blackout: 0.08,
  },
  nord: {
    heatwave: 0.05,
    cold: 0.2,
    sunny: 0.08,
    cloudy: 0.25,
    stormy: 0.15,
    gridprice: 0.1,
    nightgaming: 0.12,
    blackout: 0.05,
  },
};

export const HOUSE_VISUAL: Record<
  HouseType,
  {
    modelPath: string;
    scale: [number, number, number];
    hasGarden: boolean;
    hasGarage: boolean;
  }
> = {
  studio: {
    modelPath: "/models/house-studio.glb",
    scale: [0.8, 0.8, 0.8],
    hasGarden: false,
    hasGarage: false,
  },
  appart: {
    modelPath: "/models/house-appart.glb",
    scale: [1, 1, 1],
    hasGarden: false,
    hasGarage: false,
  },
  maison: {
    modelPath: "/models/house-maison.glb",
    scale: [1.2, 1.2, 1.2],
    hasGarden: true,
    hasGarage: true,
  },
};
