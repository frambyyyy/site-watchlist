# Our Little Movie Night 🎬💗
*Pour Aylie, de la part de Roro.*

Une petite application rien qu'à vous : une roue de la fortune choisit le film de la soirée parmi les films de la watchlist Letterboxd d'Aylie, et un petit journal garde la trace de vos soirées ciné.

## Ouvrir le site
Double-clique sur `index.html`. C'est tout : rien à installer, rien à configurer.

## Les fichiers
```
index.html     la page
style.css      le design (rose, crème, cerise, bordeaux… + mode soirée)
script.js      la roue, la watchlist, le journal, les petits mots
watchlist.js   la watchlist d'Aylie (160 films)
us.jpg         ← votre photo (à ajouter, voir plus bas)
server.js      optionnel, seulement pour charger les affiches (voir plus bas)
```

## La photo de vous deux
Mets votre photo dans le dossier, à côté de `index.html`, et nomme-la exactement **`us.jpg`**. Elle apparaît en bas du site dans un polaroïd, avec « Aylie & Roro ♡ » et ta signature. Sans photo, un petit cœur prend sa place. Format portrait conseillé (le cadre est en 4:5).

## La watchlist d'Aylie
`watchlist.js` contient les 160 films de https://letterboxd.com/aylie_tbr/watchlist/, lus sur Letterboxd le 22 octobre 2026 : titre, année, lien vers la fiche, réalisateur, durée, genres et note moyenne Letterboxd. Rien n'est inventé. Trois films n'ont pas encore de note sur Letterboxd ; un film n'a ni année ni durée (*What Happens at Night*, pas encore sorti). Ces infos sont donc simplement masquées.

**Quand elle ajoute des films** : demande à Claude de relire sa watchlist et de régénérer `watchlist.js`, puis remplace le fichier. Tu peux aussi ajouter une ligne à la main dans `watchlist.js` en copiant le format des autres. Les favoris, les films retirés de la roue et le journal sont conservés automatiquement.

## Les affiches
Pour l'instant, chaque film a une jolie carte rose avec son titre. Deux façons d'avoir les vraies affiches :
1. **Le plus simple** : redemande à Claude de récupérer les affiches. Il les intégrera directement dans `watchlist.js`.
2. **Avec une clé TMDB** (gratuite) : crée un compte sur themoviedb.org → Paramètres → API, copie `.env.example` en `.env`, colle le jeton, lance `node server.js` (Node 18+) et ouvre http://localhost:5173. Les affiches sont chargées par identifiant TMDB exact, donc sans confusion entre films homonymes.

## Personnaliser
Tout se modifie en haut de `script.js` :
- `CONFIG.NAMES` : vos prénoms (`{ her: "Aylie", him: "Roro" }`), utilisés partout ;
- `TEXTS` : tous les textes, en anglais et en français ;
- `loveNotes` : les petits mots d'amour qui s'affichent au hasard ;
- `resultMessages` : les messages quand la roue s'arrête.

## Bon à savoir
- Le journal et les favoris sont enregistrés dans le navigateur de l'appareil utilisé. Si vous utilisez le site sur deux téléphones, chacun a son propre journal.
- Avec 160 films, les secteurs de la roue sont trop fins pour afficher les titres : le nom du film défile sous la roue pendant qu'elle tourne. En activant « Favoris seulement » ou en retirant des films de la roue (moins de 64), les titres réapparaissent sur la roue.
- Le gagnant est tiré au sort avant l'animation, puis la roue s'arrête exactement sur son secteur : le film affiché est toujours celui sous la flèche.
