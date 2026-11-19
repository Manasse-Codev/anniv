# Section « Les rencontres qui m'ont marqué » : photos et noms de fichiers

Ce fichier explique à l'agent IA comment afficher la photo de chaque personne dans la section des rencontres. Les textes de la section sont dans `README.md` (partie 6) ; ce fichier donne la correspondance entre chaque personne, son texte et son image.

---

## 1. Règle de nommage

- Toutes les photos sont dans le dossier **`img/`**, à la racine du site.
- Chaque photo s'appelle **`sonnom.png`**, selon la table de la partie 3.
- Noms de fichiers en **minuscules**, **sans accent**, **sans espace** (un tiret à la place de l'espace).
- Exemple : la photo de Danielle est `img/danielle.png`.

```
/
└── img/
    ├── danielle.png
    ├── eslie.png
    ├── cedric-junior.png
    └── ...
```

Format conseillé pour chaque photo : carré (1:1), environ 400 × 400 pixels, visage centré.

---

## 2. Consignes pour l'agent IA

1. Lire la table de la partie 3 et générer une carte par ligne, dans l'ordre de la table.
2. Pour chaque carte, afficher : la photo `img/<fichier>`, le nom, l'étape (classe ou date) et le texte.
3. La photo est affichée en rond ou en carré arrondi, avec `loading="lazy"` et un texte alternatif (`alt`) égal au nom de la personne.
4. **Si le fichier image est absent**, ne pas afficher d'icône cassée : afficher à la place un cercle avec les initiales de la personne.
5. Ne jamais renommer ni déplacer les fichiers de `img/`. Si un nom de fichier de la table ne correspond à aucune image, afficher les initiales et continuer.
6. Les deux lignes marquées **(groupe)** utilisent une photo de groupe.
7. La dernière phrase de conclusion n'a pas de photo.

---

## 3. Table des personnes

| Étape | Nom affiché | Fichier attendu | Texte de la carte |
|---|---|---|---|
| CM2 | Danielle | `img/danielle.png` | Une des deux sœurs rencontrées en CM2, parmi mes premières belles amitiés d'école. |
| CM2 | Eslie | `img/eslie.png` | L'autre sœur, rencontrée elle aussi en CM2. |
| 5ème | Gnamien N'Goran Cédric Junior | `img/cedric-junior.png` | Ancien du lycée scientifique, aujourd'hui en 2ème année d'ingénieur statisticien. Un ami devenu un frère : mêmes ambitions, même esprit, même vocation. |
| 4ème | Boka Grâce | `img/boka-grace.png` | Une amie partie trop tôt cette année. Son souvenir reste vivant en moi. |
| 3ème | Anabelle | `img/anabelle.png` | Devenue une sœur pour moi. |
| 3ème | Diarra Abdoul Aziz | `img/aziz.png` | Un ami précieux. |
| 3ème | Atta Yao Beni Hugor | `img/hugor.png` | Un ami devenu un frère. |
| 1ère D | Séphora | `img/sephora.png` | Une amie engagée dans la foi chrétienne. |
| Terminale | Arrielle | `img/arrielle.png` | Une véritable pépite. |
| Été 2025 | Konan Sarah Valencia | `img/sarah-valencia.png` | Rencontrée après les compositions du BAC : ma meilleure rencontre de l'année, une grâce dans ma vie. |
| 2025 | Les frères Bernabé **(groupe)** | `img/freres-bernabe.png` | Un groupe de musiciens de grande qualité. |
| Novembre 2025 | Kader KEBE (Kvdev) | `img/kader.png` | Mon mentor, à la fois source de motivation et formateur. |
| Février 2026 | Les ALMA **(groupe)** | `img/alma.png` | Un groupe de filles remarquables. |
| 2026 | Arthur | `img/arthur.png` | Que j'appelle mon jumeau, un développeur redoutable. |
| 2026 | Emmanuelle Déborah | `img/emmanuelle-deborah.png` | Ma plus belle rencontre de l'année. |

---

## 4. Texte d'introduction et de conclusion de la section

**Introduction :**
> On ne devient pas ce qu'on est tout seul. À chaque étape de mon parcours, la vie a mis sur ma route des personnes qui ont laissé une trace durable en moi.

**Conclusion (sans photo) :**
> Et tant d'autres : on ne peut pas tout dire, mais chacun a sa place dans mon histoire.

---

## 5. Pour ajouter une personne plus tard

1. Déposer sa photo dans `img/` en respectant la règle de la partie 1.
2. Ajouter une ligne dans la table de la partie 3, au bon endroit dans l'ordre chronologique.
3. L'agent régénère la section à partir de la table.

---

## 6. Liste de contrôle

- [ ] Créer le dossier `img/`
- [ ] Déposer les 15 photos avec les noms exacts de la table
- [ ] Vérifier qu'aucun nom de fichier n'a de majuscule, d'accent ou d'espace
- [ ] Choisir entre noms complets et prénoms seulement avant la mise en ligne
