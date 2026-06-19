"use client";

import { create } from "zustand";

import { INITIAL_BUDGET } from "@/lib/data/profiles";
import { applyEquipmentPurchase } from "@/lib/engine/purchases";
import { computeScore } from "@/lib/engine/scoring";
import type {
  DayResult,
  Equipment,
  GameEvent,
  GamePhase,
  GridState,
  Score,
  UserProfile,
  WeatherState,
} from "@/lib/types/game";

export type {
  DayResult,
  Equipment,
  GameEvent,
  GamePhase,
  GridState,
  Score,
  UserProfile,
  WeatherState,
} from "@/lib/types/game";

export interface GameState {
  phase: GamePhase;
  day: number;
  onboardingStep: number;
  profile: UserProfile;
  budget: number;
  equipment: Equipment[];
  roofSlotsUsed: number;
  grid: GridState;
  weather: WeatherState;
  currentEvent: GameEvent | null;
  history: DayResult[];
  score: Score | null;
  narratorMessage: string;
  narratorTone: "cinematic" | "sarcastic";
  isDaytime: boolean;
  isShopSheetOpen: boolean;
  pendingDayStart: boolean;
  eventAcknowledged: boolean;
  setPhase: (phase: GamePhase) => void;
  setOnboardingStep: (step: number) => void;
  setProfile: (profile: Partial<UserProfile>) => void;
  purchaseEquipment: (equipmentId: string) => void;
  requestDayStart: () => void;
  acknowledgeEvent: () => void;
  clearPendingDayStart: () => void;
  clearEventAcknowledged: () => void;
  advanceDay: () => void;
  setWeather: (weather: WeatherState) => void;
  setCurrentEvent: (event: GameEvent | null) => void;
  addDayResult: (result: DayResult) => void;
  setGrid: (grid: GridState) => void;
  setNarrator: (message: string, tone: "cinematic" | "sarcastic") => void;
  setIsDaytime: (isDaytime: boolean) => void;
  setShopSheetOpen: (isOpen: boolean) => void;
  computeFinalScore: () => void;
  resetGame: () => void;
}

export const initialGrid: GridState = {
  productionKwh: 0,
  consumptionKwh: 0,
  batteryLevel: 0,
  batteryCapacity: 0,
  gridImportKwh: 0,
  gridExportKwh: 0,
};

export const initialWeather: WeatherState = {
  type: "normal",
  solarMultiplier: 1,
  windMultiplier: 1,
  consumptionMultiplier: 1,
};

export const initialProfile: UserProfile = {
  houseType: null,
  occupants: null,
  region: null,
};

export const useGameStore = create<GameState>((set, get) => ({
  phase: "LOADING",
  day: 1,
  onboardingStep: 0,
  profile: initialProfile,
  budget: INITIAL_BUDGET,
  equipment: [],
  roofSlotsUsed: 0,
  grid: initialGrid,
  weather: initialWeather,
  currentEvent: null,
  history: [],
  score: null,
  narratorMessage: "",
  narratorTone: "cinematic",
  isDaytime: true,
  isShopSheetOpen: true,
  pendingDayStart: false,
  eventAcknowledged: false,
  setPhase: (phase) => set({ phase }),
  setOnboardingStep: (onboardingStep) => set({ onboardingStep }),
  setProfile: (partial) => set((state) => ({ profile: { ...state.profile, ...partial } })),
  purchaseEquipment: (equipmentId) =>
    set((state) => {
      const applied = applyEquipmentPurchase(
        {
          budget: state.budget,
          equipment: state.equipment,
          roofSlotsUsed: state.roofSlotsUsed,
          day: state.day,
          profile: state.profile,
        },
        equipmentId
      );

      return {
        budget: applied.budget,
        equipment: applied.equipment,
        roofSlotsUsed: applied.roofSlotsUsed,
        grid: { ...state.grid, batteryCapacity: applied.batteryCapacity },
      };
    }),
  requestDayStart: () => set({ pendingDayStart: true }),
  acknowledgeEvent: () => set({ eventAcknowledged: true }),
  clearPendingDayStart: () => set({ pendingDayStart: false }),
  clearEventAcknowledged: () => set({ eventAcknowledged: false }),
  advanceDay: () => set((state) => ({ day: state.day + 1 })),
  setWeather: (weather) => set({ weather }),
  setCurrentEvent: (currentEvent) => set({ currentEvent }),
  addDayResult: (result) => set((state) => ({ history: [...state.history, result] })),
  setGrid: (grid) => set({ grid }),
  setNarrator: (narratorMessage, narratorTone) => set({ narratorMessage, narratorTone }),
  setIsDaytime: (isDaytime) => set({ isDaytime }),
  setShopSheetOpen: (isShopSheetOpen) => set({ isShopSheetOpen }),
  computeFinalScore: () => {
    const { history, budget } = get();
    set({ score: computeScore(history, budget) });
  },
  resetGame: () =>
    set({
      phase: "LOADING",
      day: 1,
      onboardingStep: 0,
      profile: initialProfile,
      budget: INITIAL_BUDGET,
      equipment: [],
      roofSlotsUsed: 0,
      grid: initialGrid,
      weather: initialWeather,
      currentEvent: null,
      history: [],
      score: null,
      narratorMessage: "",
      narratorTone: "cinematic",
      isDaytime: true,
      isShopSheetOpen: true,
      pendingDayStart: false,
      eventAcknowledged: false,
    }),
}));
