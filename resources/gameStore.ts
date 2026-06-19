import { create } from 'zustand'

// ─── Types ───────────────────────────────────────────────

export type HouseType = 'studio' | 'appart' | 'maison'
export type Occupants = 'solo' | 'couple' | 'famille'
export type Region = 'sud' | 'centre' | 'nord'

export type GamePhase =
  | 'LOADING'
  | 'ONBOARDING'
  | 'PLANNING'
  | 'SIMULATING'
  | 'EVENT'
  | 'RECAP'
  | 'GAME_OVER'
  | 'SCORE'

export interface UserProfile {
  houseType: HouseType | null
  occupants: Occupants | null
  region: Region | null
}

export interface Equipment {
  id: string
  name: string
  type: 'solar' | 'battery' | 'windmill' | 'thermostat' | 'led' | 'offpeak'
  count: number
  purchasedOnDay: number
}

export interface GridState {
  productionKwh: number
  consumptionKwh: number
  batteryLevel: number      // 0-10 kWh
  batteryCapacity: number   // 0 si pas de batterie, 10 si batterie installée
  gridImportKwh: number
  gridExportKwh: number
}

export interface WeatherState {
  type: 'sunny' | 'cloudy' | 'stormy' | 'hot' | 'cold' | 'normal'
  solarMultiplier: number   // 0.0 → 1.5
  windMultiplier: number    // 0.0 → 2.0
  consumptionMultiplier: number // 0.8 → 1.4
}

export interface GameEvent {
  id: string
  title: string
  description: string
  narratorText: string
  impact: Partial<WeatherState>
  duration: number // jours
}

export interface DayResult {
  day: number
  weather: WeatherState
  event: GameEvent | null
  grid: GridState
  autonomyPercent: number
  co2SavedKg: number
  costEur: number
  narratorRecap: string
}

export interface Score {
  autonomyPercent: number
  co2SavedKg: number
  budgetRemaining: number
  totalScore: number
  tier: 'pioneer' | 'transition' | 'dependent'
}

export interface GameState {
  // Meta
  phase: GamePhase
  day: number               // 1 → 7
  onboardingStep: number    // 0 → 2

  // Profil joueur
  profile: UserProfile

  // Finances
  budget: number

  // Équipements installés
  equipment: Equipment[]
  roofSlotsUsed: number     // max 6 pour panneaux solaires

  // État réseau en cours
  grid: GridState

  // Météo actuelle
  weather: WeatherState

  // Événement en cours
  currentEvent: GameEvent | null

  // Historique
  history: DayResult[]

  // Score final
  score: Score | null

  // Narrateur
  narratorMessage: string
  narratorTone: 'cinematic' | 'sarcastic'

  // Actions
  setPhase: (phase: GamePhase) => void
  setOnboardingStep: (step: number) => void
  setProfile: (profile: Partial<UserProfile>) => void
  purchaseEquipment: (equipmentId: string) => void
  advanceDay: () => void
  setWeather: (weather: WeatherState) => void
  setCurrentEvent: (event: GameEvent | null) => void
  addDayResult: (result: DayResult) => void
  setNarrator: (message: string, tone: 'cinematic' | 'sarcastic') => void
  computeFinalScore: () => void
  resetGame: () => void
}

// ─── Initial State ────────────────────────────────────────

const initialGrid: GridState = {
  productionKwh: 0,
  consumptionKwh: 0,
  batteryLevel: 0,
  batteryCapacity: 0,
  gridImportKwh: 0,
  gridExportKwh: 0,
}

const initialWeather: WeatherState = {
  type: 'normal',
  solarMultiplier: 1.0,
  windMultiplier: 1.0,
  consumptionMultiplier: 1.0,
}

const initialProfile: UserProfile = {
  houseType: null,
  occupants: null,
  region: null,
}

// ─── Store ────────────────────────────────────────────────

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'LOADING',
  day: 1,
  onboardingStep: 0,
  profile: initialProfile,
  budget: 5000,
  equipment: [],
  roofSlotsUsed: 0,
  grid: initialGrid,
  weather: initialWeather,
  currentEvent: null,
  history: [],
  score: null,
  narratorMessage: '',
  narratorTone: 'cinematic',

  setPhase: (phase) => set({ phase }),

  setOnboardingStep: (step) => set({ onboardingStep: step }),

  setProfile: (partial) =>
    set((state) => ({ profile: { ...state.profile, ...partial } })),

  purchaseEquipment: (equipmentId) => {
    const { equipment, budget, roofSlotsUsed, day } = get()
    const { EQUIPMENT_CATALOG } = require('./equipment')
    const item = EQUIPMENT_CATALOG.find((e: any) => e.id === equipmentId)
    if (!item || budget < item.cost) return

    const existing = equipment.find((e) => e.id === equipmentId)
    if (item.type === 'solar' && roofSlotsUsed >= 6) return
    if (item.unique && existing) return

    set((state) => ({
      budget: state.budget - item.cost,
      roofSlotsUsed: item.type === 'solar' ? state.roofSlotsUsed + 1 : state.roofSlotsUsed,
      equipment: existing
        ? state.equipment.map((e) =>
            e.id === equipmentId ? { ...e, count: e.count + 1 } : e
          )
        : [...state.equipment, { ...item, count: 1, purchasedOnDay: day }],
    }))
  },

  advanceDay: () => set((state) => ({ day: state.day + 1 })),

  setWeather: (weather) => set({ weather }),

  setCurrentEvent: (event) => set({ currentEvent: event }),

  addDayResult: (result) =>
    set((state) => ({ history: [...state.history, result] })),

  setNarrator: (message, tone) =>
    set({ narratorMessage: message, narratorTone: tone }),

  computeFinalScore: () => {
    const { history, budget } = get()
    const totalConsumption = history.reduce((acc, d) => acc + d.grid.consumptionKwh, 0)
    const totalImport = history.reduce((acc, d) => acc + d.grid.gridImportKwh, 0)
    const autonomyPercent = totalConsumption > 0
      ? Math.round(((totalConsumption - totalImport) / totalConsumption) * 100)
      : 0
    const co2SavedKg = history.reduce((acc, d) => acc + d.co2SavedKg, 0)
    const totalScore = Math.round(
      autonomyPercent * 0.5 + co2SavedKg * 0.5 + budget / 100
    )
    const tier =
      totalScore > 80 ? 'pioneer' : totalScore > 50 ? 'transition' : 'dependent'

    set({ score: { autonomyPercent, co2SavedKg, budgetRemaining: budget, totalScore, tier } })
  },

  resetGame: () =>
    set({
      phase: 'LOADING',
      day: 1,
      onboardingStep: 0,
      profile: initialProfile,
      budget: 5000,
      equipment: [],
      roofSlotsUsed: 0,
      grid: initialGrid,
      weather: initialWeather,
      currentEvent: null,
      history: [],
      score: null,
      narratorMessage: '',
    }),
}))
