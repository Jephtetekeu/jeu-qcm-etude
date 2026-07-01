# Démo vitrine 3D — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire une page web de démonstration montrant trois styles de 3D web (objet central interactif, fond de particules, scène immersive au scroll) avec Three.js pur, dans `Jeu_Etude/3d-demo/`.

**Architecture:** Une seule scène WebGL plein écran en canvas fixé en fond. Le contenu HTML scrolle par-dessus. Un observateur de scroll détermine la section active et pilote caméra/objets. Boucle `requestAnimationFrame` mise en pause quand l'onglet est caché ou si `prefers-reduced-motion` est actif.

**Tech Stack:** HTML5, CSS3, JavaScript ES modules, Three.js (CDN via import-map), OrbitControls (add-on Three.js).

## Global Constraints

- Techno : Three.js **pur** chargé par CDN import-map — aucune installation, aucun build.
- Version Three.js : **0.160.0** (fixée, chargée depuis `https://unpkg.com/three@0.160.0/`).
- Tout le code vit dans `Jeu_Etude/3d-demo/` — ne modifie AUCUN fichier existant du jeu.
- Objets 3D générés en code (géométries Three.js) — aucun modèle externe `.glb/.gltf`.
- Aucun emoji dans l'UI — formes/icônes SVG uniquement.
- Respect de `prefers-reduced-motion` : animation en pause si actif.
- Sécurité (page statique) : meta CSP autorisant uniquement `unpkg.com` pour scripts,
  `X-Content-Type-Options: nosniff` (meta), `Referrer-Policy: strict-origin-when-cross-origin`,
  aucun `innerHTML` avec données dynamiques, aucune entrée utilisateur.
- Vérification de chaque tâche : ouvrir la page dans le navigateur, console sans erreur.

---

### Task 1: Squelette de page + scène Three.js vide qui tourne

**Files:**
- Create: `Jeu_Etude/3d-demo/index.html`
- Create: `Jeu_Etude/3d-demo/style.css`
- Create: `Jeu_Etude/3d-demo/main.js`

**Interfaces:**
- Consumes: rien (première tâche).
- Produces: dans `main.js`, une scène exportée implicitement via l'état de module :
  `scene` (THREE.Scene), `camera` (THREE.PerspectiveCamera), `renderer` (THREE.WebGLRenderer),
  et une fonction `animate()` appelée par `requestAnimationFrame`. Une fonction `onResize()`
  attachée à l'événement `resize`. Un helper `prefersReducedMotion()` -> boolean.

- [ ] **Step 1: Créer `index.html`** avec l'import-map, les meta de sécurité, un canvas host et 3 sections HTML vides (juste les balises + titres, contenu détaillé aux tâches suivantes).

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'self'; script-src 'self' https://unpkg.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://unpkg.com; base-uri 'none'; object-src 'none'" />
  <meta http-equiv="X-Content-Type-Options" content="nosniff" />
  <meta name="referrer" content="strict-origin-when-cross-origin" />
  <title>Démo 3D — Three.js</title>
  <link rel="stylesheet" href="style.css" />
  <script type="importmap">
  {
    "imports": {
      "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
      "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
    }
  }
  </script>
</head>
<body>
  <canvas id="scene"></canvas>
  <main>
    <section id="s1" class="panel"><div class="content"><h1>Objet 3D</h1><p>Glisse pour faire pivoter. Molette pour zoomer.</p></div></section>
    <section id="s2" class="panel"><div class="content"><h2>Fond d'ambiance</h2><p>Des particules qui réagissent à la souris.</p><button type="button" id="cta">Un bouton classique</button></div></section>
    <section id="s3" class="panel"><div class="content"><h2>Scène immersive</h2><p>La caméra avance au fil du scroll.</p></div></section>
  </main>
  <script type="module" src="main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Créer `style.css`** — canvas fixé plein écran en fond, sections plein écran empilées, contenu lisible par-dessus.

