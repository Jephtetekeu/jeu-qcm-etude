# Démo vitrine 3D (Three.js)

Démo découverte de la 3D web. Trois styles d'usage de la 3D sur une seule page,
en Three.js pur (aucune installation, aucun build).

## Comment l'ouvrir

Les modules ES + import-map sont bloqués en `file://` : il faut un petit serveur local.

```bash
cd 3d-demo
python -m http.server 5173
```

Puis ouvrir **http://127.0.0.1:5173/** dans un navigateur moderne.

(Alternative si tu as Node : `npx serve` dans le dossier `3d-demo`.)

## Ce que ça montre

1. **Objet central** — un cristal qu'on fait pivoter à la souris (molette = zoom).
2. **Fond d'ambiance** — des particules qui réagissent au mouvement de la souris.
3. **Scène immersive** — en scrollant vers le bas, des objets avancent vers la
   caméra et apparaissent un par un pendant que le cristal se fond.

## Détails techniques

- Three.js **0.160.0** chargé depuis un CDN (unpkg) via import-map.
- Objets générés en code (aucun modèle 3D externe).
- Animation en pause quand l'onglet est caché ; respect de `prefers-reduced-motion`.
- Page statique durcie : CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy`.
