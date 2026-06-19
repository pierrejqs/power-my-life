export type HouseType = "studio" | "appart" | "maison";
export type Occupants = "solo" | "couple" | "famille";
export type Region = "sud" | "centre" | "nord";

export type GamePhase =
  | "LOADING"
  | "ONBOARDING"
  | "PLANNING"
  | "EVENT"
  | "SIMULATING"
  | "RECAP"
  | "SCORE";

export interface UserProfile {
  houseType: HouseType | null;
  occupants: Occupants | null;
  region: Region | null;
}

export interface Equipment {
  id: string;
  name: string;
  type: "solar" | "battery" | "windmill" | "thermostat" | "led" | "offpeak";
  count: number;
  purchasedOnDay: number;
}

export interface GridState {
  productionKwh: number;
  consumptionKwh: number;
  batteryLevel: number;
  batteryCapacity: number;
  gridImportKwh: number;
  gridExportKwh: number;
}

export interface WeatherState {
  type: "sunny" | "cloudy" | "stormy" | "hot" | "cold" | "normal";
  solarMultiplier: number;
  windMultiplier: number;
  consumptionMultiplier: number;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  narratorText: string;
  impact: Partial<WeatherState>;
  duration: number;
}

export interface DayResult {
  day: number;
  weather: WeatherState;
  event: GameEvent | null;
  grid: GridState;
  autonomyPercent: number;
  co2SavedKg: number;
  costEur: number;
  narratorRecap: string;
}

export interface Score {
  autonomyPercent: number;
  co2SavedKg: number;
  budgetRemaining: number;
  totalScore: number;
  tier: "pioneer" | "transition" | "dependent";
}

export interface PurchaseAvailability {
  allowed: boolean;
  reason?:
    | "missing_profile"
    | "insufficient_budget"
    | "unique_owned"
    | "needs_garden"
    | "roof_full";
}
