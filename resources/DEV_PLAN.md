# Plan de développement — Power My Life
> Hackathon Defend Intelligence — Remise vendredi 11h
> Démarrage : mercredi ~16h

## Ordre d'exécution des prompts Codex

| # | Prompt | Dépendances | Priorité |
|---|---|---|---|
| 1 | Setup projet | Aucune | 🔴 Critique |
| 2 | Game Store | Prompt 1 | 🔴 Critique |
| 3 | Données + moteur | Prompt 2 | 🔴 Critique |
| 4 | Scène R3F de base | Prompt 1 | 🔴 Critique |
| 5 | Maison réactive | Prompts 3 + 4 | 🔴 Critique |
| 6 | Cycle jour/nuit + météo | Prompt 4 | 🟡 Important |
| 7 | UI Dashboard + Shop | Prompts 2 + 3 | 🟡 Important |
| 8 | Onboarding narratif | Prompts 3 + 4 | 🟡 Important |
| 9 | GameController | Tous précédents | 🟡 Important |
| 10 | Score final | Prompt 9 | 🟢 Nice to have |
| 11 | Polish + déploiement | Tous | 🟢 Nice to have |

## Toi vs Codex

| Tâche | Qui |
|---|---|
| Écrire les prompts Codex | Toi |
| Générer le code | Codex |
| Composition de la scène isométrique | Toi (ajustements caméra, lumière) |
| Assets 3D (téléchargement/placeholder) | Toi |
| Game feel (timings, animations) | Toi |
| Tests manuels de chaque phase | Toi |
| Identité visuelle finale | Toi |
| Déploiement Vercel | Codex (prompt 11) |

## Ce que tu fais EN PARALLÈLE pendant que Codex tourne

1. **Télécharger les assets 3D** depuis Kenney.nl ou générer avec Midjourney
2. **Préparer les placeholders GLB** si les vrais assets tardent
3. **Tester la scène R3F** dès le prompt 4 terminé
4. **Choisir le nom final** du jeu
5. **Préparer la démo** : scénario de 2 minutes à répéter

## Checklist MVP minimum pour vendredi

- [ ] Onboarding 3 questions fonctionnel
- [ ] Scène isométrique visible (même avec placeholders)
- [ ] 1 jour simulé complet (PLANNING → SIMULATING → RECAP)
- [ ] Au moins 3 équipements achetables
- [ ] Au moins 2 événements aléatoires
- [ ] Score final affiché
- [ ] Déployé sur Vercel avec une URL

## Checklist idéale si temps suffisant

- [ ] Assets 3D réels (pas des BoxGeometry)
- [ ] Cycle jour/nuit animé
- [ ] Météo visible sur la scène
- [ ] Carte partageable générée en PNG
- [ ] Tous les 7 jours jouables
- [ ] Tous les événements implémentés
- [ ] Textes narrateur pour chaque situation
- [ ] Mobile responsive

## URLs utiles

- Assets Kenney : https://kenney.nl/assets/series:Isometric%20Miniature
- Assets itch.io : https://itch.io/game-assets/free/tag-isometric
- Données ADEME : https://data.ademe.fr/datasets/base-carboner
- API RTE eCO2mix : https://www.data.gouv.fr/datasets/donnees-eco2mix-nationales-temps-reel-1
- Déploiement : https://vercel.com

## Commandes essentielles

```bash
# Démarrer le dev
npm run dev

# Vérifier les types
npm run type-check

# Build de production
npm run build

# Déployer
vercel --prod
```
