# Intégration 3D dans le QCM Étude — Design

Date : 2026-07-01
Application cible : `Jeu_Etude/` (le jeu QCM, PAS la démo `3d-demo/`)

## Objectif

Ajouter une couche 3D (Three.js) à l'application QCM existante pour la rendre
plus moderne et immersive, sans changer la façon de jouer ni casser l'existant.
Quatre éléments 3D, tous partageant un seul moteur WebGL, branchés en douceur
sur la logique actuelle.

## Contexte de l'existant

- SPA en JavaScript vanilla, thème sombre indigo (`--primary: #4f46e5`,
  `--primary-light: #818cf8`, `--success: #10b981`, `--bg: #0f172a`).
- Organisée en « écrans » (`<div class="screen">` : home, quiz, results,
  history, leaderboard, custom) affichés via `showScreen(id)` dans `app.js`
  (retire `.active` de tous, ajoute `.active` à la cible).
- Boutons via `onclick="..."` inline partout ; icônes Font Awesome (CDN).
- Aucune CSP actuellement sur `index.html`.

## Approche retenue

Une **seule couche 3D partagée** : un unique canvas WebGL plein écran en fond,
piloté par un nouveau module `three-fx.js`. Ce module expose une petite API que
`app.js` appelle aux bons moments (« hooks »). Les 4 effets partagent le même
renderer et la même scène → performant, peu de code.

*Alternatives écartées :* un canvas WebGL par écran (plusieurs contextes =
lourd) ; une lib de post-processing avancée (surdimensionné, risque mobile).

## Fichiers

| Fichier | Rôle | Nature du changement |
|---|---|---|
| `three-fx.js` | Toute la logique 3D (scène, effets, API publique) | **Créé** |
| `index.html` | Charger Three.js (import-map) + canvas de fond + toggle réglages | Modifié (ajouts) |
| `app.js` | Appels de hook vers `three-fx.js` | Modifié (quelques lignes) |
| `style.css` | Positionnement du canvas de fond + style du toggle | Modifié (ajouts) |
| `i18n.js` | Libellé du toggle « Effets 3D » (FR/EN) | Modifié (2 clés) |

## API publique de `three-fx.js`

Le module s'auto-initialise au chargement et expose un objet global `ThreeFX` :

- `ThreeFX.init()` — crée renderer/scène/caméra sur `<canvas id="fx-canvas">`.
  Si WebGL indisponible ou effets désactivés, ne fait rien (no-op silencieux).
- `ThreeFX.setScreen(screenId)` — appelée à chaque changement d'écran ; adapte
  ce qui est visible (objet d'accueil visible seulement sur `home-screen`,
  trophée seulement sur `results-screen`).
- `ThreeFX.celebrate()` — déclenche la salve de particules « bonne réponse ».
- `ThreeFX.showTrophy(percent)` — configure la couleur du trophée selon le score
  (or ≥ 80, argent ≥ 50, bronze sinon).
- `ThreeFX.setEnabled(bool)` — active/désactive tous les effets, persiste en
  `localStorage` (`qcm_fx_enabled`), affiche/masque le canvas.
- `ThreeFX.isEnabled()` — lit l'état courant (défaut : activé, sauf reduced-motion
  ou appareil faible).

## Les quatre éléments 3D

### 1. Fond d'ambiance global
- Champ de particules aux couleurs indigo (`#4f46e5` / `#818cf8`), flottement
  lent + légère parallaxe à la position de la souris.
- Canvas `position: fixed; inset: 0; z-index: -1` (sous toute l'UI), opacité
  basse pour ne jamais gêner la lecture du texte.
- Visible sur tous les écrans.

### 2. Objet 3D sur l'accueil
- Un **chapeau de diplômé (mortarboard)** en 3D, construit en géométries code
  (une plaque carrée aplatie inclinée + une calotte + un pompon), couleur indigo.
  Repli : si le rendu n'est pas satisfaisant, un icosaèdre facetté indigo.
- Rotation automatique lente ; pivotable à la souris (glisser).
- Visible uniquement quand `screenId === 'home-screen'`.

### 3. Récompense sur les résultats
- Un **trophée** 3D (coupe : vasque + tige + socle en géométries code) qui tourne.
- Couleur métallique selon le score fourni par `showTrophy(percent)` :
  or (`#ffd700`) ≥ 80 %, argent (`#c0c0c0`) ≥ 50 %, bronze (`#cd7f32`) sinon.
- Visible uniquement quand `screenId === 'results-screen'`.

### 4. Effet « bonne réponse »
- Brève salve de particules 3D vertes (`--success #10b981`) qui jaillissent puis
  s'estompent (~800 ms), déclenchée par `celebrate()` au clic sur la bonne réponse.
- Ne bloque pas l'interaction ; se termine seule.

## Transversal

### Performance & accessibilité
- **Toggle « Effets 3D » ON/OFF** dans l'appli (accueil, zone réglages),
  mémorisé en `localStorage`.
- Respect de `prefers-reduced-motion` (désactive les animations auto).
- **Auto-désactivation** si WebGL absent, ou heuristique « appareil faible »
  (`navigator.hardwareConcurrency <= 2`).
- Boucle `requestAnimationFrame` en pause quand `document.hidden`.
- `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`, nombre de particules
  raisonnable (~800), redimensionnement au `resize`.

### Dégradation propre
- Si WebGL indisponible ou effets OFF : l'appli fonctionne exactement comme
  aujourd'hui, canvas masqué, **aucune erreur console**. Tous les hooks sont des
  no-op sûrs.

### Sécurité
- Three.js chargé depuis le même CDN que la démo (`unpkg.com`, version 0.160.0).
- **Pas de CSP stricte ajoutée maintenant** : `index.html` utilise partout des
  `onclick=""` inline ; une CSP `script-src` stricte les casserait. Ajout noté
  comme amélioration sécurité **future** (nécessiterait de retirer les handlers
  inline — hors périmètre ici). On reste iso-comportement.
- Aucune nouvelle entrée utilisateur, aucun `innerHTML` avec données externes
  introduit par cette fonctionnalité.

## Hors périmètre (YAGNI)

- Pas de modèles 3D externes (`.glb/.gltf`) — tout en géométries code.
- Pas de sons, pas de refonte du design/UX existant.
- Pas de refactor des `onclick` inline ni ajout de CSP (suivi futur).

## Critères de réussite

- Les 4 effets s'affichent au bon moment et sont fluides sur un desktop moyen.
- Le toggle désactive/réactive proprement toute la 3D, choix mémorisé.
- Sans WebGL ou effets OFF : le QCM marche comme avant, zéro erreur.
- Aucune régression de la logique de quiz existante (scores, timers, modes,
  duel, historique, classement, questions perso restent intacts).