```css
* { margin: 0; box-sizing: border-box; }
:root { --ink: #f5f5f7; --bg: #0a0a12; }
html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--ink); font-family: system-ui, -apple-system, "Segoe UI", sans-serif; }
#scene { position: fixed; inset: 0; width: 100vw; height: 100vh; display: block; z-index: 0; }
main { position: relative; z-index: 1; }
.panel { min-height: 100vh; display: flex; align-items: center; padding: 8vw; }
#s2 .content, #s3 .content { max-width: 32rem; }
h1 { font-size: clamp(2.5rem, 8vw, 6rem); font-weight: 800; letter-spacing: -0.02em; }
h2 { font-size: clamp(2rem, 6vw, 4rem); font-weight: 700; }
p { margin-top: 1rem; font-size: 1.125rem; opacity: 0.85; line-height: 1.6; }
button#cta { margin-top: 2rem; padding: 0.9rem 1.8rem; font-size: 1rem; border: 1px solid var(--ink); background: transparent; color: var(--ink); border-radius: 999px; cursor: pointer; transition: background 0.2s, color 0.2s; }
button#cta:hover { background: var(--ink); color: var(--bg); }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
```

- [ ] **Step 3: Créer `main.js`** — scène, caméra, renderer, resize, boucle d'animation avec pause onglet caché + reduced-motion. Un cube temporaire qui tourne pour prouver que ça marche.

```js
import * as THREE from 'three';

const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;

// Objet temporaire (remplacé Task 2)
const tempCube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshNormalMaterial()
);
scene.add(tempCube);

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize);

function animate() {
  requestAnimationFrame(animate);
  if (document.hidden) return;
  if (!prefersReducedMotion()) {
    tempCube.rotation.x += 0.01;
    tempCube.rotation.y += 0.01;
  }
  renderer.render(scene, camera);
}
animate();
```

- [ ] **Step 4: Vérifier dans le navigateur** — ouvrir `Jeu_Etude/3d-demo/index.html`. Attendu : un cube coloré qui tourne en fond, 3 sections scrollables par-dessus, **aucune erreur** dans la console (F12).

- [ ] **Step 5: Commit**

```bash
git add Jeu_Etude/3d-demo/index.html Jeu_Etude/3d-demo/style.css Jeu_Etude/3d-demo/main.js
git commit -m "feat(3d-demo): squelette page + scene Three.js de base"
```

---

### Task 2: Section 1 — objet central interactif (OrbitControls)

**Files:**
- Modify: `Jeu_Etude/3d-demo/main.js`

**Interfaces:**
- Consumes: `scene`, `camera`, `renderer`, `animate()`, `prefersReducedMotion()` de Task 1.
- Produces: un objet `hero` (THREE.Mesh) et `controls` (OrbitControls) ; un groupe de
  lumières ajouté à la scène. `hero` tourne lentement dans `animate()`.

- [ ] **Step 1: Remplacer le cube temporaire par l'objet héros + lumières.** Dans `main.js`, supprimer le bloc `tempCube` et ajouter :

```js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Lumières
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
keyLight.position.set(3, 4, 5);
scene.add(keyLight);

// Objet héros : un icosaèdre "cristal"
const hero = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.3, 0),
  new THREE.MeshStandardMaterial({ color: 0x6c8cff, metalness: 0.3, roughness: 0.25, flatShading: true })
);
scene.add(hero);

// Contrôle souris
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 3;
controls.maxDistance = 8;
```

- [ ] **Step 2: Mettre à jour `animate()`** pour la rotation auto du héros + `controls.update()`. Remplacer les lignes qui touchaient `tempCube` par :

```js
  if (!prefersReducedMotion()) {
    hero.rotation.y += 0.005;
  }
  controls.update();
```

- [ ] **Step 3: Vérifier dans le navigateur** — un cristal bleu éclairé au centre, qui tourne lentement ; on peut le **faire pivoter à la souris** (glisser) et **zoomer à la molette** (entre distance 3 et 8). Console sans erreur.

- [ ] **Step 4: Commit**

```bash
git add Jeu_Etude/3d-demo/main.js
git commit -m "feat(3d-demo): section 1 objet central interactif + lumieres"
```

