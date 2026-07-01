# Intégration 3D dans le QCM — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter quatre effets 3D (fond d'ambiance, chapeau de diplômé sur l'accueil, trophée sur les résultats, salve « bonne réponse ») à l'app QCM via un module `three-fx.js` partagé, sans casser l'existant.

**Architecture:** Un unique canvas WebGL plein écran en fond (`#fx-canvas`, `z-index:-1`), piloté par un objet global `ThreeFX` dans `three-fx.js`. `app.js` appelle des hooks (`ThreeFX.setScreen`, `.celebrate`, `.showTrophy`). Tous les hooks sont des no-op sûrs si la 3D est désactivée ou WebGL absent, donc l'app dégrade proprement.

**Tech Stack:** JavaScript ES modules, Three.js 0.160.0 (CDN unpkg via import-map), OrbitControls.

## Global Constraints

- Three.js **0.160.0** chargé depuis `https://unpkg.com/three@0.160.0/` via import-map.
- Tout le code 3D dans **`three-fx.js`** (nouveau) ; modifications minimales ailleurs.
- Objets 3D **générés en code** (aucun modèle `.glb/.gltf` externe).
- Couleurs du thème : indigo `#4f46e5` / `#818cf8`, succès `#10b981`, fond `#0f172a`.
- Aucun emoji dans le code écrit (règle utilisateur) — géométries/SVG uniquement.
- **Pas de CSP stricte ajoutée** (l'app utilise des `onclick=""` inline ; une CSP les casserait). Suivi futur.
- Dégradation propre : sans WebGL ou effets OFF, l'app marche comme avant, **zéro erreur console**.
- Respect de `prefers-reduced-motion` ; pause du rendu si `document.hidden`.
- `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))` ; ~800 particules max ; resize géré.
- Vérification de chaque tâche : ouvrir l'app dans le navigateur (via `python -m http.server`), console sans erreur.

**Rappel serveur local (les modules ES nécessitent http, pas file://) :**
```bash
cd "C:/Users/3MKSTORE/Desktop/MyGitHub/Jeu_Etude"
python -m http.server 5500
# puis http://127.0.0.1:5500/
```

---

### Task 1: Socle — canvas, module `ThreeFX`, détection, fond d'ambiance, hook `showScreen`

**Files:**
- Create: `Jeu_Etude/three-fx.js`
- Modify: `Jeu_Etude/index.html` (ajouter import-map, canvas, chargement du module)
- Modify: `Jeu_Etude/style.css` (positionnement du canvas)
- Modify: `Jeu_Etude/app.js:122-126` (hook dans `showScreen`)

**Interfaces:**
- Consumes: rien.
- Produces: objet global `window.ThreeFX` avec :
  - `ThreeFX.isEnabled() -> boolean`
  - `ThreeFX.setEnabled(bool) -> void` (persiste `localStorage['qcm_fx_enabled']`)
  - `ThreeFX.setScreen(screenId: string) -> void`
  - `ThreeFX.celebrate() -> void` (no-op à cette tâche, complété Task 4)
  - `ThreeFX.showTrophy(percent: number) -> void` (no-op à cette tâche, complété Task 3)
  - Internes réutilisés plus tard : `scene`, `camera`, `renderer`, `_enabled`, `_currentScreen`.

- [ ] **Step 1: Ajouter le canvas et le module dans `index.html`.** Juste après `<body>` (avant `<!-- HOME -->`), insérer le canvas ; et remplacer le bloc de `<script>` de fin pour ajouter l'import-map + le module.

Insérer après la ligne `<body>` :
```html
  <canvas id="fx-canvas" aria-hidden="true"></canvas>
```

Remplacer :
```html
  <script src="i18n.js"></script>
  <script src="questions.js"></script>
  <script src="questions_en.js"></script>
  <script src="app.js"></script>
```
par :
```html
  <script src="i18n.js"></script>
  <script src="questions.js"></script>
  <script src="questions_en.js"></script>
  <script src="app.js"></script>

  <script type="importmap">
  {
    "imports": {
      "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
      "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
    }
  }
  </script>
  <script type="module" src="three-fx.js"></script>
```

- [ ] **Step 2: Positionner le canvas en fond dans `style.css`.** Ajouter à la fin du fichier :

```css
/* ── Couche 3D (three-fx.js) ── */
#fx-canvas {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;          /* derrière toute l'UI */
  pointer-events: none;  /* n'intercepte pas les clics de l'app... */
  display: block;
}
#fx-canvas.fx-interactive {
  pointer-events: auto;  /* ...sauf quand un objet manipulable est actif (accueil) */
}
#fx-canvas.fx-hidden { display: none; }
```

- [ ] **Step 3: Créer `three-fx.js`** avec le socle : détection, état activé, renderer/scène/caméra, fond de particules indigo, boucle de rendu, API publique (celebrate/showTrophy en no-op pour l'instant).

```js
import * as THREE from 'three';

const FX = {
  scene: null, camera: null, renderer: null, canvas: null,
  particles: null,
  _enabled: false,
  _currentScreen: 'home-screen',
  _pointer: { x: 0, y: 0 },
};

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch (e) { return false; }
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function computeDefaultEnabled() {
  const stored = localStorage.getItem('qcm_fx_enabled');
  if (stored === 'true') return true;
  if (stored === 'false') return false;
  // Défaut : activé sauf appareil faible ou reduced-motion
  if (prefersReducedMotion()) return false;
  if ((navigator.hardwareConcurrency || 4) <= 2) return false;
  return true;
}

function buildBackground() {
  const COUNT = 800;
  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT * 3; i++) positions[i] = (Math.random() - 0.5) * 30;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  FX.particles = new THREE.Points(
    geo,
    new THREE.PointsMaterial({ color: 0x818cf8, size: 0.06, transparent: true, opacity: 0.5 })
  );
  FX.scene.add(FX.particles);
}

function onResize() {
  if (!FX.renderer) return;
  FX.camera.aspect = window.innerWidth / window.innerHeight;
  FX.camera.updateProjectionMatrix();
  FX.renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  if (!FX._enabled || !FX.renderer || document.hidden) return;
  if (!prefersReducedMotion()) {
    FX.particles.rotation.y += 0.0003;
    FX.particles.position.x += (FX._pointer.x * 1.5 - FX.particles.position.x) * 0.02;
    FX.particles.position.y += (-FX._pointer.y * 1.5 - FX.particles.position.y) * 0.02;
  }
  FX.renderer.render(FX.scene, FX.camera);
}

function init() {
  FX.canvas = document.getElementById('fx-canvas');
  if (!FX.canvas) return;
  FX._enabled = computeDefaultEnabled();

  if (!webglAvailable()) {
    FX._enabled = false;
    FX.canvas.classList.add('fx-hidden');
    return; // no-op total : l'app marche comme avant
  }

  FX.renderer = new THREE.WebGLRenderer({ canvas: FX.canvas, antialias: true, alpha: true });
  FX.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  FX.renderer.setSize(window.innerWidth, window.innerHeight);

  FX.scene = new THREE.Scene();
  FX.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  FX.camera.position.z = 6;

  FX.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(3, 4, 5);
  FX.scene.add(key);

  buildBackground();

  window.addEventListener('resize', onResize);
  window.addEventListener('pointermove', (e) => {
    FX._pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    FX._pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  FX.canvas.classList.toggle('fx-hidden', !FX._enabled);
  animate();
}

// ─── API publique ───
window.ThreeFX = {
  isEnabled() { return FX._enabled; },
  setEnabled(on) {
    FX._enabled = !!on && webglAvailable();
    localStorage.setItem('qcm_fx_enabled', FX._enabled ? 'true' : 'false');
    if (FX.canvas) FX.canvas.classList.toggle('fx-hidden', !FX._enabled);
  },
  setScreen(screenId) { FX._currentScreen = screenId; },
  celebrate() { /* complété Task 4 */ },
  showTrophy(_percent) { /* complété Task 3 */ },
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
```

- [ ] **Step 4: Brancher le hook dans `app.js` `showScreen`** (l.122-126). Remplacer :

```js
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
  window.scrollTo(0, 0);
}
```
par :
```js
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
  window.scrollTo(0, 0);
  if (window.ThreeFX) ThreeFX.setScreen(id);
}
```

- [ ] **Step 5: Vérifier dans le navigateur.** Lancer le serveur, ouvrir `http://127.0.0.1:5500/`. Attendu : des particules indigo flottent en fond derrière l'accueil ; l'app QCM fonctionne normalement (cliquer une matière, démarrer un quiz). **Console sans erreur.** Vérifier aussi `node --check three-fx.js` → pas d'erreur de syntaxe.

- [ ] **Step 6: Commit**

```bash
git add index.html style.css three-fx.js app.js
git commit -m "feat(3d): socle ThreeFX + fond d'ambiance + hook showScreen"
```

---

### Task 2: Chapeau de diplômé 3D sur l'accueil

**Files:**
- Modify: `Jeu_Etude/three-fx.js`

**Interfaces:**
- Consumes: `FX.scene`, `FX.camera`, `FX.canvas`, `FX._currentScreen`, `animate()`, `prefersReducedMotion()`, `setScreen`.
- Produces: `FX.cap` (THREE.Group, chapeau) ; contrôle `FX.controls` (OrbitControls) actif seulement sur l'accueil ; `updateScreenVisibility()` qui montre/cache `FX.cap` selon l'écran.

- [ ] **Step 1: Importer OrbitControls** en haut de `three-fx.js`, après l'import THREE :

```js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
```

- [ ] **Step 2: Construire le chapeau de diplômé.** Ajouter une fonction et l'appeler dans `init()` juste après `buildBackground();` :

```js
function buildCap() {
  FX.cap = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x4f46e5, metalness: 0.3, roughness: 0.4 });

  // Calotte (demi-sphère aplatie)
  const crown = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat);
  crown.scale.y = 0.5;
  crown.position.y = -0.05;
  FX.cap.add(crown);

  // Plaque carrée (mortarboard)
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.06, 1.5), mat);
  board.position.y = 0.25;
  FX.cap.add(board);

  // Bouton central
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0x818cf8, metalness: 0.4, roughness: 0.3 }));
  knob.position.y = 0.3;
  FX.cap.add(knob);

  // Pompon (fil + gland)
  const tasselMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.2, roughness: 0.5 });
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.7, 8), tasselMat);
  cord.position.set(0.55, 0.05, 0.55);
  FX.cap.add(cord);
  const tassel = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 12), tasselMat);
  tassel.position.set(0.55, -0.35, 0.55);
  FX.cap.add(tassel);

  FX.cap.visible = false;
  FX.scene.add(FX.cap);

  FX.controls = new OrbitControls(FX.camera, FX.canvas);
  FX.controls.enableDamping = true;
  FX.controls.enablePan = false;
  FX.controls.enableZoom = false;
  FX.controls.enabled = false; // activé seulement sur l'accueil
}
```

- [ ] **Step 3: Ajouter la gestion de visibilité par écran.** Ajouter la fonction et l'appeler à la fin de `init()` (avant `animate();`) et modifier `setScreen` dans l'API :

```js
function updateScreenVisibility() {
  const onHome = FX._currentScreen === 'home-screen';
  if (FX.cap) FX.cap.visible = onHome;
  if (FX.controls) FX.controls.enabled = onHome;
  if (FX.canvas) FX.canvas.classList.toggle('fx-interactive', onHome);
}
```

Dans l'objet `window.ThreeFX`, remplacer :
```js
  setScreen(screenId) { FX._currentScreen = screenId; },
```
par :
```js
  setScreen(screenId) { FX._currentScreen = screenId; updateScreenVisibility(); },
```

Et dans `init()`, ajouter juste avant `animate();` :
```js
  updateScreenVisibility();
```

- [ ] **Step 4: Animer le chapeau** dans `animate()`, à l'intérieur du bloc `if (!prefersReducedMotion())` :

```js
    if (FX.cap && FX.cap.visible) FX.cap.rotation.y += 0.006;
```

Et, toujours dans `animate()`, après le bloc reduced-motion mais avant `FX.renderer.render(...)`, ajouter la mise à jour des contrôles :
```js
  if (FX.controls && FX.controls.enabled) FX.controls.update();
```

- [ ] **Step 5: Vérifier dans le navigateur.** Sur l'accueil : le chapeau de diplômé indigo tourne au centre et se laisse pivoter à la souris (glisser). En démarrant un quiz : le chapeau disparaît. Retour accueil : il réapparaît. Console sans erreur.

- [ ] **Step 6: Commit**

```bash
git add three-fx.js
git commit -m "feat(3d): chapeau de diplome interactif sur l'accueil"
```

---

### Task 3: Trophée 3D sur l'écran de résultats (couleur selon le score)

**Files:**
- Modify: `Jeu_Etude/three-fx.js`
- Modify: `Jeu_Etude/app.js:703-711` (hook dans `showResults`)

**Interfaces:**
- Consumes: `FX.scene`, `FX._currentScreen`, `updateScreenVisibility()`, `animate()`, `prefersReducedMotion()`.
- Produces: `FX.trophy` (THREE.Group) ; `showTrophy(percent)` réel qui règle la couleur ;
  `updateScreenVisibility()` étendu pour afficher le trophée sur `results-screen`.

- [ ] **Step 1: Construire le trophée.** Ajouter une fonction et l'appeler dans `init()` après `buildCap();` :

```js
function buildTrophy() {
  FX.trophy = new THREE.Group();
  FX.trophyMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.25 });

  // Vasque (coupe)
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.25, 0.6, 24, 1, true), FX.trophyMat);
  cup.position.y = 0.5;
  FX.trophy.add(cup);
  // Fond de la coupe
  const base = new THREE.Mesh(new THREE.SphereGeometry(0.25, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), FX.trophyMat);
  base.rotation.x = Math.PI;
  base.position.y = 0.2;
  FX.trophy.add(base);
  // Anses
  const handleGeo = new THREE.TorusGeometry(0.18, 0.04, 12, 24);
  const hL = new THREE.Mesh(handleGeo, FX.trophyMat); hL.position.set(-0.5, 0.55, 0); hL.rotation.y = Math.PI / 2; FX.trophy.add(hL);
  const hR = new THREE.Mesh(handleGeo, FX.trophyMat); hR.position.set(0.5, 0.55, 0); hR.rotation.y = Math.PI / 2; FX.trophy.add(hR);
  // Tige
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 16), FX.trophyMat);
  stem.position.y = -0.05;
  FX.trophy.add(stem);
  // Socle
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.2, 24), FX.trophyMat);
  foot.position.y = -0.32;
  FX.trophy.add(foot);

  FX.trophy.visible = false;
  FX.scene.add(FX.trophy);
}
```

- [ ] **Step 2: Étendre `updateScreenVisibility()`** pour le trophée. Remplacer la fonction par :

```js
function updateScreenVisibility() {
  const onHome = FX._currentScreen === 'home-screen';
  const onResults = FX._currentScreen === 'results-screen';
  if (FX.cap) FX.cap.visible = onHome;
  if (FX.controls) FX.controls.enabled = onHome;
  if (FX.trophy) FX.trophy.visible = onResults;
  if (FX.canvas) FX.canvas.classList.toggle('fx-interactive', onHome);
}
```

- [ ] **Step 3: Implémenter `showTrophy(percent)`** dans l'API. Remplacer :
```js
  showTrophy(_percent) { /* complété Task 3 */ },
```
par :
```js
  showTrophy(percent) {
    if (!FX.trophyMat) return;
    const color = percent >= 80 ? 0xffd700 : percent >= 50 ? 0xc0c0c0 : 0xcd7f32;
    FX.trophyMat.color.setHex(color);
  },
```

- [ ] **Step 4: Animer le trophée** dans `animate()`, dans le bloc `if (!prefersReducedMotion())` :

```js
    if (FX.trophy && FX.trophy.visible) FX.trophy.rotation.y += 0.01;
```

- [ ] **Step 5: Brancher le hook dans `app.js` `showResults`.** Après la ligne `const pct   = total > 0 ? Math.round((score / total) * 100) : 0;` (l.710), ajouter :

```js
  if (window.ThreeFX) ThreeFX.showTrophy(pct);
```

- [ ] **Step 6: Vérifier dans le navigateur.** Terminer un quiz : sur l'écran de résultats, un trophée 3D tourne. Score ≥ 80 % → doré ; 50-79 % → argenté ; < 50 % → bronze. Quitter l'écran : le trophée disparaît. Console sans erreur.

- [ ] **Step 7: Commit**

```bash
git add three-fx.js app.js
git commit -m "feat(3d): trophee de resultats colore selon le score"
```

---

### Task 4: Salve de particules « bonne réponse »

**Files:**
- Modify: `Jeu_Etude/three-fx.js`
- Modify: `Jeu_Etude/app.js:562-563` (hook dans `handleAnswer`)

**Interfaces:**
- Consumes: `FX.scene`, `FX.camera`, `animate()`.
- Produces: `celebrate()` réel qui émet une salve temporaire de particules vertes ;
  état interne `FX._burst` mis à jour dans `animate()`.

- [ ] **Step 1: Créer le système de salve.** Ajouter dans `three-fx.js` (fonction + état) et l'appeler dans `init()` après `buildTrophy();` :

```js
function buildBurst() {
  const COUNT = 120;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
  FX._burstVel = new Float32Array(COUNT * 3);
  FX._burst = new THREE.Points(
    geo,
    new THREE.PointsMaterial({ color: 0x10b981, size: 0.12, transparent: true, opacity: 0 })
  );
  FX._burst.frustumCulled = false;
  FX._burstLife = 0; // 0 = inactif
  FX.scene.add(FX._burst);
}
```

- [ ] **Step 2: Implémenter `celebrate()`** dans l'API. Remplacer :
```js
  celebrate() { /* complété Task 4 */ },
```
par :
```js
  celebrate() {
    if (!FX._enabled || !FX._burst) return;
    const pos = FX._burst.geometry.attributes.position.array;
    // Origine : devant la caméra
    const ox = FX.camera.position.x, oy = FX.camera.position.y, oz = FX.camera.position.z - 4;
    for (let i = 0; i < pos.length; i += 3) {
      pos[i] = ox; pos[i + 1] = oy; pos[i + 2] = oz;
      FX._burstVel[i]     = (Math.random() - 0.5) * 0.25;
      FX._burstVel[i + 1] = (Math.random() - 0.5) * 0.25 + 0.12;
      FX._burstVel[i + 2] = (Math.random() - 0.5) * 0.25;
    }
    FX._burst.geometry.attributes.position.needsUpdate = true;
    FX._burstLife = 1; // plein
    FX._burst.material.opacity = 0.95;
  },
```

- [ ] **Step 3: Mettre à jour la salve dans `animate()`.** Ajouter, dans le bloc `if (!prefersReducedMotion())`, la simulation :

```js
    if (FX._burstLife > 0) {
      const pos = FX._burst.geometry.attributes.position.array;
      for (let i = 0; i < pos.length; i += 3) {
        pos[i]     += FX._burstVel[i];
        pos[i + 1] += FX._burstVel[i + 1];
        pos[i + 2] += FX._burstVel[i + 2];
        FX._burstVel[i + 1] -= 0.006; // gravité
      }
      FX._burst.geometry.attributes.position.needsUpdate = true;
      FX._burstLife -= 0.02;
      FX._burst.material.opacity = Math.max(0, FX._burstLife);
      if (FX._burstLife <= 0) FX._burst.material.opacity = 0;
    }
```

- [ ] **Step 4: Brancher le hook dans `app.js` `handleAnswer`.** Après la ligne `if (isCorrect) state.score++;` (l.563), ajouter :

```js
  if (isCorrect && window.ThreeFX) ThreeFX.celebrate();
```

- [ ] **Step 5: Vérifier dans le navigateur.** Démarrer un quiz et cliquer une **bonne** réponse : une brève salve de particules vertes jaillit puis s'estompe (~1 s). Une mauvaise réponse ne déclenche rien. Console sans erreur.

- [ ] **Step 6: Commit**

```bash
git add three-fx.js app.js
git commit -m "feat(3d): salve de particules sur bonne reponse"
```

---

### Task 5: Toggle « Effets 3D » ON/OFF (UI + i18n)

**Files:**
- Modify: `Jeu_Etude/index.html:24-35` (ajouter un bouton dans `home-nav`)
- Modify: `Jeu_Etude/app.js` (fonction `toggleFx`)
- Modify: `Jeu_Etude/i18n.js` (2 clés FR/EN)

**Interfaces:**
- Consumes: `ThreeFX.isEnabled()`, `ThreeFX.setEnabled(bool)`.
- Produces: fonction globale `toggleFx()` appelée par le bouton ; état visuel `.active` du bouton.

- [ ] **Step 1: Ajouter le bouton toggle dans `home-nav`** (`index.html`). Après le bouton « Mes questions » et avant `lang-btn` (autour de la l.33), insérer :

```html
        <button class="nav-btn" id="fx-toggle-btn" onclick="toggleFx()" data-i18n-title="nav.fx" title="Effets 3D">
          <i class="fa-solid fa-cube"></i>
        </button>
```

- [ ] **Step 2: Ajouter la fonction `toggleFx` dans `app.js`.** Ajouter juste après la fonction `openCustom()` (autour de l.147) :

```js
function toggleFx() {
  if (!window.ThreeFX) return;
  const on = !ThreeFX.isEnabled();
  ThreeFX.setEnabled(on);
  syncFxToggleBtn();
}

function syncFxToggleBtn() {
  const btn = document.getElementById('fx-toggle-btn');
  if (!btn || !window.ThreeFX) return;
  btn.classList.toggle('active', ThreeFX.isEnabled());
}
```

- [ ] **Step 3: Synchroniser l'état du bouton au démarrage.** Le bas de `app.js` contient le bloc d'init suivant. Le remplacer :

```js
window.addEventListener('DOMContentLoaded', () => {
  initHome();
  showScreen('home-screen');
  _applyStaticTranslations();
  updateLangBtn();
});
```
par :
```js
window.addEventListener('DOMContentLoaded', () => {
  initHome();
  showScreen('home-screen');
  _applyStaticTranslations();
  updateLangBtn();
  syncFxToggleBtn();
});
```

- [ ] **Step 4: Ajouter les libellés i18n.** Dans `i18n.js`, ajouter la clé `nav.fx` dans les dictionnaires FR et EN, à côté des autres clés `nav.*`.

Dans le bloc français (là où se trouvent `"nav.history"`, `"nav.leaderboard"`, `"nav.myquestions"`), ajouter :
```js
    "nav.fx": "Effets 3D",
```
Dans le bloc anglais correspondant, ajouter :
```js
    "nav.fx": "3D effects",
```

- [ ] **Step 5: Vérifier dans le navigateur.** Sur l'accueil, un bouton cube apparaît dans la barre de navigation. Cliquer : les effets 3D se coupent (fond + chapeau disparaissent, canvas masqué) ; recliquer : ils reviennent. Recharger la page : l'état choisi est conservé (via `localStorage`). Passer la langue en EN : le title du bouton devient « 3D effects ». Console sans erreur.

- [ ] **Step 6: Commit**

```bash
git add index.html app.js i18n.js
git commit -m "feat(3d): toggle Effets 3D ON/OFF (persistant + i18n)"
```

---

### Task 6: Finition — README + vérification de non-régression

**Files:**
- Modify: `Jeu_Etude/README.md`

**Interfaces:**
- Consumes: tout ce qui précède.
- Produces: rien.

- [ ] **Step 1: Documenter la 3D du QCM dans `README.md`.** Ajouter une section après le tableau « Contenu du dépôt » :

```markdown
## Effets 3D dans le QCM

Le jeu intègre une couche 3D (Three.js) optionnelle :
- **Fond d'ambiance** de particules indigo sur tous les écrans.
- **Chapeau de diplômé 3D** manipulable sur l'accueil.
- **Trophée 3D** sur les résultats (doré / argenté / bronze selon le score).
- **Salve de particules** à chaque bonne réponse.

Un bouton **cube** dans la barre de navigation active/désactive tous les effets
(choix mémorisé). Les effets se coupent automatiquement si le navigateur n'a pas
WebGL, sur les appareils faibles, ou si `prefers-reduced-motion` est actif —
l'app reste alors 100 % fonctionnelle.
```

- [ ] **Step 2: Vérification de non-régression complète.** Ouvrir l'app et vérifier que les fonctions existantes marchent toujours : sélection d'une matière, démarrage d'un quiz (mode normal), réponses, écran de résultats, historique, classement, questions perso, bascule de langue FR/EN. Puis désactiver la 3D via le toggle et revérifier qu'aucun comportement ne change. Console sans erreur dans tous les cas.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: documente les effets 3D du QCM"
```

---

## Self-Review

**Spec coverage :**
- Fond d'ambiance global -> Task 1 (`buildBackground`). OK
- Objet 3D accueil (chapeau) -> Task 2 (`buildCap`, visible home). OK
- Trophée résultats coloré -> Task 3 (`buildTrophy`, `showTrophy`). OK
- Effet bonne réponse -> Task 4 (`buildBurst`, `celebrate`, hook `handleAnswer`). OK
- API `ThreeFX` (init/setScreen/celebrate/showTrophy/setEnabled/isEnabled) -> Task 1 définit tout ; Task 3/4 complètent showTrophy/celebrate. OK
- Toggle ON/OFF persistant + i18n -> Task 5. OK
- prefers-reduced-motion, auto-désactivation appareil faible/WebGL absent, pause onglet caché -> Task 1 (`computeDefaultEnabled`, `webglAvailable`, `animate`). OK
- Dégradation propre / no-op sûrs -> Task 1 (init retourne tôt sans WebGL ; hooks gardés par `window.ThreeFX`). OK
- Pas de CSP stricte -> respecté (aucune CSP ajoutée). OK
- Couleurs thème, ~800 particules, pixelRatio clamp, resize -> Task 1. OK
- Hooks app.js aux bons endroits -> showScreen (T1), showResults (T3), handleAnswer (T4). OK

**Placeholder scan :** les commentaires « complété Task N » dans le socle Task 1 sont
des no-op **volontaires et fonctionnels** (l'app marche), remplacés par du vrai code en
Task 3 et 4. Aucun autre TBD/TODO ; tout le code est fourni.

**Type consistency :** API stable d'une tâche à l'autre : `setScreen(screenId)`,
`celebrate()`, `showTrophy(percent)`, `setEnabled(bool)`, `isEnabled()`.
Internes cohérents : `FX.scene/camera/renderer/canvas/particles/cap/controls/trophy/
trophyMat/_burst/_burstVel/_burstLife/_enabled/_currentScreen/_pointer`.
`updateScreenVisibility()` définie Task 2, étendue Task 3 (même nom). `toggleFx()` /
`syncFxToggleBtn()` cohérents Task 5.
