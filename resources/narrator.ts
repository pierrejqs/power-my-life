// Tous les textes du narrateur — double ton : cinématographique + sarcastique
// Structure : [tone, text]

export type NarratorTone = 'cinematic' | 'sarcastic'
export type NarratorEntry = { tone: NarratorTone; text: string }

// ─── Onboarding ───────────────────────────────────────────
export const NARRATOR_ONBOARDING = {
  intro: {
    tone: 'cinematic' as NarratorTone,
    text: "Quelque part en France. Une maison attend. Est-ce la tienne ?",
  },
  houseType: {
    studio: { tone: 'sarcastic' as NarratorTone, text: "Studio. 30m². Ta box internet consomme probablement plus que ton chauffage. On va s'amuser." },
    appart: { tone: 'cinematic' as NarratorTone, text: "Un appartement. Des voisins au-dessus, en-dessous. Leur consommation n'est pas ton problème. La tienne, si." },
    maison: { tone: 'sarcastic' as NarratorTone, text: "Une maison. Jardin, garage, et une facture EDF qui donne des sueurs froides en janvier. Bienvenue." },
  },
  occupantsIntro: {
    tone: 'cinematic' as NarratorTone,
    text: "Cette maison respire. Combien de souffles ?",
  },
  occupants: {
    solo:    { tone: 'sarcastic' as NarratorTone, text: "Seul. Ce qui signifie que tous les appareils allumés dans le salon, c'est toi. On sait." },
    couple:  { tone: 'sarcastic' as NarratorTone, text: "Deux personnes. Deux téléphones en charge toute la nuit. Deux Netflix en simultané. On calcule." },
    famille: { tone: 'cinematic' as NarratorTone, text: "Une famille. Chaque pièce allumée. Chaque appareil réclamé en même temps. Le vrai défi commence." },
  },
  regionIntro: {
    tone: 'cinematic' as NarratorTone,
    text: "Le soleil ne brille pas de la même façon partout. Où es-tu ?",
  },
  region: {
    sud:    { tone: 'sarcastic' as NarratorTone, text: "Le Sud. 300 jours de soleil par an — et une clim qui tourne 4 mois. Équilibre précaire." },
    centre: { tone: 'cinematic' as NarratorTone, text: "Centre de la France. Quatre saisons franches. Ni trop facile, ni trop cruel. Le jeu standard." },
    nord:   { tone: 'cinematic' as NarratorTone, text: "Le Nord. Ciel bas, vent constant. Le solaire sera capricieux. L'éolienne, elle, va adorer." },
  },
  launch: [
    { tone: 'cinematic' as NarratorTone, text: "Profil chargé. Ressources comptées. Le premier jour commence." },
    { tone: 'sarcastic' as NarratorTone, text: "Tu as 7 jours. Et un budget qui fond plus vite que tu ne le penses. Bonne chance." },
  ],
}

// ─── Planning (avant chaque jour) ────────────────────────
export const NARRATOR_PLANNING: Record<number, NarratorEntry> = {
  1: { tone: 'cinematic', text: "Jour 1. Tout commence maintenant. Chaque euro compte." },
  2: { tone: 'sarcastic', text: "Jour 2. Tu as survécu au premier jour. Impressionnant. Vraiment." },
  3: { tone: 'cinematic', text: "Jour 3. La mi-parcours approche. Ton réseau tient — pour l'instant." },
  4: { tone: 'sarcastic', text: "Jour 4. On est à mi-chemin. C'est là que les stratégies bancales s'effondrent." },
  5: { tone: 'cinematic', text: "Jour 5. Les deux derniers jours seront décisifs." },
  6: { tone: 'sarcastic', text: "Jour 6. Presque fini. Ne gâche pas ça maintenant." },
  7: { tone: 'cinematic', text: "Jour 7. Le dernier. Ce jour définira tout ce qui précède." },
}

// ─── Recap journalier ─────────────────────────────────────
export function getNarratorRecap(autonomyPercent: number, day: number): NarratorEntry {
  if (autonomyPercent >= 80) {
    return { tone: 'cinematic', text: `Jour ${day} bouclé. ${autonomyPercent}% d'autonomie. Le réseau respire.` }
  } else if (autonomyPercent >= 50) {
    return { tone: 'sarcastic', text: `${autonomyPercent}% d'autonomie. Correct. Mais tu peux mieux faire.` }
  } else if (autonomyPercent >= 20) {
    return { tone: 'sarcastic', text: `${autonomyPercent}% d'autonomie. EDF te remercie chaleureusement.` }
  } else {
    return { tone: 'cinematic', text: `Jour ${day}. Le réseau a compensé l'essentiel. La dépendance reste totale.` }
  }
}

// ─── Score final ──────────────────────────────────────────
export const NARRATOR_SCORE = {
  pioneer: {
    tone: 'cinematic' as NarratorTone,
    text: "Jour 7. Le réseau tient. Ta maison respire seule. Tu as réussi ce que beaucoup de foyers n'arrivent pas à imaginer.",
  },
  transition: {
    tone: 'sarcastic' as NarratorTone,
    text: "Pas mal pour un début. Ton réseau a tenu mais dépend encore du réseau. La prochaine fois, pense à la batterie avant les panneaux.",
  },
  dependent: {
    tone: 'cinematic' as NarratorTone,
    text: "Blackout partiel. La ville continue sans toi. Ce n'est pas une fin — c'est un début de compréhension.",
  },
}

// ─── Conseils Shop ────────────────────────────────────────
export const NARRATOR_SHOP_HINTS: Record<string, NarratorEntry> = {
  'solar-panel': { tone: 'sarcastic', text: "Les panneaux, c'est bien. Sans batterie, c'est du gâchis la nuit." },
  'battery':     { tone: 'cinematic', text: "La batterie. Le maillon manquant entre le jour et la nuit." },
  'windmill':    { tone: 'sarcastic', text: "Une éolienne. Parce que le vent, lui, ne prend pas de vacances." },
  'thermostat':  { tone: 'sarcastic', text: "300€ pour économiser 15%. Pas glamour, mais redoutablement efficace." },
  'led':         { tone: 'sarcastic', text: "Des ampoules LED. Le geste minimal. Au moins, tu fais quelque chose." },
  'offpeak':     { tone: 'cinematic', text: "Les heures creuses. Décaler, c'est déjà agir." },
}
