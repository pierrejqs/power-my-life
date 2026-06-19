"use client";

import { useEffect, useRef } from "react";

import { NARRATOR_ONBOARDING } from "@/lib/data/narrator";
import { useGameStore } from "@/store/gameStore";

const STEPS = [
  {
    title: "Ton logement",
    key: "houseType" as const,
    options: [
      { emoji: "🏢", label: "Appartement", value: "appart", description: "Intermediaire et dense." },
      { emoji: "🏡", label: "Maison", value: "maison", description: "Plus de surface, plus d'options." },
    ],
  },
  {
    title: "Les occupants",
    key: "occupants" as const,
    options: [
      { emoji: "🧍", label: "Seul", value: "solo", description: "Une seule routine a equilibrer." },
      { emoji: "🧑‍🤝‍🧑", label: "Couple", value: "couple", description: "Deux rythmes a lisser." },
      { emoji: "👨‍👩‍👧", label: "Famille", value: "famille", description: "Plus de demande, plus de pics." },
    ],
  },
  {
    title: "La region",
    key: "region" as const,
    options: [
      { emoji: "🌞", label: "Sud", value: "sud", description: "Solaire fort, chaleur couteuse." },
      { emoji: "🌤️", label: "Centre", value: "centre", description: "Conditions intermediaires." },
      { emoji: "🌬️", label: "Nord", value: "nord", description: "Moins de soleil, plus de vent." },
    ],
  },
];

export function Onboarding() {
  const advanceTimerRef = useRef<number | null>(null);
  const onboardingStep = useGameStore((state) => state.onboardingStep);
  const setOnboardingStep = useGameStore((state) => state.setOnboardingStep);
  const setProfile = useGameStore((state) => state.setProfile);
  const setNarrator = useGameStore((state) => state.setNarrator);
  const setPhase = useGameStore((state) => state.setPhase);

  const step = STEPS[onboardingStep];

  useEffect(() => {
    if (onboardingStep === 0) {
      setNarrator(NARRATOR_ONBOARDING.intro.text, NARRATOR_ONBOARDING.intro.tone);
    }
  }, [onboardingStep, setNarrator]);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) {
        window.clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  function clearAdvanceTimer() {
    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }

  function handleBack() {
    clearAdvanceTimer();

    const previousStep = Math.max(onboardingStep - 1, 0);
    setOnboardingStep(previousStep);

    if (previousStep === 0) {
      setNarrator(NARRATOR_ONBOARDING.intro.text, NARRATOR_ONBOARDING.intro.tone);
    }
    if (previousStep === 1) {
      setNarrator(NARRATOR_ONBOARDING.occupantsIntro.text, NARRATOR_ONBOARDING.occupantsIntro.tone);
    }
  }

  function handleSelect(value: string) {
    clearAdvanceTimer();
    setProfile({ [step.key]: value });

    if (step.key === "houseType") {
      const entry = NARRATOR_ONBOARDING.houseType[value as keyof typeof NARRATOR_ONBOARDING.houseType];
      setNarrator(entry.text, entry.tone);
    }
    if (step.key === "occupants") {
      const entry = NARRATOR_ONBOARDING.occupants[value as keyof typeof NARRATOR_ONBOARDING.occupants];
      setNarrator(entry.text, entry.tone);
    }
    if (step.key === "region") {
      const entry = NARRATOR_ONBOARDING.region[value as keyof typeof NARRATOR_ONBOARDING.region];
      setNarrator(entry.text, entry.tone);
    }

    if (onboardingStep < 2) {
      advanceTimerRef.current = window.setTimeout(() => {
        const nextStep = onboardingStep + 1;
        advanceTimerRef.current = null;
        setOnboardingStep(nextStep);
        if (nextStep === 1) {
          setNarrator(
            NARRATOR_ONBOARDING.occupantsIntro.text,
            NARRATOR_ONBOARDING.occupantsIntro.tone
          );
        }
        if (nextStep === 2) {
          setNarrator(NARRATOR_ONBOARDING.regionIntro.text, NARRATOR_ONBOARDING.regionIntro.tone);
        }
      }, 350);
      return;
    }

    window.setTimeout(() => {
      setNarrator(NARRATOR_ONBOARDING.launch[0].text, NARRATOR_ONBOARDING.launch[0].tone);
      window.setTimeout(() => {
        setNarrator(NARRATOR_ONBOARDING.launch[1].text, NARRATOR_ONBOARDING.launch[1].tone);
        setPhase("PLANNING");
      }, 1200);
    }, 450);
  }

  return (
    <div className="absolute inset-0 z-20 flex items-end justify-center bg-[rgba(24,17,39,0.08)] px-0 pt-12 md:px-4 md:py-4">
      <div className="max-h-[44svh] w-full overflow-hidden px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4 md:max-h-[30svh] md:max-w-3xl md:p-4">
        <div className="control-scroll max-h-[calc(44svh-2rem)] overflow-y-auto pr-1 md:max-h-[calc(30svh-2rem)] md:pr-0">
          {onboardingStep > 0 && (
            <button
              type="button"
              onClick={handleBack}
              aria-label="Revenir a l'etape precedente"
              className="panel hud-panel mb-3 flex h-11 w-11 items-center justify-center text-3xl font-bold leading-none text-[#2d2545] transition hover:-translate-x-0.5 hover:border-[#ffb2a4] hover:shadow-[0_12px_28px_rgba(255,107,107,0.16)]"
            >
              ‹
            </button>
          )}
          <div className="control-scroll flex gap-3 overflow-x-auto pb-2 md:grid md:gap-3 md:overflow-visible md:pb-0 md:grid-cols-3">
            {step.options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                aria-label={`${step.title} : ${option.label}`}
                className="panel hud-panel min-w-[10rem] flex-none p-4 text-left transition hover:-translate-y-1 hover:border-[#ffb2a4] hover:shadow-[0_16px_36px_rgba(255,107,107,0.18)] md:min-w-0"
              >
                <div className="mb-3 text-3xl">{option.emoji}</div>
                <div className="playful-display mb-1 text-xl font-bold text-[#2d2545]">
                  {option.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
