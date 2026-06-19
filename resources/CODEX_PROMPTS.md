# Codex Prompts — Power My Life
> Chaque prompt est indépendant. Colle-les dans l'ordre dans Codex.
> Les fichiers de référence sont dans ce repo.

---

## PROMPT 1 — Setup projet

```
Crée un projet Next.js 15 avec App Router, TypeScript strict, Tailwind CSS v4.
Installe les dépendances suivantes :
- three
- @react-three/fiber
- @react-three/drei
- @react-spring/three
- zustand

Structure de dossiers attendue :
app/ components/scene/ components/ui/ lib/engine/ lib/data/ lib/utils/ store/ public/models/

Dans app/page.tsx, affiche un div plein écran noir avec le texte "Power My Life" centré en blanc.
Dans app/layout.tsx, configure les métadonnées : title="Power My Life", description="Rends ta maison énergétiquement autonome".
Configure tailwind.config pour un fond noir par défaut.
```

---

## PROMPT 2 — Game Store Zustand

```
Crée store/gameStore.ts en te basant exactement sur ce schéma TypeScript :
[COLLER LE CONTENU DE gameStore.ts]

Le store doit être importable partout avec : import { useGameStore } from '@/store/gameStore'
Vérifie que toutes les actions sont correctement typées et que le resetGame() restaure exactement l'état initial.
```

---

## PROMPT 3 — Données et moteur de simulation

```
Crée les fichiers suivants avec exactement ce contenu :

1. lib/data/profiles.ts → [COLLER profiles.ts]
2. lib/data/equipment.ts → [COLLER equipment.ts]
3. lib/data/narrator.ts → [COLLER narrator.ts]
4. lib/engine/simulation.ts → [COLLER simulation.ts]
5. lib/engine/events.ts → [COLLER events.ts]

Puis crée lib/engine/scoring.ts :
- Exporte une fonction computeScore(history: DayResult[], budget: number): Score
- Score = (autonomyPercent * 0.5) + (co2SavedKg * 0.5) + (budget / 100)
- Tier : >80 = 'pioneer', 50-80 = 'transition', <50 = 'dependent'

Crée lib/utils/energy.ts avec :
- kwhToCO2(kwh, region): number → retourne les grammes de CO2
- kwhToEuros(kwh): number → prix EDF tarif bleu
- formatKwh(kwh): string → "3,2 kWh"
- formatCO2(grams): string → "1,2 kg CO₂"
- formatEuros(euros): number → "2,50 €"
```

---

## PROMPT 4 — Scène React Three Fiber

```
Crée components/scene/Scene.tsx :
- Canvas React Three Fiber plein écran
- Caméra isométrique fixe : position [10, 10, 10], fov 30, orthographic
- Éclairage : ambientLight intensity=0.4, directionalLight position=[5,10,5] intensity=1.2 castShadow
- Fond : color="#0a0a0f"
- Ombres activées sur le Canvas (shadows prop)
- Importe et affiche : <Environment />, <House />, <DayNightCycle />
- La scène doit être centrée sur [0, 0, 0]

Crée components/scene/Environment.tsx :
- Un plan horizontal (PlaneGeometry 20x20) comme sol, couleur #1a2a1a, receiveShadow
- 4 arbres low-poly positionnés aux coins (simples ConeGeometry + CylinderGeometry verts)
- 2 maisons voisines en arrière-plan (BoxGeometry simples, couleur #2a2a3a, échelle 0.5)
- Une route en perspective (BoxGeometry allongé, couleur #1a1a1a)
```

---

## PROMPT 5 — Maison réactive

```
Crée components/scene/House.tsx :
- Charge le modèle GLB selon profile.houseType via useGLTF()
- Paths : /models/house-studio.glb, /models/house-appart.glb, /models/house-maison.glb
- Si le modèle n'existe pas encore, utilise un placeholder BoxGeometry (1x1.5x1 pour studio, 1.5x2x1.5 pour appart, 2x2x2 pour maison)
- Utilise useSpring de @react-spring/three pour animer la transition de scale quand houseType change
- Animation : spring config { tension: 120, friction: 14 }
- La maison est castShadow et receiveShadow
- Exporte aussi un composant <HouseEquipment /> qui affiche les équipements installés sur la maison :
  - Panneaux solaires sur le toit (positionnés en grille, inclinés 30°)
  - Batterie contre le mur (si installée)
  - Éolienne dans le jardin (si installée et houseType === 'maison')
- Les équipements apparaissent avec une animation spring scale 0→1 quand achetés
```

