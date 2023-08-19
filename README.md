# Genshin Impact

Bonjour, bienvenue sur le répo de, je l'espère, mon futur gros projets en lien avec le jeu vidéo : Genshin Impact. J'ai vu des tas d'opportunités de créer des outils à partir de ce jeu et j'ai envie de le transmettrz aux joueurs en le mettant sous forme de site internet. Je m'inspire de mes propres créations antérieurs mais également de certains choses que d'autres joueurs fan ont fait, auquel cas, j'essaierai de ne pas oublier de les citer. 

Voici [le site](http://genshin.rial7539.odns.fr/) en question.

Et voici le [répo du serveur](https://github.com/Alexandre-RICHARD/Portfolio-Back) lié.

## Historique des versions

### Version 1

<details>

### 1.0.0 `5 août 2023`

-   Création du repo unique pour ce projet et premier commit

### 1.0.1 `12 août 2023`

-   Finiolage de petits détails pour la mise en prod commune avec tous les autres projets
-   Rajout d'un htaccess pour bien gérer l'accès à l'index.html une fois hébergé
-   Rajout du htaccess au .gitignore
-   Remaniement du webpack.config.js, du package.json et du readme.md
-   Changement du favicon
-   Test de Iframe et Popup pour y intégrer une connexion depuis le site principale

### 1.0.2 `12 août 2023`

-   Rajout du lien du site dans le readme.md

### 1.0.3 `13 août 2023`

-   Mise à jour des packages npm
-   Rajout d'un script pnpm pour mettre à jour plus facilement les dépendances

### 1.0.4 `16 août 2023`

-   Petit changement de nom de la page principale
-   Mise à jour du favicon
-   Déplacement des petits tests de iframe et popup de la vue App à la vue GenshinMenu
-   Deux petits détails de style mis à jour sur la page artefact/arme/persos "Statisfyer"

### 1.0.5 `16 août 2023`

-   Supression de deux micro bouts de code inutiles
-   Début du projet de farming de Genshin
-   Création d'un tableau répertoriant tous les persos avec 11 valeurs associés
-   Celles-ci sont stockés en localStorage
-   À chaque rechargement, elles sont récupérés, vérifiées, complétées et/ou réparées si besoin puis affichées.
-   Ajout d'un encadré expliquant ce que signifie chaque entête de colonne, volontairement raccourcies pour ne pas faire trop large.
-   Mise en place d'un style basique juste pour y voir mieux pour l'instant
-   Petites modifs dans le package.json
-   Supression du package npm zxcvbn

### 1.0.6 `16 août 2023`

-   Transformation de 11 colonnes qui était de simples données affichées en input correspondant et pertinent
-   Les données sont liées au tableau CharactersData qui changent automatiquement à chaque actions sur un input
-   Aussi, à chaque action sur un input, la chaîne de caractère est reconstruite et stockée sur le localStorage
-   Adaptation et ajout d'un style sur ces nouveaux éléments afin d'en faciliter la lisibilité

### 1.0.7 `18 août 2023`

-   Mise à jour des package npm
-   Rajout de deux lignes de configurations pour webpack et vueJS
-   Suppression de CookieHandler.js qui ne servait à rien
-   Suppression de l'array contenant  le nom des personnages au profit du fichier json contenant toutes leurs informations
-   L'array reactive charactersData est devenu Data = reactive({character: null}) pour contrer tous les problème de réactivité que cela posait
-   Déstructuration du nom des perso dans le foreach
-   Rajout d'une fonction lié à un bouton pour supprimer le localStorage pour les tests
-   Rajout d'une fonction handleChange afin de lié les données du composant parent au composant enfant avec les emit
-   Création donc d'un composant à part pour créer tous les input afin de séparer cette logique là tout en simplifiant la création d'un input
-   Ajout de règle vis à vis des input. La colonne 3 (only) ne peut être coché que si la 2 l'est. Inversement, la 2 (doing) ne peut être décoché si la 3 l'est
-   Chaque input select voit ses options limitées en fonction de son duo. On ne peut choisir d'atteindre un niveau plus faible que celui actuel et inversement.
-   Rajout de certains informations sur l'amélioration des persos au fichier json contenant déjà leur statistiques
-   Rajout d'un fichier JSON contenant les informations sur chaque matériaux de farm du jeu

### 1.0.8 `18 août 2023`

-   Renommage et correction du fichier genshinMaterialData.json
-   Renommage du fichier InputCharacters en InputCreator
-   Ajout d'un autre tableau pour les matériaux de farm et leurs données provenant du fichier json
-   La fonction updateLocalStorage est devenu dynamique en fonction des arguments qu'elles reçoient
-   Enveloppage du tableau précédent avec le nouveau pour les mettre en display flex
-   Optimisation et uniformisation du style des 2 tableaux

### 1.1.0 `19 août 2023`

-   Rajout du côté réactif des données d'inventaire de matériaux de farm
-   Toutes les notions de data.Character sont devenu data.Characters afin que tous les appels à ces données soient identiques et puissent être dynamique avec une seule variable
-   La fonction filler était déjà réactive mais l'est davantage. En effet, elle permet de fill les deux champs qui nous intéresse, Character et Material à l'aide d'une nouvelle variable
-   Duplication de la logique de code de DataInit pour le côté Characters afin de qu'il fasse la même chose mais pour les materials
-   Utilisation d'un switch case pour la fonction filler
-   cleanLocalStorage clean maintenant également le localStorage des Materials
-   Rajout d'un props group aux différents input afin de pouvoir après le emit, appeler la fonction handleChange et qu'elle change la bonne donnée
-   Le tableau des Materials est maintenant fonctionnel, sauvegardé en temps réel et réactif

</details>