# Architecture technique — Power My Life

## Flow de données

```
UserProfile (onboarding)
        │
        ▼
    gameStore (Zustand)
        │
   ┌────┴────┐
   │         │
   ▼         ▼
Scene R3F  GameController
(3D)       (Orchestrateur)
   │         │
   │    ┌────┴──────────────┐
   │    │                   │
   │    ▼                   ▼
   │  simulation.ts      events.ts
   │  (calculs kWh)      (événements)
   │         │
   │         ▼
   │    DayResult
   │    (history[])
   │         │
   └────┐    │
        ▼    ▼
      UI Overlay (Dashboard, Shop, Score)
```

## Composants et responsabilités

```
app/page.tsx
└── <Scene />                    # Canvas R3F plein écran
    ├── <House />                # Maison + équipements 3D
    ├── <Environment />          # Sol, arbres, voisins
    ├── <DayNightCycle />        # Lumière dynamique
    └── <Weather />              # Effets météo 3D

└── <GameController />           # Cerveau — aucun rendu
    └── Gère les transitions de phase

└── <Narrator />                 # Dialogue typewriter (toujours présent)

└── {phase === 'ONBOARDING'} → <Onboarding />
└── {phase === 'PLANNING'}   → <Dashboard /> + <ShopPanel />
└── {phase === 'EVENT'}      → <EventCard />
└── {phase === 'SIMULATING'} → <Dashboard /> (read-only)
└── {phase === 'RECAP'}      → <Dashboard /> + overlay bilan
└── {phase === 'SCORE'}      → <ScoreCard />
```

## State machine des phases

```
LOADING ──(2s)──► ONBOARDING ──(3 questions)──► PLANNING
                                                     │
                                    ◄────────────────┘
                                    │
                              [Event?]──YES──► EVENT ──► SIMULATING
                                    │                        │
                                   NO                        │
                                    └──────────────────────► SIMULATING
                                                              │
                                                           RECAP
                                                              │
                                               [day < 7]──► PLANNING
                                                              │
                                               [day === 7]──► SCORE
```

## Flux de la simulation (Phase SIMULATING)

```
1. simulateDay(profile, equipment, weather, battery) → GridState
2. calcCO2Saved(gridImport, baseConsumption, region) → kg CO₂
3. calcDayCost(gridImport) → €
4. calcAutonomy(grid) → %
5. getNarratorRecap(autonomy, day) → texte
6. addDayResult({ day, weather, event, grid, co2, cost, recap })
7. Animer la scène (DayNightCycle trigger)
8. Après 5s → setPhase('RECAP')
```
