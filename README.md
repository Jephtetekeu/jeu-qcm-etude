# QCM Étude

Application web de révision par questions à choix multiples (QCM), bilingue
**français / anglais**, avec une couche 3D (Three.js) optionnelle. Page statique
(HTML/CSS/JavaScript), aucune installation.

## Contenu du dépôt

| Élément | Description |
|---|---|
| **Jeu QCM** (`index.html`, `app.js`, `questions.js`, `questions_en.js`, `i18n.js`, `style.css`) | Le quiz d'étude bilingue FR/EN (modes normal, examen, révision, duel ; historique, classement, questions perso). |
| **Effets 3D** (`three-fx.js`) | Couche 3D Three.js intégrée au quiz (fond d'ambiance, chapeau de diplômé, trophée, salve de bonne réponse). Voir ci-dessous. |
| **Démo 3D** (`3d-demo/`) | Une vitrine indépendante en **Three.js** : objet central manipulable, fond de particules réactif, scène immersive au scroll. Voir [3d-demo/README.md](3d-demo/README.md). |

## Effets 3D dans le QCM

Le jeu intègre une couche 3D (Three.js) optionnelle :

- **Fond d'ambiance** de particules indigo sur tous les écrans.
- **Chapeau de diplômé 3D** manipulable sur l'accueil.
- **Trophée 3D** sur les résultats (doré / argenté / bronze selon le score).
- **Salve de particules** à chaque bonne réponse.

Un bouton **cube** dans la barre de navigation active/désactive tous les effets
(choix mémorisé). Les effets se coupent automatiquement si le navigateur n'a pas
WebGL, sur les appareils faibles, ou si `prefers-reduced-motion` est actif —
l'application reste alors 100 % fonctionnelle.

## Lancer le projet

La 3D utilise des modules ES chargés depuis un CDN : il faut servir le dossier
via HTTP (l'ouverture directe en `file://` charge le quiz mais pas la 3D).

```bash
python -m http.server 5500
```

Puis ouvrir http://127.0.0.1:5500/ pour le quiz, ou http://127.0.0.1:5500/3d-demo/
pour la démo 3D autonome (détails dans [3d-demo/README.md](3d-demo/README.md)).

## Sécurité

- La **démo 3D** (`3d-demo/`) est durcie : en-têtes CSP (limitée au CDN Three.js),
  `X-Content-Type-Options: nosniff` et `Referrer-Policy` en meta.
- Le **quiz** n'introduit aucune entrée utilisateur ni HTML dynamique non maîtrisé
  via la couche 3D. Une CSP stricte sur `index.html` est une amélioration future
  (elle nécessite d'abord de retirer les gestionnaires `onclick` inline existants).
