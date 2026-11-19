# Mon univers — Amani Kouadio Christ-Manassé

Portfolio personnel statique présentant mon parcours, mes centres d’intérêt, les personnes qui m’ont marqué, une galerie et une sélection musicale.

## Technologies

- HTML5, CSS3 et JavaScript natif
- GSAP, ScrollTrigger et MotionPathPlugin, fournis dans `vendor/`
- Ressources locales : photos et vidéo dans `img/`, illustrations, icônes, favicons et audio dans `assets/`
- Aucune étape de compilation, aucun gestionnaire de dépendances et aucune variable d’environnement nécessaires

## Lancer le site en local

Ouvrez `index.html` dans un navigateur, ou démarrez un serveur HTTP dans le dossier du projet, par exemple :

```sh
python3 -m http.server 8000
```

Puis ouvrez <http://localhost:8000>.

## Arborescence

```text
index.html              Page du portfolio
style.css               Styles et mise en page responsive
script.js               Interactions et animations
data/                   Contenus et données des rencontres
assets/                 Illustrations, icônes, favicons et audio
img/                    Photos et vidéo du portfolio
vendor/                 Bibliothèques JavaScript utilisées par la page
README-style.md         Notes de conception visuelle
README-rencontres.md    Notes sur la section des rencontres
```

Les scripts et médias sont référencés par chemin relatif depuis `index.html`. Gardez ces dossiers lors de la publication.

## Hébergement

Le site peut être publié comme site statique sur GitHub Pages, Cloudflare Pages, Netlify ou Vercel. Pour GitHub Pages, choisissez la branche publiée et le dossier racine (`/`) dans les paramètres Pages du dépôt. Aucun build ou commande d’installation n’est requis.

## Configuration et secrets

Aucune variable d’environnement n’est actuellement utilisée. Si une configuration locale est ajoutée plus tard, documentez les noms et valeurs d’exemple dans `.env.example`; les vrais fichiers `.env` restent ignorés par Git.

## Licence

Aucun fichier de licence n’est fourni pour le moment. Ajoutez-en un si vous souhaitez définir les conditions de réutilisation du code et des médias.
