import React from "react";
import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GameController } from "@/components/game/GameController";
import { useGameStore } from "@/store/gameStore";

describe("GameController", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useGameStore.getState().resetGame();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("moves from loading to onboarding", () => {
    render(React.createElement(GameController));

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(useGameStore.getState().phase).toBe("ONBOARDING");
  });

  it("handles a no-event day through recap and back to planning", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.95);

    useGameStore.setState({
      phase: "PLANNING",
      profile: { houseType: "maison", occupants: "couple", region: "sud" },
    });

    render(React.createElement(GameController));

    act(() => {
      useGameStore.getState().requestDayStart();
    });

    expect(useGameStore.getState().phase).toBe("SIMULATING");

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(useGameStore.getState().phase).toBe("RECAP");
    expect(useGameStore.getState().history).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(useGameStore.getState().phase).toBe("PLANNING");
    expect(useGameStore.getState().day).toBe(2);
  });

  it("handles event acknowledgement before simulation", () => {
    const random = vi.spyOn(Math, "random");
    random
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.01);

    useGameStore.setState({
      phase: "PLANNING",
      profile: { houseType: "maison", occupants: "couple", region: "sud" },
    });

    render(React.createElement(GameController));

    act(() => {
      useGameStore.getState().requestDayStart();
    });

    expect(useGameStore.getState().phase).toBe("EVENT");
    expect(useGameStore.getState().currentEvent?.id).toBeTruthy();

    act(() => {
      useGameStore.getState().acknowledgeEvent();
    });

    expect(useGameStore.getState().phase).toBe("SIMULATING");
  });

  it("moves day seven recap to score", () => {
    useGameStore.setState({
      phase: "RECAP",
      day: 7,
      history: [
        {
          day: 7,
          weather: { type: "normal", solarMultiplier: 1, windMultiplier: 1, consumptionMultiplier: 1 },
          event: null,
          grid: {
            productionKwh: 10,
            consumptionKwh: 12,
            batteryLevel: 0,
            batteryCapacity: 10,
            gridImportKwh: 2,
            gridExportKwh: 0,
          },
          autonomyPercent: 83,
          co2SavedKg: 0.5,
          costEur: 0.5,
          narratorRecap: "ok",
        },
      ],
      budget: 3000,
    });

    render(React.createElement(GameController));

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(useGameStore.getState().phase).toBe("SCORE");
    expect(useGameStore.getState().score?.tier).toBeDefined();
  });
});
