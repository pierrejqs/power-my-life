export type NarratorTone = "cinematic" | "sarcastic";
export type NarratorEntry = { tone: NarratorTone; text: string };

export const NARRATOR_ONBOARDING = {
  intro: {
    tone: "cinematic" as NarratorTone,
    text: "Quelque part en France, une maison attend. Voyons comment elle vit.",
  },
  houseType: {
    studio: { tone: "sarcastic" as NarratorTone, text: "Studio. Compact, nerveux, sans beaucoup de marge." },
    appart: { tone: "cinematic" as NarratorTone, text: "Appartement. Des voisins partout, mais ta facture reste bien a toi." },
    maison: { tone: "sarcastic" as NarratorTone, text: "Maison. Plus d'espace, plus de potentiel, plus de maniere de se rater." },
  },
  occupantsIntro: {
    tone: "cinematic" as NarratorTone,
    text: "Cette maison respire. Combien de souffles ?",
  },
  occupants: {
    solo: { tone: "sarcastic" as NarratorTone, text: "Solo. Chaque appareil allume est donc ton oeuvre." },
    couple: { tone: "sarcastic" as NarratorTone, text: "Couple. Deux rythmes, deux charges, deux fois plus d'arbitrages." },
    famille: { tone: "cinematic" as NarratorTone, text: "Famille. La consommation devient une chorale." },
  },
  regionIntro: {
    tone: "cinematic" as NarratorTone,
    text: "Le soleil, le vent et le froid ne racontent pas la meme histoire partout.",
  },
  region: {
    sud: { tone: "sarcastic" as NarratorTone, text: "Le Sud. Soleil genereux, climatisation agressive." },
    centre: { tone: "cinematic" as NarratorTone, text: "Le Centre. Terrain moyen, donc erreurs bien visibles." },
    nord: { tone: "cinematic" as NarratorTone, text: "Le Nord. Le solaire fera des caprices, le vent beaucoup moins." },
  },
  launch: [
    { tone: "cinematic" as NarratorTone, text: "Profil charge. Budget compte. Le premier jour peut commencer." },
    { tone: "sarcastic" as NarratorTone, text: "Tu as sept jours. Le reseau n'attendra pas tes hesitations." },
  ],
};

export const NARRATOR_PLANNING: Record<number, NarratorEntry> = {
  1: { tone: "cinematic", text: "Jour 1. On pose les bases." },
  2: { tone: "sarcastic", text: "Jour 2. Les premieres erreurs commencent a couter." },
  3: { tone: "cinematic", text: "Jour 3. La trajectoire devient visible." },
  4: { tone: "sarcastic", text: "Jour 4. Le milieu de partie expose les strategies fragiles." },
  5: { tone: "cinematic", text: "Jour 5. Chaque achat doit maintenant avoir une raison." },
  6: { tone: "sarcastic", text: "Jour 6. C'est trop tard pour les achats decoratifs." },
  7: { tone: "cinematic", text: "Jour 7. Derniere journee. La maison rend son verdict." },
};

export function getNarratorRecap(autonomyPercent: number, day: number): NarratorEntry {
  if (autonomyPercent >= 80) {
    return {
      tone: "cinematic",
      text: `Jour ${day}. ${autonomyPercent}% d'autonomie. Le reseau souffle enfin.`,
    };
  }
  if (autonomyPercent >= 50) {
    return {
      tone: "sarcastic",
      text: `${autonomyPercent}% d'autonomie. Correct. Mais toujours pas libre.`,
    };
  }
  if (autonomyPercent >= 20) {
    return {
      tone: "sarcastic",
      text: `${autonomyPercent}% d'autonomie. EDF apprecie ton sens du soutien.`,
    };
  }
  return {
    tone: "cinematic",
    text: `Jour ${day}. La dependance reste lourde. Il faudra mieux arbitrer.`,
  };
}

export const NARRATOR_SCORE = {
  pioneer: {
    tone: "cinematic" as NarratorTone,
    text: "Tu as prouve qu'une maison peut apprendre la discipline energetique.",
  },
  transition: {
    tone: "sarcastic" as NarratorTone,
    text: "Tu progresses. Mais le reseau a encore joue les bequilles.",
  },
  dependent: {
    tone: "cinematic" as NarratorTone,
    text: "La lecture est claire : il reste beaucoup a structurer pour gagner en autonomie.",
  },
};

export const NARRATOR_SHOP_HINTS: Record<string, NarratorEntry> = {
  "solar-panel": { tone: "sarcastic", text: "Le solaire est utile. Sans stockage, il reste nerveux." },
  battery: { tone: "cinematic", text: "La batterie convertit le jour en resilience nocturne." },
  windmill: { tone: "sarcastic", text: "Le vent compense parfois les humeurs du ciel." },
  thermostat: { tone: "sarcastic", text: "Petit achat, impact structurel. C'est souvent comme ca." },
  led: { tone: "sarcastic", text: "Le geste de base. Pas glorieux, mais rentable." },
  offpeak: { tone: "cinematic", text: "Deplacer la demande, c'est deja redessiner le systeme." },
};
