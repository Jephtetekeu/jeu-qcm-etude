# Démo vitrine 3D — Design

Date : 2026-07-01
Emplacement du code : `Jeu_Etude/3d-demo/`

## Objectif

Une page web unique servant de **démo découverte** de la 3D dans le navigateur.
But : montrer à l'utilisateur, sur du concret, trois styles d'usage de la 3D web
afin qu'il en tire des idées pour un futur projet (un e-commerce 3D).
Ce n'est PAS un produit final — c'est un terrain d'expérimentation isolé qui ne
touche pas au jeu-questionnaire existant de `Jeu_Etude`.

## Contraintes et principes

- **Techno : Three.js pur**, chargé par CDN via import-map. Aucune installation,
  aucun build. On double-clique `index.html` et ça s'ouvre.
- **Isolation** : tout dans le sous-dossier `3d-demo/`. Ne modifie aucun fichier
  du jeu existant (`app.js`, `questions.js`, `index.html` racine, etc.).
- **Léger et instantané** : les objets 3D sont générés en code (géométries
  Three.js), pas de modèles externes lourds à télécharger.
- **Pas d'emojis** dans l'UI (règle utilisateur) — formes/icônes SVG si besoin.
- **Accessibilité** : respect de `prefers-reduced-motion` (animations coupées si
  l'utilisateur le demande).
- **Sécurité (règles OWASP de l'utilisateur, adaptées à une page statique)** :
  meta CSP autorisant uniquement le CDN Three.js, `X-Content-Type-Options`,
  `Referrer-Policy: strict-origin-when-cross-origin`, aucune injection de HTML
  dynamique (pas de `innerHTML` avec des données), pas d'entrée utilisateur.

## Structure des fichiers

```
Jeu_Etude/3d-demo/
├── index.html   → structure de la page, les 3 sections, le texte, meta sécurité
├── style.css    → mise en page, typographie, couleurs, layout responsive
└── main.js      → toute la logique 3D (scène, caméra, objets, animations, scroll)
```

## Architecture 3D

- **Une seule scène WebGL** plein écran, canvas fixé en fond (`position: fixed`).
- Le **contenu HTML** (titres, paragraphes, bouton) scrolle par-dessus le canvas.
- La caméra et les objets visibles changent selon la **section active**,
  déterminée par la position de scroll.
- Boucle de rendu via `requestAnimationFrame`, **mise en pause quand l'onglet est
  caché** (`document.hidden`) et si `prefers-reduced-motion` est actif.
- Redimensionnement du canvas au `resize` (responsive mobile/desktop).

## Les trois sections (de haut en bas au scroll)

### Section 1 — Héros : objet central
- Un objet 3D « produit » stylisé, généré en code (ex. cristal/forme géométrique),
  éclairé proprement (lumière ambiante + directionnelle).
- Rotation automatique lente.
- **Interaction** : l'utilisateur le fait pivoter en glissant la souris ;
  molette = zoom (via OrbitControls ou équivalent léger).

### Section 2 — Fond d'ambiance
- Un champ de **particules/formes qui flottent** en 3D, derrière un titre et un
  bouton HTML classiques.
- **Interaction** : les particules réagissent doucement au mouvement de la souris
  (parallaxe légère).

### Section 3 — Scène immersive
- En scrollant, la **caméra avance** dans une petite scène ; des éléments
  **apparaissent** progressivement (fondu/échelle) au fil du scroll.
- **Interaction** : entièrement piloté par le scroll.

## Hors périmètre (YAGNI)

- Pas de panier, pas de vrais produits, pas de backend.
- Pas de chargement de modèles 3D externes (`.glb`/`.gltf`) lourds.
- Pas de système de routing ou multi-pages.

## Critères de réussite

- La page s'ouvre sans installation ni serveur (double-clic ou simple `file://`).
- Les trois effets sont visibles et fluides sur un desktop moyen.
- Aucune régression : le jeu-questionnaire existant reste intact.
- L'utilisateur peut visuellement juger chaque style et décider de la suite.
