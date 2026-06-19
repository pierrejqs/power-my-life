import { EVENT_WEIGHTS } from "@/lib/data/profiles";
import type { GameEvent, Region, WeatherState } from "@/lib/types/game";

export const GAME_EVENTS: GameEvent[] = [
  {
    id: "sunny",
    title: "Journee exceptionnelle",
    description: "Le ciel reste clair toute la journee. Les panneaux prennent l'avantage.",
    narratorText: "Le soleil joue pour toi. Autant en profiter.",
    impact: { type: "sunny", solarMultiplier: 1.5, windMultiplier: 0.8, consumptionMultiplier: 1 },
    duration: 1,
  },
  {
    id: "cloudy",
    title: "Ciel couvert",
    description: "Des nuages epais freinent la production solaire.",
    narratorText: "Tes panneaux regardent du gris. La batterie va parler.",
    impact: { type: "cloudy", solarMultiplier: 0.3, windMultiplier: 1.2, consumptionMultiplier: 1 },
    duration: 1,
  },
  {
    id: "stormy",
    title: "Tempete",
    description: "La production devient instable et l'eolienne s'arrete.",
    narratorText: "Le vent est violent, pas toujours utile.",
    impact: { type: "stormy", solarMultiplier: 0.2, windMultiplier: 0, consumptionMultiplier: 1.1 },
    duration: 2,
  },
  {
    id: "heatwave",
    title: "Canicule",
    description: "La climatisation tire fort sur la consommation.",
    narratorText: "Le soleil produit, la chaleur depense. Bel equilibre.",
    impact: { type: "hot", solarMultiplier: 1.2, windMultiplier: 0.7, consumptionMultiplier: 1.4 },
    duration: 1,
  },
  {
    id: "cold",
    title: "Vague de froid",
    description: "Le chauffage pousse la demande au-dessus de la normale.",
    narratorText: "Le froid n'a aucune patience pour les plans fragiles.",
    impact: { type: "cold", solarMultiplier: 0.8, windMultiplier: 1.3, consumptionMultiplier: 1.35 },
    duration: 1,
  },
  {
    id: "blackout",
    title: "Panne reseau quartier",
    description: "Le quartier perd le reseau pendant vingt-quatre heures.",
    narratorText: "Plus de filet. On voit ce que l'autonomie veut vraiment dire.",
    impact: { type: "normal", solarMultiplier: 1, windMultiplier: 1, consumptionMultiplier: 1 },
    duration: 1,
  },
  {
    id: "gridprice",
    title: "Pic de prix electricite",
    description: "Chaque kWh importe devient brutalement plus cher.",
    narratorText: "Le reseau reste disponible. Il devient juste bien moins sympathique.",
    impact: { type: "normal", solarMultiplier: 1, windMultiplier: 1, consumptionMultiplier: 1 },
    duration: 1,
  },
  {
    id: "nightgaming",
    title: "Soiree gaming",
    description: "La consommation de nuit grimpe plus que prevu.",
    narratorText: "On a observe une activite nocturne tres appliquee.",
    impact: { type: "normal", solarMultiplier: 1, windMultiplier: 1, consumptionMultiplier: 1.25 },
    duration: 1,
  },
];

const BASE_WEATHER_BY_REGION: Record<Region, WeatherState[]> = {
  sud: [
    { type: "sunny", solarMultiplier: 1.15, windMultiplier: 0.9, consumptionMultiplier: 1 },
    { type: "normal", solarMultiplier: 1, windMultiplier: 1, consumptionMultiplier: 1 },
    { type: "hot", solarMultiplier: 1.1, windMultiplier: 0.8, consumptionMultiplier: 1.15 },
  ],
  centre: [
    { type: "normal", solarMultiplier: 1, windMultiplier: 1, consumptionMultiplier: 1 },
    { type: "cloudy", solarMultiplier: 0.75, windMultiplier: 1.1, consumptionMultiplier: 1 },
    { type: "cold", solarMultiplier: 0.85, windMultiplier: 1.05, consumptionMultiplier: 1.1 },
  ],
  nord: [
    { type: "cloudy", solarMultiplier: 0.7, windMultiplier: 1.1, consumptionMultiplier: 1 },
    { type: "normal", solarMultiplier: 0.9, windMultiplier: 1.15, consumptionMultiplier: 1 },
    { type: "cold", solarMultiplier: 0.8, windMultiplier: 1.2, consumptionMultiplier: 1.12 },
  ],
};

export function getBaseWeather(region: Region, day: number): WeatherState {
  const pool = BASE_WEATHER_BY_REGION[region];
  return pool[(day - 1) % pool.length];
}

export function resolveWeatherForDay(
  region: Region,
  day: number,
  event: GameEvent | null
): WeatherState {
  const base = getBaseWeather(region, day);
  return event ? { ...base, ...event.impact } : base;
}

export function pickRandomEvent(region: Region, day: number): GameEvent | null {
  const shouldTryEvent = day % 2 === 1 ? Math.random() <= 0.6 : Math.random() <= 0.4;
  if (!shouldTryEvent) {
    return null;
  }

  const weights = EVENT_WEIGHTS[region];
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
  let cursor = Math.random() * total;

  for (const [eventId, weight] of Object.entries(weights)) {
    cursor -= weight;
    if (cursor <= 0) {
      return GAME_EVENTS.find((event) => event.id === eventId) ?? null;
    }
  }

  return null;
}
