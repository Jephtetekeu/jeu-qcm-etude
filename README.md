# QCM Étude

Application web de révision par questions à choix multiples (QCM), bilingue
**français / anglais**. Page statique (HTML/CSS/JavaScript), aucune installation.

## Contenu du dépôt

| Élément | Description |
|---|---|
| **Jeu QCM** (`index.html`, `app.js`, `questions.js`, `questions_en.js`, `i18n.js`, `style.css`) | Le quiz d'étude bilingue FR/EN. |
| **Démo 3D** (`3d-demo/`) | Une vitrine interactive en **Three.js** montrant trois styles de 3D web : objet central manipulable, fond de particules réactif, et scène immersive au scroll. Voir [3d-demo/README.md](3d-demo/README.md). |

## Lancer le jeu QCM

Ouvrir `index.html` dans un navigateur, ou servir le dossier localement :

```bash
python -m http.server 5173
```

Puis ouvrir http://127.0.0.1:5173/.

## Lancer la démo 3D

```bash
cd 3d-demo
python -m http.server 5173
```

Puis ouvrir http://127.0.0.1:5173/. Détails dans [3d-demo/README.md](3d-demo/README.md).

## Sécurité

Pages statiques durcies : en-têtes CSP, `X-Content-Type-Options: nosniff` et
`Referrer-Policy` définis en meta, aucune injection de HTML dynamique.
