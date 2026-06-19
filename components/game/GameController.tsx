"use client";

import { useEffect } from "react";

import { NARRATOR_PLANNING, getNarratorRecap } from "@/lib/data/narrator";
import { pickRandomEvent, resolveWeatherForDay } from "@/lib/engine/events";
import {
  calcAutonomy,
  calcCO2Saved,
  calcConsumption,
  calcDayCost,
  simulateDay,
} from "@/lib/engine/simulation";
import { useGameStore } from "@/store/gameStore";

export function GameController() {
  const {
    phase,
    profile,
    equipment,
    grid,
    weather,
    day,
    currentEvent,
    pendingDayStart,
    eventAcknowledged,
    setPhase,
    setWeather,
    setCurrentEvent,
    clearPendingDayStart,
    clearEventAcknowledged,
    setNarrator,
    setGrid,
    setIsDaytime,
    addDayResult,
    advanceDay,
    computeFinalScore,
  } = useGameStore();

  useEffect(() => {
    if (phase !== "LOADING") {
      return;
    }

    const timer = window.setTimeout(() => {
      setNarrator("Quelque part en France, une maison attend son arbitrage.", "cinematic");
      setPhase("ONBOARDING");
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [phase, setNarrator, setPhase]);

  useEffect(() => {
    if (phase !== "PLANNING" || !pendingDayStart || !profile.region) {
      return;
    }

    clearPendingDayStart();

    const event = pickRandomEvent(profile.region, day);
    const dailyWeather = resolveWeatherForDay(profile.region, day, event);
    setWeather(dailyWeather);

    if (event) {
      setCurrentEvent(event);
      setNarrator(event.narratorText, "sarcastic");
      setPhase("EVENT");
      return;
    }

    setCurrentEvent(null);
    setPhase("SIMULATING");
  }, [
    clearPendingDayStart,
    day,
    pendingDayStart,
    phase,
    profile.region,
    setCurrentEvent,
    setNarrator,
    setPhase,
    setWeather,
  ]);

  useEffect(() => {
    if (phase !== "EVENT" || !eventAcknowledged) {
      return;
    }

    clearEventAcknowledged();
    setPhase("SIMULATING");
  }, [clearEventAcknowledged, eventAcknowledged, phase, setPhase]);

  useEffect(() => {
    if (phase !== "SIMULATING" || !profile.region) {
      return;
    }

    const priceMultiplier = currentEvent?.id === "gridprice" ? 2 : 1;
    const result = simulateDay(
      profile,
      equipment,
      weather,
      grid.batteryLevel,
      grid.batteryCapacity
    );
    const baseConsumption = calcConsumption(profile, equipment, weather);
    const autonomyPercent = calcAutonomy(result);
    const co2SavedKg = calcCO2Saved(result.gridImportKwh, baseConsumption, profile.region);
    const costEur = calcDayCost(result.gridImportKwh, priceMultiplier);
    const recap = getNarratorRecap(autonomyPercent, day);

    setGrid(result);
    setNarrator("Simulation en cours. La maison traverse sa journee.", "cinematic");
    setIsDaytime(true);

    const duskTimer = window.setTimeout(() => {
      setIsDaytime(false);
    }, 2500);

    const recapTimer = window.setTimeout(() => {
      addDayResult({
        day,
        weather,
        event: currentEvent,
        grid: result,
        autonomyPercent,
        co2SavedKg,
        costEur,
        narratorRecap: recap.text,
      });
      setNarrator(recap.text, recap.tone);
      setPhase("RECAP");
    }, 5000);

    return () => {
      window.clearTimeout(duskTimer);
      window.clearTimeout(recapTimer);
    };
  }, [
    addDayResult,
    currentEvent,
    day,
    equipment,
    grid.batteryCapacity,
    grid.batteryLevel,
    phase,
    profile,
    setGrid,
    setIsDaytime,
    setNarrator,
    setPhase,
    weather,
  ]);

  useEffect(() => {
    if (phase !== "RECAP") {
      return;
    }

    const timer = window.setTimeout(() => {
      if (day === 7) {
        computeFinalScore();
        setPhase("SCORE");
        return;
      }

      advanceDay();
      setCurrentEvent(null);
      setIsDaytime(true);
      const nextLine = NARRATOR_PLANNING[day + 1];
      setNarrator(nextLine.text, nextLine.tone);
      setPhase("PLANNING");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [
    advanceDay,
    computeFinalScore,
    day,
    phase,
    setCurrentEvent,
    setIsDaytime,
    setNarrator,
    setPhase,
  ]);

  return null;
}
