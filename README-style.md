# Style visuel et animations du site

Ce fichier décrit le rendu visuel et le motion design du site. Il complète `README.md` (textes et sections) et `README-rencontres.md` (photos des personnes dans `img/`).

---

## 1. Concept

Un long défilement vertical sur une **carte illustrée de la Côte d'Ivoire, tout en bleu**. Ma photo, dans un médaillon rond, voyage le long d'une route sinueuse, de lieu en lieu. À chaque étape, la photo s'arrête, le lieu s'affiche, et les personnes rencontrées là apparaissent avec leur photo.

**Référence visuelle :** « Scroll Scape » de Rafael Varona (fichier `Scroll_Scape_-_Rafael_Varona.gif`). Ce que l'on reprend :

- une grande composition verticale, des « îles » en forme de taches arrondies reliées par une route qui serpente
- une illustration plate avec dégradés et texture de grain
- de petits éléments animés autour : nuages, bateaux, avion, hélicoptère
- des points lumineux le long de la route
- un titre en grandes lettres blanches posé sur la première île

---

## 2. Palette (le bleu domine)

| Usage | Couleur indicative |
|---|---|
| Fond (ciel) | `#BBD1F3` |
| Bleu clair (îles, reflets) | `#8FB0EC` |
| Bleu moyen (terre) | `#4F80DF` |
| Bleu profond (bâtiments, ombres) | `#2450C8` |
| Bleu nuit (textes, détails) | `#0F2A8A` |
| Blanc (titre, nuages, cartes) | `#FFFFFF` |
| Accent (très peu, détails seulement) | `#F28B6D` |

Texture de grain légère sur les aplats, comme dans la référence.

---

## 3. La carte

- Dessinée en **SVG** (pas de carte Google ni de tuiles externes) : plus légère, animable et cohérente avec le style.
- Composition **verticale**, de haut en bas : le nord (Yamoussoukro) en haut, le sud (côte) en bas.
- La Côte d'Ivoire est stylisée en grande forme bleue ; chaque étape est une « île » ou un quartier illustré, relié au suivant par la route.
- Mer en bas de la carte (golfe de Guinée) avec bateaux et nuages.

---

## 4. Les étapes du voyage

| # | Lieu | Période | Personnes (fichiers de `README-rencontres.md`) | Éléments illustrés suggérés |
|---|---|---|---|---|
| 0 | **Yamoussoukro** | Naissance | aucune | la basilique Notre-Dame de la Paix, titre en grandes lettres blanches |
| 1 | **Bonoufla** (localité de Vavoua) | CP1 au CE2 | aucune | village, arbres, plantations |
| 2 | **Daloa** | CM1 à la 6ème | `danielle`, `eslie` | école, cacaoyers |
| 3 | **Soubré** | 5ème à la Terminale D | `cedric-junior`, `boka-grace`, `anabelle`, `aziz`, `hugor`, `sephora`, `arrielle` | lycée, barrage et fleuve |
| 4 | **UVCI** | Licence 2 | aucune | écrans, ordinateurs, lignes de réseau (étape numérique) |
| 5 | **Un peu partout en Côte d'Ivoire** | 2025 et 2026 | `sarah-valencia`, `freres-bernabe`, `kader`, `alma`, `arthur`, `emmanuelle-deborah` | la carte entière, avec des repères lumineux dispersés |

**Étape 5 :** les rencontres de 2025 et 2026 ont eu lieu un peu partout dans le pays, sans lieu unique. La carte dézoome pour montrer toute la Côte d'Ivoire. Ma photo passe d'un repère lumineux à l'autre, et chaque personne apparaît à un endroit différent de la carte, sans nom de ville. Libellé affiché : « Un peu partout en Côte d'Ivoire ».

À la fin de la route : section Galerie, Musique et Contact.

---

## 5. Animations

**Écran d'accueil**
1. Fond bleu, la carte apparaît en fondu.
2. Le texte « Bienvenue dans mon univers » s'écrit, puis le nom **Amani Kouadio Christ-Manassé** en grandes lettres blanches, puis le sous-titre et la devise.
3. Ma photo apparaît dans son médaillon au début de la route. Bouton : **Découvrir mon histoire**.

**Pendant le défilement**
- La route se dessine progressivement derrière ma photo (animation du tracé SVG).
- Ma photo suit la route (déplacement le long d'un chemin), avec un halo lumineux.
- À chaque étape : la carte zoome légèrement, le nom du lieu et la période s'affichent, puis les cartes des personnes apparaissent l'une après l'autre (fondu + petit rebond), avec photo, nom et texte.
- Éléments d'ambiance en boucle : nuages qui dérivent, bateaux, avion, hélicoptère, points lumineux sur la route.
- Léger effet de parallaxe entre le fond et les îles.

**Règles**
- Durées douces (entre 0,4 et 1 seconde), pas d'effets agressifs.
- Respecter `prefers-reduced-motion` : si l'utilisateur le demande, remplacer les animations par de simples apparitions.
- La musique ne démarre jamais toute seule ; un petit bouton de lecture reste visible pendant le voyage.

---

## 6. Technique suggérée

- **HTML, CSS et JavaScript** ; carte et route en SVG.
- **GSAP avec ScrollTrigger et MotionPath** pour lier le défilement, le tracé de la route et le déplacement de ma photo (ou les animations CSS liées au défilement si l'agent préfère rester sans bibliothèque).
- Photos en `loading="lazy"` ; SVG optimisé.
- Mobile d'abord : la composition verticale s'adapte naturellement aux téléphones. Sur ordinateur, centrer la carte dans une colonne et élargir les cartes des personnes.

---

## 7. Fichiers à fournir

- `img/amani.png` : ma photo pour le médaillon (carrée, visage centré)
- Photos des personnes : voir `README-rencontres.md`
- Illustrations de la carte : à dessiner en SVG par l'agent, ou à fournir si créées avec un outil d'illustration

**Remarque honnête :** la référence est une illustration très détaillée, réalisée par un illustrateur. Un agent IA peut produire une version simplifiée (formes plates, dégradés, grain, éléments animés). Pour un rendu aussi riche que la référence, il faudra une illustration dédiée (illustrateur ou outil de génération d'images) à intégrer dans le site.

---

## 8. Liste de contrôle

- [ ] Valider la palette de bleus
- [ ] Fournir `img/amani.png`
- [ ] Décider si l'illustration de la carte est faite en SVG par l'agent ou fournie