---

## PROMPT 6 — Cycle jour/nuit et météo

```
Crée components/scene/DayNightCycle.tsx :
- Reçoit prop isDay: boolean et weatherType: string
- Quand isDay=false : ambientLight passe de 0.4 à 0.05, directionalLight intensity 1.2 → 0.1
- Animation avec useSpring sur les intensités lumineuses
- Les fenêtres de la maison s'allument la nuit (MeshBasicMaterial emissive yellow, intensity 2.0)
- Durée de la transition jour→nuit : 2 secondes (pendant la simulation)

Crée components/scene/Weather.tsx :
- Reçoit prop weatherType: 'sunny' | 'cloudy' | 'stormy' | 'hot' | 'cold' | 'normal'
- sunny : sphère jaune animée (soleil) en position [8, 8, 0], pulsation douce
- cloudy : 3 sphères blanches aplaties flottantes, animation lente
- stormy : nuages gris + légère oscillation de toute la scène (rotation Y ±0.02)
- hot : teinte ambiante légèrement orange (#ff6b35 à 0.1 d'intensité)
- cold : teinte ambiante bleue (#6b9fff à 0.1 d'intensité)
- Toutes les transitions avec useSpring
```

---

## PROMPT 7 — UI Overlay (Dashboard + Shop)

```
Crée components/ui/Dashboard.tsx :
- Positionné en overlay par-dessus le Canvas (position absolute, z-index 10)
- Panneau droit : 3 jauges animées (progress bar Tailwind)
  - 🌿 Autonomie % (vert si >60, orange si 30-60, rouge si <30)
  - 🌍 CO₂ évité (kg, toujours vert)
  - 💰 Budget restant (€, rouge si <500)
- Panneau bas : timeline 7 jours (cercles numérotés, actif = blanc, passé = vert/rouge, futur = gris)
- Panneau haut-gauche : indicateur météo du jour (emoji + label)
- Tous les chiffres animés avec countup au changement de valeur
- Bouton "Lancer le jour" en bas centré, désactivé pendant SIMULATING

Crée components/ui/ShopPanel.tsx :
- Slide-in depuis la gauche (animation CSS transform translateX)
- Liste des équipements depuis EQUIPMENT_CATALOG
- Chaque item : icon + nom + description + prix + bouton Acheter
- Bouton désactivé si : budget insuffisant, déjà acheté (unique), pas de jardin requis
- Au survol, affiche le texte narrateur correspondant (NARRATOR_SHOP_HINTS)
- Compte des panneaux solaires restants (ex: "3/6 slots restants")

Crée components/ui/EventCard.tsx :
- Modal centré avec backdrop blur
- Title + description + narratorText
- Bouton "Compris" pour fermer et passer à SIMULATING
- Animation d'entrée : scale 0.8 → 1.0 + opacity 0 → 1
```

---

## PROMPT 8 — Onboarding narratif

```
Crée components/ui/Onboarding.tsx :
- Overlay par-dessus la scène 3D déjà chargée (backdrop-filter: blur(2px))
- 3 étapes séquentielles (onboardingStep 0, 1, 2)
- Chaque étape : texte narrateur + 3 cartes cliquables
- Les cartes sont des boutons avec : emoji grande taille + label + description courte
- Au clic : setProfile() + setOnboardingStep(step+1) + animation fadeOut/fadeIn
- Étape 0 : houseType (Studio / Appartement / Maison)
- Étape 1 : occupants (Seul / Couple / Famille)
- Étape 2 : region (Sud / Centre / Nord)
- Après l'étape 2 : délai 1.5s, afficher le texte NARRATOR_ONBOARDING.launch[0], puis launch[1], puis setPhase('PLANNING')

Crée components/ui/Narrator.tsx :
- Boîte de dialogue en bas de l'écran (position absolute bottom-8 left-1/2 transform -translateX-1/2)
- Largeur max 600px
- Fond semi-transparent dark (bg-black/80 backdrop-blur)
- Texte qui s'affiche lettre par lettre (typewriter effect, 30ms/lettre)
- Icône selon le ton : 🎬 cinematic, 😏 sarcastic
- Disparaît automatiquement après 4 secondes
- Peut être cliqué pour skip l'animation typewriter
```

