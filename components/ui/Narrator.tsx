"use client";

import { useEffect, useMemo, useState } from "react";

import { useGameStore } from "@/store/gameStore";

export function Narrator() {
  const phase = useGameStore((state) => state.phase);
  const narratorMessage = useGameStore((state) => state.narratorMessage);
  const narratorTone = useGameStore((state) => state.narratorTone);
  const [visible, setVisible] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!narratorMessage) {
      setOpen(false);
      return;
    }

    setOpen(true);
    setVisible("");
    let index = 0;

    const typeTimer = window.setInterval(() => {
      index += 1;
      setVisible(narratorMessage.slice(0, index));
      if (index >= narratorMessage.length) {
        window.clearInterval(typeTimer);
      }
    }, 30);

    const closeTimer = window.setTimeout(() => setOpen(false), 4000);

    return () => {
      window.clearInterval(typeTimer);
      window.clearTimeout(closeTimer);
    };
  }, [narratorMessage]);

  const icon = useMemo(
    () => (narratorTone === "cinematic" ? "🎬" : "😏"),
    [narratorTone]
  );

  if (!open || phase === "ONBOARDING") {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => setVisible(narratorMessage)}
      className="panel hud-panel swiss-rule absolute left-1/2 top-[calc(env(safe-area-inset-top)+17rem)] z-30 w-[calc(100%-1.5rem)] max-w-[620px] -translate-x-1/2 px-4 py-3 pt-6 text-left md:top-auto md:bottom-8 md:w-[calc(100%-2rem)] md:px-5 md:py-4 md:pt-7"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl">{icon}</span>
        <span className="text-sm leading-6 text-[#43375e] md:text-[15px]">{visible}</span>
      </div>
    </button>
  );
}
