import type { GameEvent, WeatherState } from '../../store/gameStore'
import type { Region } from '../../store/gameStore'
import { EVENT_WEIGHTS } from '../data/profiles'

export const GAME_EVENTS: GameEvent[] = [
  {
    id: 'sunny',
    title: '☀️ Journée exceptionnelle',
    description: 'Ciel dégagé toute la journée. Tes panneaux vont cartonner.',
    narratorText: 'Le soleil est avec toi aujourd'hui. Ne gâche pas ça.',
    impact: { type: 'sunny', solarMultiplier: 1.5, windMultiplier: 0.8, consumptionMultiplier: 1.0 },
    duration: 1,
  },
  {
    id: 'cloudy',
    title: '☁️ Ciel couvert',
    description: 'Nuages épais toute la journée. Production solaire en chute.',
    narratorText: 'Tes panneaux regardent des nuages. La batterie va trinquer.',
    impact: { type: 'cloudy', solarMultiplier: 0.3, windMultiplier: 1.2, consumptionMultiplier: 1.0 },
    duration: 1,
  },
  {
    id: 'stormy',
    title: '🌪️ Tempête',
    description: 'Éolienne mise hors service. Solaire divisé par deux.',
    narratorText: 'La tempête ne pardonne pas. Espérons que tu as une batterie.',
    impact: { type: 'stormy', solarMultiplier: 0.2, windMultiplier: 0.0, consumptionMultiplier: 1.1 },
    duration: 2,
  },
  {
    id: 'heatwave',
    title: '🥵 Canicule',
    description: 'Température record. La climatisation explose ta consommation.',
    narratorText: 'La canicule frappe. Ta clim aussi. Bonne chance.',
    impact: { type: 'hot', solarMultiplier: 1.2, windMultiplier: 0.7, consumptionMultiplier: 1.4 },
    duration: 1,
  },
  {
    id: 'cold',
    title: '❄️ Vague de froid',
    description: 'Gel nocturne. Le chauffage tourne à plein régime.',
    narratorText: 'Il gèle. Ton thermostat intelligent va enfin servir à quelque chose.',
    impact: { type: 'cold', solarMultiplier: 0.8, windMultiplier: 1.3, consumptionMultiplier: 1.35 },
    duration: 1,
  },
  {
    id: 'blackout',
    title: '⚡ Panne réseau quartier',
    description: 'Réseau EDF coupé 24h. Tu dois survivre en autonomie totale.',
    narratorText: 'Le réseau tombe. C'est toi contre le noir. Montre ce que tu vaux.',
    impact: { type: 'normal', solarMultiplier: 1.0, windMultiplier: 1.0, consumptionMultiplier: 1.0 },
    duration: 1,
  },
  {
    id: 'gridprice',
    title: '📈 Pic de prix électricité',
    description: 'Le prix du kWh double aujourd'hui. Chaque kWh importé coûte cher.',
    narratorText: 'Le marché s'emballe. Chaque kWh que tu achètes au réseau te coûte le double.',
    impact: { type: 'normal', solarMultiplier: 1.0, windMultiplier: 1.0, consumptionMultiplier: 1.0 },
    duration: 1,
  },
  {
    id: 'nightgaming',
    title: '🎮 Soirée gaming',
    description: 'Grosse session nocturne détectée. Consommation nuit +25%.',
    narratorText: 'On a détecté un pic inhabituel après minuit. On ne dit rien. Mais on note.',
    impact: { type: 'normal', solarMultiplier: 1.0, windMultiplier: 1.0, consumptionMultiplier: 1.25 },
    duration: 1,
  },
]

// ─── Sélection aléatoire pondérée ─────────────────────────
export function pickRandomEvent(region: Region, day: number): GameEvent | null {
  // Pas d'événement tous les jours
  if (day % 2 === 0 && Math.random() > 0.6) return null
  if (day % 2 !== 0 && Math.random() > 0.4) return null

  const weights = EVENT_WEIGHTS[region]
  const total = Object.values(weights).reduce((a, b) => a + b, 0)
  let rand = Math.random() * total

  for (const [eventId, weight] of Object.entries(weights)) {
    rand -= weight
    if (rand <= 0) {
      return GAME_EVENTS.find((e) => e.id === eventId) || null
    }
  }
  return null
}