---

### Task 3: Section 2 — fond de particules réactif à la souris

**Files:**
- Modify: `Jeu_Etude/3d-demo/main.js`

**Interfaces:**
- Consumes: `scene`, `camera`, `animate()`, `prefersReducedMotion()`.
- Produces: `particles` (THREE.Points) ; variables module `pointer = { x: 0, y: 0 }`
  mises à jour par un listener `pointermove`. La parallaxe s'applique dans `animate()`.

- [ ] **Step 1: Créer le nuage de particules.** Ajouter dans `main.js` (après la création du héros) :

```js
// Particules de fond
const PARTICLE_COUNT = 900;
const positions = new Float32Array(PARTICLE_COUNT * 3);
for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 24;
}
const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particles = new THREE.Points(
  particleGeo,
  new THREE.PointsMaterial({ color: 0x8fa0ff, size: 0.05, transparent: true, opacity: 0.8 })
);
scene.add(particles);
```

- [ ] **Step 2: Suivre le pointeur** — ajouter le state et le listener :

```js
const pointer = { x: 0, y: 0 };
window.addEventListener('pointermove', (e) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
});
```

- [ ] **Step 3: Appliquer parallaxe + rotation lente** dans `animate()`, à l'intérieur du bloc `if (!prefersReducedMotion())` :

```js
    particles.rotation.y += 0.0004;
    particles.rotation.x += 0.0002;
    camera.position.x += (pointer.x * 0.5 - camera.position.x) * 0.03;
    camera.position.y += (-pointer.y * 0.5 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);
```

- [ ] **Step 4: Vérifier dans le navigateur** — en scrollant sur la section 2, des particules flottent en fond ; bouger la souris décale légèrement la vue (parallaxe). Console sans erreur.

- [ ] **Step 5: Commit**

```bash
git add Jeu_Etude/3d-demo/main.js
git commit -m "feat(3d-demo): section 2 particules reactives a la souris"
```

---

### Task 4: Section 3 — scène immersive pilotée par le scroll

**Files:**
- Modify: `Jeu_Etude/3d-demo/main.js`

**Interfaces:**
- Consumes: `camera`, `scene`, `hero`, `animate()`, `prefersReducedMotion()`.
- Produces: fonction `scrollProgress()` -> number (0..1 sur toute la page) ;
  un groupe `immersive` (THREE.Group) de plusieurs meshes révélés par le scroll.
  Le pilotage caméra/scroll s'applique dans `animate()`.

- [ ] **Step 1: Construire le groupe immersif.** Ajouter dans `main.js` :

```js
// Groupe de la scène immersive (section 3)
const immersive = new THREE.Group();
const palette = [0xff7a7a, 0x7affc4, 0xffd97a, 0x9b7aff, 0x7ad0ff];
for (let i = 0; i < 5; i++) {
  const m = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.4, 0.14, 80, 12),
    new THREE.MeshStandardMaterial({ color: palette[i], metalness: 0.2, roughness: 0.4 })
  );
  m.position.set((i - 2) * 2.2, 0, -i * 4 - 4);
  m.scale.setScalar(0.01); // caché au départ, révélé au scroll
  immersive.add(m);
}
scene.add(immersive);
```

- [ ] **Step 2: Ajouter le helper de progression scroll :**

```js
function scrollProgress() {
  const max = document.body.scrollHeight - window.innerHeight;
  return max > 0 ? window.scrollY / max : 0;
}
```

- [ ] **Step 3: Piloter caméra + révélation dans `animate()`.** Ajouter (après `controls.update()`), en dehors du bloc reduced-motion pour que le scroll fonctionne toujours :

```js
  const p = scrollProgress();
  // La caméra avance en profondeur dans le dernier tiers du scroll
  const depth = Math.max(0, (p - 0.66) / 0.34); // 0 avant la section 3, ->1 en bas
  camera.position.z = 5 - depth * 12;
  // Révélation progressive des objets immersifs
  immersive.children.forEach((mesh, i) => {
    const appear = THREE.MathUtils.clamp(depth * 5 - i, 0, 1);
    mesh.scale.setScalar(0.01 + appear * 0.99);
    if (!prefersReducedMotion()) mesh.rotation.z += 0.01;
  });
```

