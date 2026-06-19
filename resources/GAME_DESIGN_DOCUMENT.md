# Game Design Document — Power My Life

## 1. Vision
Un jeu de gestion énergétique personnel, ancré dans la réalité française (données ADEME + RTE), où le joueur doit rendre sa maison générée dynamiquement autonome en 7 jours simulés.

## 2. Boucle de gameplay

```
ONBOARDING (3 questions narratives sur la scène 3D)
    ↓
PLANNING (achat d'équipements avec budget limité)
    ↓
SIMULATING (animation 5 secondes — jour simulé)
    ↓
EVENT (événement aléatoire 1 jour sur 2)
    ↓
RECAP (bilan journalier + narrateur)
    ↓
[Répéter x7 jours]
    ↓
SCORE FINAL (carte partageable)
```

## 3. Phases de jeu

### ONBOARDING
- Scène 3D déjà chargée en arrière-plan
- 3 questions en overlay avec réponses visuelles (cartes cliquables)
- La maison se transforme en temps réel selon les réponses
- Narrateur double ton : cinématographique + sarcastique

**Questions :**
1. Type de logement : Studio / Appartement / Maison
2. Nombre d'occupants : Seul / Couple / Famille
3. Région : Sud / Centre / Nord

### PLANNING
- Vue sur la maison + panneau latéral shop
- Budget initial : 5 000€
- Surface de toit limitée (contrainte spatiale)
- Équipements disponibles (voir section Équipements)
- Bouton "Lancer le jour" pour valider

### SIMULATING
- Animation 5 secondes du jour complet accéléré
- Cycle soleil/nuages selon météo du jour
- Transition jour → nuit visible sur la scène
- Compteurs animés : production, consommation, batterie
- Narrateur actif pendant l'animation

### EVENT (1 jour sur 2, aléatoire)
- Carte événement s'affiche en overlay
- Impact immédiat sur la simulation
- Narrateur commente l'événement

### RECAP
- Bilan chiffré du jour (produit / consommé / acheté réseau)
- Jauges mises à jour (autonomie, CO₂, budget)
- Conseil du narrateur basé sur la performance

### SCORE FINAL (Jour 7)
- Score global : Autonomie % + CO₂ évité + Budget restant
- Évaluation narrative du narrateur (3 variantes)
- Carte PNG partageable générée
- Leaderboard (optionnel si temps)

## 4. Équipements

| Équipement | Coût | Effet | Contrainte |
|---|---|---|---|
| Panneau solaire (x1) | 800€ | +production selon région/météo | Surface toit max 6 panneaux |
| Batterie domestique | 2 000€ | Stocke 10 kWh | 1 seule par logement |
| Micro-éolienne | 1 500€ | +production si vent | Jardin requis (maison only) |
| Thermostat intelligent | 300€ | -15% conso chauffage | — |
| Ampoules LED | 100€ | -5% conso éclairage | — |
| Contrat heures creuses | 0€ | Décale conso nocturne | Réduit pic soir |

## 5. Événements aléatoires

| Événement | Probabilité | Impact |
|---|---|---|
| ☀️ Journée exceptionnelle | 15% | Production solaire x1.5 |
| ☁️ Semaine nuageuse | 20% | Production solaire -70% |
| 🌬️ Tempête | 10% | Éolienne HS 2 jours, solaire -50% |
| 🥵 Canicule | 15% | Conso +40% (clim) |
| ❄️ Vague de froid | 10% | Conso +35% (chauffage) |
| ⚡ Panne réseau quartier | 5% | Autonomie totale obligatoire 24h |
| 📈 Pic de prix électricité | 10% | Prix kWh x2 ce jour |
| 🌙 Nuit gaming | 15% | Conso nuit +25% |

## 6. Scoring

Score final = (Autonomie% × 50) + (CO₂_évité_kg × 0.5) + (Budget_restant / 100)

- **Autonomie** : kWh produits localement / kWh consommés totaux sur 7 jours
- **CO₂ évité** : kWh non achetés au réseau × facteur carbone RTE région
- **Budget restant** : bonus pour sobriété d'achat

### Paliers
- > 80 pts : "Pionnier énergétique"
- 50-80 pts : "En transition"
- < 50 pts : "Dépendant du réseau"

## 7. Profils utilisateur (27 combinaisons)

Chaque combinaison (logement × occupants × région) génère :
- Une consommation de base journalière (kWh/jour) depuis ADEME
- Un potentiel solaire (heures équivalent plein soleil) depuis RTE
- Une maison visuellement adaptée (taille, orientation, jardin)
- Des événements pondérés selon la région (canicule plus probable au Sud)

## 8. Contraintes de design

- La scène 3D doit être chargée AVANT l'onboarding
- Chaque phase dure max 30 secondes (expérience totale < 5 minutes)
- Tout doit fonctionner sans compte / sans auth
- Le score final doit être partageable en 1 clic (PNG + URL)
- Mobile-friendly (le jury peut tester sur téléphone)
