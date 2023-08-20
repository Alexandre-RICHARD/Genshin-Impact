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

### 1.1.1 `19 août 2023`

-   Sur le fichier json contenant les informations sur les ressources de farm, les code de ressources ont été mis en minuscule
-   Ajout du fichier json contenant les informations sur les niveau et aptitudes, ce qu'ils demandent comme ressources
-   Pour pallier au nouveau problème que posent le fait d'avoir des valeur de niveau qui ne soient plus uniquement des nombres, nouveau système mis en place
-   En effet, inputCreator prend en compte un 4ème type d'input, select se divisant en select-level et select-aptitude
-   La différence se fait que le tableau contenant les informations sur les aptitudes est plus simple, uniquement des nombres alors que dans les niveaux, il y a des string
-   Ainsi on envoi dans le composant tous le tableaux, pas juste un tableau de nombre. L'ID est sauvegardé et utilisé comme value, mais c'est le nom qui est affiché même s'ils sont identiques.
-   Dans le fichier principal GenshinFarming :
-   Importation du fichier contenant les informations sur les niveaux
-   Dans DataInit, on vérifie la présence et la validité des valeurs qui sont stockées dans le localStorage. On utilisait donc deux tableaux contenant les valeurs possibles d'aptitudes et de niveaux. Ces tableaux sont maintenant générés à partir du fichier json.
-   Rajout d'une troisième valeurs dans l'objet data : Options. Une logique différente des deux autres mais stockées de la même façon, il va stocker les différents paramètres choisis par l'utilisateur
-   Par défaut, en comptant maintenant les 6 niveaux d'ascension, les id des niveaux vont jusqu'à 96, ce qui est la valeur par défaut maintenant au lieu de 90
-   Dans la fonction updateLocalStorage, la variable type s'appelle désormais group pour ne pas laisser de confusion possible avec d'autres variables type
-   Rajout de la propriétés computed de vue.JS afin de calculer de manière réactive un sous-tableau de personnage à afficher en fonction de si l'utilisateur ne veut voir que les personnages qu'il a choisi de faire
-   Rajout d'une fonction de tri pour être sûr que les différents personnages apparaissent dans l'ordre alphabétique
-   Un peu de rangement, et regroupement des différents outils de developpement ou options dans un même encadré
-   Possibilité maintenant de faire apparraître ou non les explications détaillées.
-   Rajout d'une ligne d'explication pour évoquer les niveaux nommées XX + en rapport avec les Ascension de personnages
-   Quelques changements dans les styles

### 1.1.2 `19 août 2023`

-   Même si cela surcharge un peu plus encore le fichier json, rajout de trois propriétés pour chaque personne sur leur code matériel pour les ressources globales
-   Dans le fichier json des material, modification de la valeur des character_xp en experience_book pour que la valeur soit directement utilisable
-   Modification de la fonction sortFunction afin qu'elle puisse recevoir un argument en plus disant quelle clé de l'objet doit servir au tri
-   Création d'un objet computed afin de lister et regrouper toutes les ressources nécessaires en fonction de ce que l'utilisateur à mis comme données.
-   En gros, on prend tous les persos mis en "doing", on prend tous les niveaux qui manquent, on regarde ce qu'ils demandent, on fait le cumul de ceci. Une fois fait, on converti le nom de base de la ressource en son code, et après l'avoir fait pour chaque perso on fait la somme de tous et on l'affiche dans un tableau simple pour l'instant.

### 1.1.3 `20 août 2023`

-   Factorisation à l'extrême de la fonction permettant de résumé en un seul objet toutes les ressources nécéssaires
-   Changement de noms de quelques variables
-   Rajout d'un ID sur les level d'aptitude afin de pouvoir factoriser la fonction citée plus haut

### 1.1.4 `20 août 2023`

-   Rajout d'une options sauvegardé en localStorage pour le serveur Gesnhin que l'utilisateur utilise
-   Rajout d'une fonction rendant une heure bien affiché avec un paramètre pour faire un compte à rebours si besoin
-   Rajout d'une foncion permettant d'afficher l'heure actuelle, l'heure relative du serveur utilisé ainsi que le jour de la semaine sur lequel le serveur est.
-   Adaptation du style du tableau des ressource par rapport aux autres

### 1.2.0 `20 août 2023`

-   Regroupement des 3 listes (lvlList, aptList et serverList)
-   Simplification des .map de lvlList et d'aptList
-   Changement de la variable affectée aux matériel pour la quantité que le joueur possède, passant de quantity à have
-   Rajout de 2 options enregistrée comme les autres, l'une pour ne montrer que les ressources nécessaire par ce que veut le joueur, l'autre pour toujours vouloir 1 ressource en plus avant que le tableau montre "Perfect"
-   Rajout d'une valeur computed retournant les matériaux filtré en fonction de si oui ou non l'utilisateur ne veut voir que les matériaux nécessaires
-   Dans le calcul des ressources nécessaires, la variable quantity est devenu needed.
-   Rajout d'un morceau de code pour rajouter au sein de l'objet regroupant les matériaux calculé tous ceux qui ne sont pas nécessaires, car l'objectif est de n'avoir qu'un seul tableau au lieu des 2 précédent
-   Arrangement de la logique derrière la gestion des heures, des dates. Regroupement de tout ceci au sein d'un seul et même objet.
-   OnBeforeMount est maintenant à la fin du script
-   Rajout des deux input pour les nouvelles options
-   Supression du 3ème tableau qui montrait le bilan des ressources nécessaires
-   Mise en forme et adaptation du tableau de Material. Ajout des colonnes needed, remain et farmable. La colonne remain affiche perfect si la quantité possédé dépasse la quantité voulue

### 1.2.1 `20 août 2023`

-   Ajout d'un maximum pour l'input number permettant de rentrer les valeurs de son inventaire
-   Résolution d'un bug avec les input/label des options, les id/for n'étaient pas cohérent entre eux
-   Interversion des deux tableaux de données
-   Quand on ne demandait à voir que certaine données à travers les options les index envoyé dans InputCreator n'étaient plus les bons, c'est corrigé

</details>