Note : comme `camera.position.z` est désormais piloté par le scroll, retirer/limiter le contrôle de zoom OrbitControls sur cet axe n'est pas nécessaire — OrbitControls agit surtout en section 1 ; l'effet reste lisible. Si un conflit visuel gêne, désactiver `controls.enableZoom` reste une option, mais hors périmètre ici.

- [ ] **Step 4: Vérifier dans le navigateur** — arrivé en bas (section 3), la caméra plonge en profondeur et 5 nœuds colorés apparaissent l'un après l'autre. Remonter inverse l'effet. Console sans erreur.

- [ ] **Step 5: Vérifier `prefers-reduced-motion`** — dans les DevTools (Rendering > Emulate CSS prefers-reduced-motion: reduce), recharger : les rotations auto s'arrêtent, mais le scroll et la navigation restent fonctionnels.

- [ ] **Step 6: Commit**

```bash
git add Jeu_Etude/3d-demo/main.js
git commit -m "feat(3d-demo): section 3 scene immersive pilotee par le scroll"
```

---

### Task 5: Finition — README court + vérification finale

**Files:**
- Create: `Jeu_Etude/3d-demo/README.md`

**Interfaces:**
- Consumes: tout ce qui précède.
- Produces: rien (documentation).

- [ ] **Step 1: Créer `README.md`** expliquant comment ouvrir la démo et ce que montre chaque section.

```markdown
# Démo vitrine 3D (Three.js)

Démo découverte de la 3D web. Ouvre `index.html` dans un navigateur moderne
(double-clic, ou via un petit serveur local si le navigateur bloque les modules
en `file://` : `npx serve` puis ouvrir l'URL).

## Ce que ça montre
1. **Objet central** — un cristal qu'on fait pivoter à la souris (molette = zoom).
2. **Fond d'ambiance** — des particules qui réagissent au mouvement de la souris.
3. **Scène immersive** — la caméra avance et des objets apparaissent au scroll.

Aucune installation : Three.js 0.160.0 est chargé depuis un CDN.
```

- [ ] **Step 2: Vérification finale complète** — recharger la page, scroller de haut en bas et remonter. Confirmer : les 3 effets marchent, aucune erreur console, le jeu-questionnaire existant (`../index.html` racine) est intact.

- [ ] **Step 3: Commit**

```bash
git add Jeu_Etude/3d-demo/README.md
git commit -m "docs(3d-demo): README d'utilisation"
```

---

## Self-Review

**Spec coverage :**
- Section 1 objet central interactif -> Task 2. OK
- Section 2 fond particules réactif -> Task 3. OK
- Section 3 scène immersive au scroll -> Task 4. OK
- Une seule scène WebGL fixée en fond, HTML par-dessus -> Task 1 (CSS `#scene position:fixed`). OK
- Pause onglet caché + reduced-motion -> Task 1 (`animate`), vérifié Task 4 Step 5. OK
- Responsive resize -> Task 1 (`onResize`). OK
- Sécurité (CSP, nosniff, referrer, pas d'innerHTML) -> Task 1 meta. OK
- Pas d'emojis -> UI en texte/SVG, aucun emoji dans le plan. OK
- Objets générés en code, pas de modèles externes -> Tasks 2-4 (géométries Three.js). OK
- Isolation dans `3d-demo/` -> tous les fichiers sous ce dossier. OK

**Placeholder scan :** aucun TBD/TODO ; tout le code est fourni en entier.

**Type consistency :** `scene`, `camera`, `renderer`, `canvas`, `animate()`, `prefersReducedMotion()`,
`hero`, `controls`, `particles`, `pointer`, `immersive`, `scrollProgress()` — noms cohérents d'une
tâche à l'autre. `hero` défini Task 2, réutilisé Task 4. OK.
