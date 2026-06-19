import {
  CONSUMPTION_KWH_DAY,
  SOLAR_PEAK_HOURS,
  RTE_CARBON_INTENSITY_G_KWH,
  EDF_PRICE_KWH,
} from '../data/profiles'
import type { UserProfile, Equipment, GridState, WeatherState } from '../../store/gameStore'

// ─── Production solaire ───────────────────────────────────
export function calcSolarProduction(
  equipment: Equipment[],
  weather: WeatherState,
  region: NonNullable<UserProfile['region']>
): number {
  const panels = equipment.find((e) => e.type === 'solar')
  if (!panels) return 0
  const peakHours = SOLAR_PEAK_HOURS[region]
  const kwPerPanel = 0.4  // 400W panel standard
  return panels.count * kwPerPanel * peakHours * weather.solarMultiplier
}

// ─── Production éolienne ──────────────────────────────────
export function calcWindProduction(
  equipment: Equipment[],
  weather: WeatherState
): number {
  const windmill = equipment.find((e) => e.type === 'windmill')
  if (!windmill) return 0
  return 2.0 * weather.windMultiplier  // 2 kWh/jour base × multiplicateur
}

// ─── Consommation journalière ─────────────────────────────
export function calcConsumption(
  profile: UserProfile,
  equipment: Equipment[],
  weather: WeatherState
): number {
  if (!profile.houseType || !profile.occupants) return 0

  let base = CONSUMPTION_KWH_DAY[profile.houseType][profile.occupants]

  // Modificateurs équipements
  const hasThermostat = equipment.some((e) => e.type === 'thermostat')
  const hasLed = equipment.some((e) => e.type === 'led')
  const hasOffpeak = equipment.some((e) => e.type === 'offpeak')

  if (hasThermostat) base *= 0.85
  if (hasLed) base *= 0.95
  if (hasOffpeak) base *= 0.90

  // Modificateur météo
  base *= weather.consumptionMultiplier

  return Math.round(base * 100) / 100
}

// ─── Simulation d'une journée complète ───────────────────
export function simulateDay(
  profile: UserProfile,
  equipment: Equipment[],
  weather: WeatherState,
  currentBatteryLevel: number,
  batteryCapacity: number
): GridState {
  if (!profile.region) throw new Error('Profile region is required')

  const production =
    calcSolarProduction(equipment, weather, profile.region) +
    calcWindProduction(equipment, weather)

  const consumption = calcConsumption(profile, equipment, weather)

  let batteryLevel = currentBatteryLevel
  let gridImport = 0
  let gridExport = 0

  const surplus = production - consumption

  if (surplus >= 0) {
    // Production > consommation — on charge la batterie ou on exporte
    const canCharge = Math.min(surplus, batteryCapacity - batteryLevel)
    batteryLevel += canCharge
    gridExport = Math.max(0, surplus - canCharge)
  } else {
    // Consommation > production — on décharge la batterie ou on importe
    const deficit = Math.abs(surplus)
    const canDischarge = Math.min(deficit, batteryLevel)
    batteryLevel -= canDischarge
    gridImport = Math.max(0, deficit - canDischarge)
  }

  return {
    productionKwh: Math.round(production * 100) / 100,
    consumptionKwh: Math.round(consumption * 100) / 100,
    batteryLevel: Math.round(batteryLevel * 100) / 100,
    batteryCapacity,
    gridImportKwh: Math.round(gridImport * 100) / 100,
    gridExportKwh: Math.round(gridExport * 100) / 100,
  }
}

// ─── Calcul CO₂ évité ─────────────────────────────────────
export function calcCO2Saved(
  gridImportKwh: number,
  baseConsumptionKwh: number,
  region: NonNullable<UserProfile['region']>
): number {
  const intensityGPerKwh = RTE_CARBON_INTENSITY_G_KWH[region]
  const savedKwh = Math.max(0, baseConsumptionKwh - gridImportKwh)
  return Math.round((savedKwh * intensityGPerKwh) / 1000 * 100) / 100 // en kg
}

// ─── Calcul coût journalier ───────────────────────────────
export function calcDayCost(gridImportKwh: number): number {
  return Math.round(gridImportKwh * EDF_PRICE_KWH * 100) / 100
}

// ─── Autonomie journalière ────────────────────────────────
export function calcAutonomy(grid: GridState): number {
  if (grid.consumptionKwh === 0) return 100
  const selfCovered = grid.consumptionKwh - grid.gridImportKwh
  return Math.round((selfCovered / grid.consumptionKwh) * 100)
}
