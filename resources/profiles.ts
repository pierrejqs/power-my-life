// Données calibrées ADEME 2024 + RTE eCO2mix
// Source : Base Carbone ADEME + données régionales RTE

import type { HouseType, Occupants, Region } from '../store/gameStore'

// ─── Consommation journalière de base (kWh/jour) ─────────
export const CONSUMPTION_KWH_DAY: Record<HouseType, Record<Occupants, number>> = {
  studio: { solo: 8,  couple: 11, famille: 14 },
  appart: { solo: 12, couple: 17, famille: 22 },
  maison: { solo: 18, couple: 25, famille: 35 },
}

// ─── Potentiel solaire (heures équivalent plein soleil/jour) ─
export const SOLAR_PEAK_HOURS: Record<Region, number> = {
  sud:    5.5,
  centre: 3.8,
  nord:   2.9,
}

// ─── Intensité carbone du réseau (gCO₂/kWh) ─────────────
// Source : RTE eCO2mix moyennes régionales annuelles
export const RTE_CARBON_INTENSITY_G_KWH: Record<Region, number> = {
  sud:    58,
  centre: 52,
  nord:   48,
}

// ─── Prix kWh (€) ────────────────────────────────────────
// Source : EDF Tarif Bleu 2026
export const EDF_PRICE_KWH = 0.2516

// ─── Budget initial ───────────────────────────────────────
export const INITIAL_BUDGET = 5000

// ─── Surface toit disponible (slots panneaux) ────────────
export const ROOF_SLOTS: Record<HouseType, number> = {
  studio: 2,
  appart: 3,
  maison: 6,
}

// ─── Pondération événements par région ───────────────────
export const EVENT_WEIGHTS: Record<Region, Record<string, number>> = {
  sud: {
    heatwave:    0.25,
    cold:        0.05,
    sunny:       0.20,
    cloudy:      0.10,
    stormy:      0.10,
    gridprice:   0.10,
    nightgaming: 0.15,
    blackout:    0.05,
  },
  centre: {
    heatwave:    0.10,
    cold:        0.12,
    sunny:       0.15,
    cloudy:      0.20,
    stormy:      0.10,
    gridprice:   0.10,
    nightgaming: 0.15,
    blackout:    0.08,
  },
  nord: {
    heatwave:    0.05,
    cold:        0.20,
    sunny:       0.08,
    cloudy:      0.25,
    stormy:      0.15,
    gridprice:   0.10,
    nightgaming: 0.12,
    blackout:    0.05,
  },
}

// ─── Profil visuel de la maison ───────────────────────────
export const HOUSE_VISUAL: Record<HouseType, {
  modelPath: string
  scale: [number, number, number]
  hasGarden: boolean
  hasGarage: boolean
}> = {
  studio: {
    modelPath: '/models/house-studio.glb',
    scale: [0.6, 0.6, 0.6],
    hasGarden: false,
    hasGarage: false,
  },
  appart: {
    modelPath: '/models/house-appart.glb',
    scale: [0.9, 0.9, 0.9],
    hasGarden: false,
    hasGarage: false,
  },
  maison: {
    modelPath: '/models/house-maison.glb',
    scale: [1.2, 1.2, 1.2],
    hasGarden: true,
    hasGarage: true,
  },
}