---

## PROMPT 9 — GameController + orchestration

```
Crée components/game/GameController.tsx :
Ce composant orchestre toutes les phases du jeu. Il ne rend rien de visible — c'est le cerveau.

Logique à implémenter :

1. Phase LOADING → après 2s, setPhase('ONBOARDING')

2. Phase PLANNING → afficher ShopPanel + bouton "Lancer le jour"
   Au clic "Lancer le jour" :
   - Générer l'événement du jour avec pickRandomEvent(region, day)
   - Si événement : setCurrentEvent(event), setPhase('EVENT')
   - Sinon : setPhase('SIMULATING')

3. Phase EVENT → EventCard visible
   Après confirmation : setPhase('SIMULATING')

4. Phase SIMULATING :
   - Appeler simulateDay() avec l'état actuel
   - Calculer CO2 saved et coût
   - Animer la scène (déclencher le cycle jour/nuit)
   - Après 5 secondes : addDayResult(), setPhase('RECAP')

5. Phase RECAP :
   - Afficher bilan + texte narrateur getNarratorRecap()
   - Après 3 secondes :
     - Si day === 7 : computeFinalScore(), setPhase('SCORE')
     - Sinon : advanceDay(), setPhase('PLANNING')

6. Phase SCORE → afficher ScoreCard

Dans app/page.tsx, importe et compose :
<div className="relative w-screen h-screen bg-black overflow-hidden">
  <Scene />
  <GameController />
  <Narrator />
  {phase === 'ONBOARDING' && <Onboarding />}
  {(phase === 'PLANNING' || phase === 'RECAP') && <Dashboard />}
  {phase === 'PLANNING' && <ShopPanel />}
  {phase === 'EVENT' && <EventCard />}
  {phase === 'SCORE' && <ScoreCard />}
</div>
```

---

## PROMPT 10 — Score final + carte partageable

```
Crée components/ui/ScoreCard.tsx :
- Plein écran avec fond dégradé selon le tier :
  - pioneer : gradient vert foncé → noir
  - transition : gradient orange → noir
  - dependent : gradient bleu nuit → noir
- Affiche : titre du tier, score total, 3 métriques (autonomie, CO2, budget)
- Texte final du narrateur (NARRATOR_SCORE[tier])
- Bouton "Partager" : génère une image PNG via html2canvas de la carte, déclenche download
- Bouton "Rejouer" : appelle resetGame()
- Animation d'entrée : fade in + légère montée (translateY 20px → 0)

Installe html2canvas :
npm install html2canvas

La carte partageable doit avoir :
- Fond coloré selon tier
- Titre : "Power My Life"
- Sous-titre : "Mon bilan énergétique sur 7 jours"
- Les 3 métriques en grands chiffres
- Le tier en badge
- Une ligne "Défend Intelligence Hackathon 2026"
```

---

## PROMPT 11 — Polish et déploiement

```
1. Ajoute une police Google Fonts dans layout.tsx : Space Grotesk (weights 400, 600, 700)
   Applique-la globalement via Tailwind (fontFamily dans globals.css)

2. Ajoute des métadonnées Open Graph dans layout.tsx pour le partage social :
   - og:title = "Power My Life ⚡"
   - og:description = "Rends ta maison énergétiquement autonome en 7 jours"
   - og:image = "/og-image.png" (à créer manuellement)

3. Dans next.config.ts, configure :
   - transpilePackages: ['three']

4. Ajoute un loading screen dans app/loading.tsx :
   - Fond noir, logo "⚡" centré, animation pulse Tailwind

5. Configure vercel.json :
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}

6. Vérifie que toutes les pages passent : npm run build
   Corrige les erreurs TypeScript si nécessaire.
```
