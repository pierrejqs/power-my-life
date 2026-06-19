# ⚡ Power My Life — Hackathon Defend Intelligence 2026

## Concept
Tu réponds à 3 questions. Ta maison low-poly 3D se génère en isométrique avec ton profil de consommation réel (données ADEME + RTE). Tu as 7 jours simulés et un budget limité pour la rendre énergétiquement autonome. La météo, les événements aléatoires et tes décisions d'équipement font ou défont ton réseau.

## Stack technique
- **Framework** : Next.js 15 (App Router, TypeScript strict)
- **Styles** : Tailwind CSS v4
- **Scène 3D** : React Three Fiber + @react-three/drei + @react-spring/three
- **State** : Zustand
- **Déploiement** : Vercel
- **LLM** : Optionnel (porte ouverte pour bilan final Claude API)

## Structure du projet
```
power-my-life/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── scene/
│   │   ├── Scene.tsx
│   │   ├── House.tsx
│   │   ├── Environment.tsx
│   │   ├── Weather.tsx
│   │   ├── Equipment.tsx
│   │   └── DayNightCycle.tsx
│   ├── ui/
│   │   ├── Onboarding.tsx
│   │   ├── Narrator.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Timeline.tsx
│   │   ├── EventCard.tsx
│   │   ├── ShopPanel.tsx
│   │   └── ScoreCard.tsx
│   └── game/
│       └── GameController.tsx
├── lib/
│   ├── engine/
│   │   ├── simulation.ts
│   │   ├── events.ts
│   │   └── scoring.ts
│   ├── data/
│   │   ├── profiles.ts
│   │   ├── equipment.ts
│   │   └── narrator.ts
│   └── utils/
│       └── energy.ts
├── store/
│   └── gameStore.ts
└── public/
    └── models/
        ├── house-studio.glb
        ├── house-appart.glb
        ├── house-maison.glb
        ├── solar-panel.glb
        ├── battery.glb
        └── windmill.glb
```

## Installation
```bash
npx create-next-app@latest power-my-life --typescript --tailwind --app
cd power-my-life
npm install three @react-three/fiber @react-three/drei @react-spring/three zustand
npm install -D @types/three
```

## Démarrage
```bash
npm run dev
```

## Déploiement
```bash
vercel --prod
```
