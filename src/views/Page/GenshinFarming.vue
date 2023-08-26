<script setup>
// Importation des différentes données de Genshin stockées en JSON
const charactersList = require("@middlewares/genshinCharactersData.json");
const weaponsList = require("@middlewares/genshinWeaponsData.json");
const materialsList = require("@middlewares/genshinMaterialsData.json");
const levelingData = require("@middlewares/genshinLevelingData.json");
import InputCreator from "@parts/InputCreator.vue";
import { computed, onBeforeMount, reactive, ref } from "vue";

// Dès le début, on stock la liste des Niveaux de personnages et d'aptitudes séparément pour faciliter leurs accès dans le template
const lvlList = levelingData.level.map(el => el.id);
const aptList = levelingData.aptitude.map(el => el.level);
const weaponNameList = weaponsList.flatMap(el => [el.name, el.eng_name]);
    


// Les différentes options du choix de serveur
const serverList = ["Sélectionne ton serveur", "Asiatique", "Européen", "Américain"];

// Notre gros objet global qui va contenir toutes les informations utiles à sauvegarder pour que l'utilisateur concerve ses données
const data = reactive({ Characters: [], Weapons: [], Materials: [], Options: {} });

// Une fonction appelé en théorie uniquement lors du chargement de la page (ou lors du clean du localStorage)
const dataInit = () => {
    // On récupère dans le localStorage la chaine de caractère correspondant à nos données de personnages
    const lsCharacter = localStorage.getItem("genshinCharactersData");
    // On vérifie qu'elle exsite
    if (lsCharacter) {
        // Si oui, on la transforme en un tableau utilisable
        data.Characters = JSON.parse(lsCharacter);
        // Boucle initié avec la liste des personnages complètes avec uniquement le nom du personnages servant d'identifiant unique
        charactersList.forEach(({ name }) => {
            // On le cherche dans notre nouveau tableau. 
            const currentChar = data.Characters.find(fi => name === fi.name);
            // S'il existe, on va étudier chacune des valeurs que ce personnage contient pour assurer leur validité et les remplacer si besoin
            if (currentChar) {
                // Pour chaque donnée, on va regarder si elle est logique et du bon type auquel cas inverse, cela casserai l'application. Un mauvais type ne pourrait être présent que par maladresse ou volonté de l'utilisateur
                // On regarde si chaque valeur est contenu dans les tableaux de référence, et sinon, on la remplace par la valeur par défaut
                const i = data.Characters.findIndex(fi => name === fi.name);
                if ([false, true].indexOf(currentChar.got) < 0) data.Characters[i].got = false;
                if ([false, true].indexOf(currentChar.doing) < 0) data.Characters[i].doing = false;
                if ([false, true].indexOf(currentChar.only) < 0) data.Characters[i].only = false;
                if (lvlList.indexOf(currentChar.cLvl) < 0) data.Characters[i].cLvl = 1;
                if (lvlList.indexOf(currentChar.wLvl) < 0) data.Characters[i].wLvl = 96;
                if (aptList.indexOf(currentChar.cAp1) < 0) data.Characters[i].cAp1 = 1;
                if (aptList.indexOf(currentChar.wAp1) < 0) data.Characters[i].wAp1 = 10;
                if (aptList.indexOf(currentChar.cAp2) < 0) data.Characters[i].cAp2 = 1;
                if (aptList.indexOf(currentChar.wAp2) < 0) data.Characters[i].wAp2 = 10;
                if (aptList.indexOf(currentChar.cAp3) < 0) data.Characters[i].cAp3 = 1;
                if (aptList.indexOf(currentChar.wAp3) < 0) data.Characters[i].wAp3 = 10;
            } else {
                // Sinon, on va simplement créer ce personnage avec son nom et les valeurs par défaut à l'aide de la fonction filler
                data.Characters.push(filler("Characters", name));
            }
        });
        // Si la chaîne de caractère n'existe pas, alors on va la créer de toute pièce en utilisant la fonction filler pour mettre par défaut chaque personnage
    } else {
        data.Characters = [];
        charactersList.forEach(({ name }) => {
            data.Characters.push(filler("Characters", name));
        });
    }
    // Une fois tout cela géré, on va mettre à jour le localStorage avec nos données actualisées et vérifiées
    updateLocalStorage("Characters");

    const lsWeapons = localStorage.getItem("genshinWeaponsData");
    if (lsWeapons) {
        data.Weapons = JSON.parse(lsWeapons);
        weaponsList.forEach(({ name }) => {
            const currentChar = data.Weapons.find(fi => name === fi.name);
            if (currentChar) {
                const i = data.Weapons.findIndex(fi => name === fi.name);
                if (lvlList.indexOf(currentChar.cLvl) < 0) data.Weapons[i].cLvl = 1;
                if (lvlList.indexOf(currentChar.wLvl) < 0) data.Weapons[i].wLvl = 96;
            }
        });
    } else {
        data.Weapons = [];
    }
    updateLocalStorage("Weapons");

    // Pour gérer l'inventaire des ressources de farm, même procédé que la fonction ci-dessus, mais compliqué et probablement vilain à factoriser les 2 en 1
    const lsMaterial = localStorage.getItem("genshinMaterialsData");
    if (lsMaterial) {
        data.Materials = JSON.parse(lsMaterial);
        materialsList.forEach(({ code }) => {
            const currentMat = data.Materials.find(fi => code === fi.code);
            if (currentMat) {
                const i = data.Materials.findIndex(fi => code === fi.code);
                if (currentMat.have < 0 || !Number.isInteger(currentMat.have)) data.Materials[i].have = 0;
            } else {
                data.Materials.push(filler("Materials", code));
            }
        });
    } else {
        data.Materials = [];
        materialsList.forEach(({ code }) => {
            data.Materials.push(filler("Materials", code));
        });
    }
    updateLocalStorage("Materials");

    // Pour gérer les options, pratiquement le même procédé mais avec beaucoup moins de valeurs et propriétés donc fait à la main pour chacune
    const lsOptions = localStorage.getItem("genshinOptionsData");
    if (lsOptions) {
        data.Options = JSON.parse(lsOptions);
        if ([false, true].indexOf(data.Options.onlyShowsDoingCharacter) < 0) data.Options.onlyShowsDoingCharacter = false;
        if ([false, true].indexOf(data.Options.onlyShowsNeededMaterials) < 0) data.Options.onlyShowsNeededMaterials = false;
        if ([false, true].indexOf(data.Options.alwaysOneMoreMaterial) < 0) data.Options.alwaysOneMoreMaterial = false;
        if ([false, true].indexOf(data.Options.explaination) < 0) data.Options.explaination = true;
        if ([false, true].indexOf(data.Options.loadIMG) < 0) data.Options.loadIMG = false;
        if (serverList.indexOf(data.Options.server) < 0) data.Options.server = "";
    } else {
        data.Options = {
            onlyShowsDoingCharacter: false,
            onlyShowsNeededMaterials: false,
            alwaysOneMoreMaterial: false,
            explaination: true,
            loadIMG: false,
            server: "",
        };
    }
    updateLocalStorage("Options");
};

const filler = (type, name) => {
    // La fonction filler, utilisée pour complété les données de l'array data quand les données présente dans le localStorage ne sont pas bonnes
    // Prise en compte du type de données pour différencier les propriétés à renvoyer et le nom.
    switch (type) {
    case "Characters":
        return {
            name: name,
            got: false,
            doing: false,
            only: false,
            cLvl: 1,
            wLvl: 96,
            cAp1: 1,
            wAp1: 10,
            cAp2: 1,
            wAp2: 10,
            cAp3: 1,
            wAp3: 10,
        };
    case "Materials":
        return {
            code: name,
            have: 0,
        };
    }

};

// Relié à un bouton permettant de nettoyer et reset par défaut le localStorage
const cleanLocalStorage = () => {
    localStorage.removeItem("genshinCharactersData");
    localStorage.removeItem("genshinWeaponsData");
    localStorage.removeItem("genshinMaterialsData");
    localStorage.removeItem("genshinOptionsData");
    dataInit();
};

// La fonction utilisée pour sauvegarder dans le navigateur au sein du localStorage les différentes données. En fonction 
const updateLocalStorage = (type) => {
    localStorage.setItem(`genshin${type}Data`, JSON.stringify(data[type]));
};

// Quand un input créer avec le composant InputCreator, sa valuer est suivi avec un V-model puis un emit envoyé dans la fonction handleChange qui se charge de changer la bonne valeur dans l'array "data"
const handleChange = (group, index, valuename, value) => {
    data[group][index][valuename] = value;
    updateLocalStorage(group);
};

// Un objet computed afin de filtrer en fonction d'une options si on ne veut voir que les personnages qui ont été noté comme build
const filteredCharacters = computed(() => {
    const filter = [...data.Characters].filter((character) => {
        const doingCharacters = !data.Options.onlyShowsDoingCharacter || character.doing === true;
        const searchedCharacters = !searchingCharactersQuery.value || character.name.toLowerCase().includes(searchingCharactersQuery.value.toLowerCase());

        return (
            doingCharacters &&
            searchedCharacters
        );
    });
    return filter.sort(sortFunction("name"));
});

// Un objet computed afin de filtrer en fonction d'une option si on ne veut voir que les matériaux de farm dont on a besoin
const filteredMaterials = computed(() => {
    if (data.Options.onlyShowsNeededMaterials) {
        return farmingMaterial.value.filter(el => el.needed > 0);
    } else {
        return farmingMaterial.value;
    }
});

// Une fonction de triage non fléché, la seule afin d'accueillir des arguments autres que les a et b habituels.
function sortFunction(...args) {
    return function (a, b) {
        if (a[args[0]] < b[args[0]]) return -1;
        if (a[args[0]] > b[args[0]]) return 1;
        return 0;
    };
}

// Le gros morceaux, le gros objet computed farmingMaterial qui va avoir pour but de prendre nos données rentrées par l'utilisateur sur les personnages et les matériaux de farm et de calculer combien il en faut, combien il en a, la différence, la somme de points pour chaque groupe qui est possible de faire avec la synthèse ainsi que la résine nécessaire estimée.
const farmingMaterial = computed(() => {
    // Notre array qui va être utilisé et retourné pour créer l'array farmingMaterial
    const computedBuildArray = [];
    // Pour le premier bloc de code traitant du fait de calculer la quantité de matériaux nécessaires en fonction des valeurs de personnages pris, pour factoriser, on utilise une boucle de 0 à 3 prenant ses valeurs comme repères.
    const processVar = [
        { searchLoc: "level", currentValue: "cLvl", wantedValue: "wLvl" },
        { searchLoc: "aptitude", currentValue: "cAp1", wantedValue: "wAp1" },
        { searchLoc: "aptitude", currentValue: "cAp2", wantedValue: "wAp2" },
        { searchLoc: "aptitude", currentValue: "cAp3", wantedValue: "wAp3" },
    ];

    const materialsAttributor = (progressStep, currentElement) => {
        progressStep.forEach(step => {
            // On boucle sur chacune des données des niveaux récupéré sur id et level inutile
            for (const [key, value] of Object.entries(step)) {
                if (value > 0 && key != "id" && key != "level") {
                    // On crée une variable temporaire
                    let materialCode;
                    // On vérifie dans les données du personnages, si la clé représente une ressources avec différents niveau de rareté ou non, réprésenté par un nombre en dernier caractère
                    if (!isNaN(key.slice(-1))) {
                        // Si c'est un chiffre, on reconstitue le bon code de la ressources
                        materialCode = currentElement[key.slice(0, -2)] + key.slice(-1);
                    } else {
                        // Sinon, on prend simplement le code comme il est
                        materialCode = currentElement[key];
                    }
                    // Dans l'objet temporaire du computed, on cherche la ressource actuelle
                    const findIndex = computedBuildArray.findIndex(fi => fi.code === materialCode);
                    // Si elle existe, on lui rajoute à sa propre valeur le besoin représenter par le niveau
                    if (findIndex >= 0) {
                        computedBuildArray[findIndex].needed += value;
                    } else {
                        // Sinon, on créer un nouvel objet reprenant les données des ressources en y ajoutant la quantité nécessaires
                        computedBuildArray.push({
                            ...materialsList.find(material => material.code === materialCode),
                            needed: value,
                        });
                    }

                }
            }
        });
    };

    // La logique est donc :
    // POur chaque personnage, on ne va prendre en compte que ceux qui ont été noté comme étant à faire, à monter. On boucle sur ceux qui restent.
    data.Characters.filter(char => char.doing === true).forEach(char => {
        // Dans la données de persos, on récupère celles du personnage actuel.
        const currentElement = charactersList.find(find => find.name === char.name);
        // On boucle de 0 à 3 car on va surveiller 4 choses, le lvl, l'aptitude 1, la 2 et la 3.
        for (let i = 0; i <= 3; i++) {
            // On va récupérer la liste des niveaux séparant le niveau actuel du niveau voulu pour ainsi avoir accès à la liste de ce que demande chaque niveau comme matériel
            const progressStep = levelingData[processVar[i].searchLoc].filter(step => step.id > char[processVar[i].currentValue] && step.id <= char[processVar[i].wantedValue]);
            // S'il y a le moindre niveau dans cette liste, on rentre dans cette boucle forEach
            if (progressStep.length > 0) {
                materialsAttributor(progressStep, currentElement);
            }
        }
    });

    // La logique pour les armes est exactement la même
    data.Weapons.forEach(weap => {
        const currentElement = weaponsList.find(find => find.name === weap.name);
        const progressStep = levelingData[`weapon_${currentElement.rarity}`].filter(step => step.id > weap.cLvl && step.id <= weap.wLvl);
        if (progressStep.length > 0) {
            materialsAttributor(progressStep, currentElement);
        }
    });

    // Ce code va servir a tout de même crée un objet pour chaque ressources, même s'il n'est pas demandé pour le farm des persos choisis
    materialsList.forEach(material => {
        // On boucle sur la liste de ressources provenant du json, on récupère la quantité que le joueur a
        const userValue = data.Materials.find(fi => fi.code === material.code).have;
        // On regarde si cette ressources est déjà dans le tableau provisoire
        const alreadyIn = computedBuildArray.findIndex(fi => fi.id === material.id);
        // Si non, alors on le créé manuellement avec les valeurs par défaut et la quantité que le joueur a
        if (alreadyIn < 0) {
            computedBuildArray.push({
                ...material,
                have: userValue,
                needed: 0,
                remain: 0,
                group_have: 0,
                group_needed: 0,
                group_resin: 0,
                synthesis: false,
            });
            // Si oui, alors on va mettre à jour certaines valeurs. On inscrit la quantité possédé, combien il y a de différence entre besoin/possession et des valeurs par défaut utiles après
        } else {
            computedBuildArray[alreadyIn] = {
                ...computedBuildArray[alreadyIn],
                have: userValue,
                remain: computedBuildArray[alreadyIn].needed - userValue,
                group_have: 0,
                group_needed: 0,
                group_resin: 0,
                synthesis: false,
            };
        }
    });


    // Code spécifique pour les cristaux d'expérience. On récupère l'objet de chaque rareté de cristal d'expérience d'arme.
    const xp_ore_3 = computedBuildArray.findIndex(fi => fi.code === "g02");
    const xp_ore_2 = computedBuildArray.findIndex(fi => fi.code === "g03");
    const xp_ore_1 = computedBuildArray.findIndex(fi => fi.code === "g04");

    // On va changer l'objet du cristal de raffinement le plus précieux en utilisant la valeur des 2 autres.
    computedBuildArray[xp_ore_3] = {
        // On reprend l'objet tel quel
        ...computedBuildArray[xp_ore_3],
        // On arrondi les valeurs
        needed: Math.ceil(computedBuildArray[xp_ore_3].needed),
        remain: Math.ceil(computedBuildArray[xp_ore_3].remain),
        // On va inclure une fausse valeur de synthèse mais en reprenant le principe car cela revient au même. Ainsi on multiplie par les bons coefficient les valeurs de besoin/possession
        group_have: computedBuildArray[xp_ore_3].have * 25 + computedBuildArray[xp_ore_2].have * 5 + computedBuildArray[xp_ore_1].have,
        group_needed: Math.ceil(computedBuildArray[xp_ore_3].needed * 25),
        // On active la synthèse pour que cela soit affiché par la suite
        synthesis: true,
    };

    // Code spécifique pour les livres d'expériences. Même principe et code que ci-dessus
    const xp_book_3 = computedBuildArray.findIndex(fi => fi.code === "g05");
    const xp_book_2 = computedBuildArray.findIndex(fi => fi.code === "g06");
    const xp_book_1 = computedBuildArray.findIndex(fi => fi.code === "g07");

    computedBuildArray[xp_book_3] = {
        ...computedBuildArray[xp_book_3],
        needed: Math.ceil(computedBuildArray[xp_book_3].needed),
        remain: Math.ceil(computedBuildArray[xp_book_3].remain),
        group_have: computedBuildArray[xp_book_3].have * 20 + computedBuildArray[xp_book_2].have * 5 + computedBuildArray[xp_book_1].have,
        group_needed: Math.ceil(computedBuildArray[xp_book_3].needed * 20),
        synthesis: true,
    };


    // Ce code va avoir pour objectif de générer les données de synthèse des groupes de ressources concernées par celle-ci. Ainsi, on va
    // Boucler sur les ressources du tableaux temporaires
    computedBuildArray.forEach((el, index) => {
        // Récupérer sa catégorie de ressources (parmi les 8) et sa rareté s'il en a une
        const category = el.code.slice(0, 1);
        const quality = el.code.slice(-1);

        // Si la ressource fait partie des catégorie m ou l et a une qualité de 3, ou bien p ou a avec une qualité de 4, alors c'est une ressources concernée par notre affichage de la synthèse
        if ((["m", "l"].indexOf(category) >= 0 && quality === "3") || (["p", "a"].indexOf(category) >= 0 && quality === "4")) {
            // On initialise les données de besoin de groupe et celles de possession de ce groupe
            let group_have = 0;
            let group_needed = 0;
            // On filtre le tableau temporaire avec uniquement les ressources appartenant a notre groupe actuel et on boucle dessus
            computedBuildArray.filter(fi => fi.code.slice(0, 3) === el.code.slice(0, 3)).forEach(ele => {
                // On initialise le multiplier en faisant 3 puissance (dernier caractère représentant la rareté) - 1. Par exeple, avec les raretés 4, 3, 2 et 1 respectivement
                // On obtient : 3 puissance (4 - 1) = 27 ; 3 puissance (4 - 2) = 9 ; 3 puissance (4 - 3) = 3 ; 3 puissance (4 - 4) = 1
                const multiplier = Math.pow(3, parseInt(ele.code.slice(-1)) - 1);
                const have = ele.have;
                const needed = ele.needed;
                // On additionne au fur et à mesure que les ressources du même groupe passe
                group_have += multiplier * have;
                group_needed += multiplier * needed;
            });
            // Puis on modifie l'objet concerné pour lui affecter ces nouvelles valeurs
            computedBuildArray[index] = {
                ...computedBuildArray[index],
                group_have: group_have,
                group_needed: group_needed,
                synthesis: true,
            };
        }

        // Nouvelle partie, dernière, le calcul de la quantité estimée de résine nécessaires pour farmer toutes les ressources qui en dépendent
        // On inscrit ici les différents coefficient de drop propre à leur catégorie
        const coefficientResin = {
            weekly_boss: 2.38 / 3,
            mini_boss: 2.55,
            gem: 0.215325 * 20,
            talent_book: 10.18,
            weapon_material: 17.05,
        };

        // Pour factoriser, on utilise un tableau pour les différentes itérations avec les bonnes valeurs à utiliser
        const processResinVar = [
            { letter: "b", resin: 60, group: "weekly_boss", qualityCheck: false },
            { letter: "s", resin: 40, group: "mini_boss", qualityCheck: false },
            { letter: "p", resin: 20, group: "gem", qualityCheck: true, qualityValue: "4", },
            { letter: "l", resin: 20, group: "talent_book", qualityCheck: true, qualityValue: "3", },
            { letter: "a", resin: 20, group: "weapon_material", qualityCheck: true, qualityValue: "4", },
        ];

        // 5 catégories donc boucle de 0 à 4
        for (let i = 0; i <= 4; i++) {
            // On a besoin que 3 conditions soient vraies
            if ((
                // La ressource doit appartenir à l'une des catégories [b, s, p, l, a]
                (category === processResinVar[i].letter) &&
                // Si qualityCheck = true, alors on vérifie que la qualité est égale à la valeur maximale du groupe (3 ou 4), sinon c'est true d'office
                (!processResinVar[i].qualityCheck ? true : quality === processResinVar[i].qualityValue ? true : false) &&
                // On vérifie qu'il y a bien un besoin de matériel
                (computedBuildArray[index].needed - computedBuildArray[index].have > 0)
            )) {
                // On affecte à group resin une nouvelle valeurs
                computedBuildArray[index].group_resin =
                    // Arrondi sup (( need - have ) / coef ) * resin. Ou  (( group_need - group_have ) / coef ) * resin
                    Math.ceil(
                        (
                            computedBuildArray[index][`${processResinVar[i].qualityCheck ? "group_" : ""}needed`] -
                            computedBuildArray[index][`${processResinVar[i].qualityCheck ? "group_" : ""}have`]
                        ) / coefficientResin[processResinVar[i].group]
                    ) * processResinVar[i].resin;
            }
        }
    });

    // Enfin, on renvoie tous notre tableau computed en le triant par Id pour être sûr que les matériaux soient affichés dans le même ordre que l'inventaire du jeu
    const sorted = computedBuildArray.sort(sortFunction("id"));
    return sorted;
});

const searchingWeaponQuery = ref("");
const searchingCharactersQuery = ref("");
const showResultList = ref(false);

const filteredResults = computed(() => {
    let temporaryArray = [];
    if (searchingWeaponQuery.value.length > 0) {
        temporaryArray = weaponNameList.filter(name =>
            name.toLowerCase().includes(searchingWeaponQuery.value.toLowerCase())
        ).slice(0, 5);
    }
    return temporaryArray;
});

const hideList = () => {
    setTimeout(() => {
        showResultList.value = false;
    }, 100);
};

const addWeaponToDo = (name) => {
    const currentWeapon = weaponsList.find(el => el.eng_name === name || el.name === name);
    data.Weapons.push({
        name: currentWeapon.name,
        rarity: currentWeapon.rarity,
        cLvl: 1,
        wLvl: currentWeapon.rarity < 3 ? 74 : 96,
    });
    searchingWeaponQuery.value = "";
    updateLocalStorage("Weapons");
};

const deletingWeaponToDo = (index) => {
    data.Weapons.splice(index, 1);
    updateLocalStorage("Weapons");
};

// Création de trois valeur en ref qui se chargement d'accueillir les données liées aux heures
let currentTime = ref("En attente");
let coultdownReset = ref("Choisir un serveur");
let serverDay = ref("Choisir un serveur");

// Objet gérant tout ce qui est date et heure
const handleTime = {
    // Fuseau horaire par rapport à GMT de chacun des trois serveurs
    timeShift: {
        Asiatique: 8,
        Européen: 1,
        Américain: -5,
    },
    // Création de trois variables utilisées après
    // Nombre de milisecondes dans une heure
    oneHour: 60 * 60 * 1000,
    timeZone: null,
    minusTheFourHoursReset: null,

    // La fonction qui va être démarrée en première. Elle va actualisée chaque seconde les valeurs. Elle semble avoir un effet de bord involontaire car en cas de bug, elle va actualisé les messages d'erreur chaque seconde
    timeRefresh: () => {
        setTimeout(handleTime.getBeautifulHours, 1000);
    },

    // Fonction centrale de cet objet.
    getBeautifulHours: () => {
        // La valeur de timezone va être défini comme étant la différence de fuseau horaire entre l'heure locale et l'heure du serveur sélectionner. On transforme cette valeur en milisecondes
        handleTime.timeZone = (handleTime.timeShift[data.Options.server] - new Date().getTimezoneOffset() / -60) * handleTime.oneHour,
        // Les serveurs se reset à 4h du matin, mais on va vouloir simuler que c'est à 00h donc on calcul la valeur de 4 heures en milisecondes
        handleTime.minusTheFourHoursReset = handleTime.oneHour * 4;

        // Heure du serveur = heureLocal + décalage - les 4 heures
        const serverTime = Date.now() + handleTime.timeZone - handleTime.minusTheFourHoursReset;
        // Heure local avec fonction pour la rendre au format voulu
        currentTime.value = handleTime.renderDate(new Date(Date.now()));
        // Calcul du compte à rebourd jusqu'à arriver au reset du serveur.
        coultdownReset.value = handleTime.renderDate(handleTime.coultdownBuilder(new Date(serverTime + 24 * handleTime.oneHour), new Date(serverTime)));
        // On essaie de savoir à quel jour le serveur est. On prend l'heure server, on prend la date (dimanche 0 et samedi 6) et on adapte ce résultat pour avoir (lundi 1 et dimanche 7)
        serverDay.value = ((new Date(Date.now() + handleTime.timeZone - handleTime.minusTheFourHoursReset).getDay() + 6) % 7) + 1;

        // Une fois fait, on relance la boucle
        handleTime.timeRefresh();
    },

    // Fonction spécifique au compte à rebourd.
    coultdownBuilder: (date, serverTime) => {
        // On simule le lendemain minuit en créant une nouvelle date manuellement avec l'heure du serveur + 24h mais en mettant minuit dans new Date
        const tomorrowMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 1);
        // On calcule la différence entre les deux date
        const difference = tomorrowMidnight - serverTime;
        // On adapte la date reçue pour qu'elle ne subisse pas de problème à cause des fuseaux horaires
        return new Date(new Date(difference).getTime() + new Date(difference).getTimezoneOffset() * 60000);
    },

    // Fonction pour rendre les heures jolies avecjuste heures, minutes et secondes avec vérification des dizaines
    renderDate: (date) => {
        let H, M, S;
        H = date.getHours();
        M = date.getMinutes();
        S = date.getSeconds();
        if (H < 10) H = "0" + H;
        if (M < 10) M = "0" + M;
        if (S < 10) S = "0" + S;
        return H + ":" + M + ":" + S;
    },
};

// Fonction appelé avant le montage du composant afin d'initier les tablaux de données et la mise en marche de l'horloge
onBeforeMount(() => {
    dataInit();
    handleTime.timeRefresh();
});
</script>

<template>
    <div class="dev-options">
        <button class="clean-button" @click="cleanLocalStorage">VIDER LE LOCAL STORAGE</button>
        <div class="boolean">
            <input
                id="boolean-doing" v-model="data.Options.onlyShowsDoingCharacter" class="boolean-checkbox"
                type="checkbox" name="boolean-doing" @change="updateLocalStorage('Options');"
            >
            <label class="boolean-label" for="boolean-doing">Ne montrer que les "doing"</label>
        </div>
        <div class="boolean">
            <input
                id="boolean-needed" v-model="data.Options.onlyShowsNeededMaterials" class="boolean-checkbox"
                type="checkbox" name="boolean-needed" @change="updateLocalStorage('Options');"
            >
            <label class="boolean-label" for="boolean-needed">Afficher uniquement les ressources nécessaires</label>
        </div>
        <div class="boolean">
            <input
                id="boolean-one-more" v-model="data.Options.alwaysOneMoreMaterial" class="boolean-checkbox"
                type="checkbox" name="boolean-one-more" @change="updateLocalStorage('Options');"
            >
            <label class="boolean-label" for="boolean-one-more">Toujours avoir 1 de plus</label>
        </div>
        <div class="boolean">
            <input
                id="boolean-explaination" v-model="data.Options.explaination" class="boolean-checkbox" type="checkbox"
                name="boolean-explaination" @change="updateLocalStorage('Options')"
            >
            <label class="boolean-label" for="boolean-explaination">Montrer les explications</label>
        </div>
        <div class="boolean">
            <input
                id="boolean-load-image" v-model="data.Options.loadIMG" class="boolean-checkbox" type="checkbox"
                name="boolean-load-image" @change="updateLocalStorage('Options')"
            >
            <label class="boolean-label" for="boolean-load-image">Afficher les images (chargement jusqu'à 5x plus long avec
                une connexion lente)</label>
        </div>
        <select v-model="data.Options.server" style="appearance: menulist-button" @change="updateLocalStorage('Options')">
            <option v-for="server in serverList" :key="server" :value="server">
                {{ server }}
            </option>
            {{ data.Options.server }}
        </select>
        <p>Heure actuelle : {{ currentTime }}</p>
        <p>Reset serveur dans : {{ coultdownReset }}</p>
        <p>Jour de la semaine : {{ serverDay }}</p>
    </div>
    <div v-if="data.Options.explaination" class="explaination">
        <p>Nom = nom du personnage</p>
        <p>J'ai = Je possède ce personnage</p>
        <p>Build = Je veux monter ce personnage</p>
        <p>Only = Je veux voir les résultats que pour ce personnage là</p>
        <p>Lvl-A = Niveau actuel de mon personnage</p>
        <p>Lvl-V = Le niveau auquel j'aimerai le monter</p>
        <p>Ap1-A = Le niveau actuelle de son attaque normale</p>
        <p>Ap1-V = Le niveau auquel je veux améliorer son attaque normale</p>
        <p>Ap2-A = Le niveau actuelle de sa compétence élémentaire</p>
        <p>Ap2-V = Le niveau auquel je veux améliorer sa compétence élémentaire</p>
        <p>Ap3-A = Le niveau actuelle de son déchaînement élémentaire</p>
        <p>Ap3-V = Le niveau auquel je veux améliorer son déchaînement élémentaire</p>
        <br>
        <p>
            Les niveaux suivis d'un "+" représentent les Ascensions de personnages après les niveaux 20, 40, 50, 60, 70 et
            80
        </p>
        <br>
        <p>
            L'option "toujours avoir 1 de plus" est là pour simplifier la rentrée des données. En effet, avoir toujours 1
            ressources de chaque choses du jeu signifie qu'il suffira de les rentrer dans l'ordre sans se soucier de ne pas
            en avoir certaine et donc de tout décaler
        </p>
    </div>
    <div class="tabs-contener">
        <table class="all-materials-inventory">
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Possédé</th>
                    <th>Nécessaire</th>
                    <th>Reste</th>
                    <th>Farmable</th>
                    <th>Synthèse : Have</th>
                    <th>Synthèse : Needed</th>
                    <th>Résine</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="material in filteredMaterials" :key="material.id">
                    <td>
                        <div class="name_cell">
                            <img
                                v-if="data.Options.loadIMG"
                                :src="require(`@static/images/genshin_icon/materials/${material.code}.png`)"
                                :style="{ backgroundImage: `url('${require(`@static/images/genshin_icon/rarity/${materialsList.find(fi => fi.code === material.code).rarity}.png`)}')` }"
                            >
                            <p>{{ material.name }}</p>
                        </div>
                    </td>
                    <InputCreator
                        v-model:value="data.Materials.find(el => el.code === material.code).have" type="number"
                        :index="data.Materials.findIndex(el => el.code === material.code)" valuename="have"
                        group="Materials" @update:value="handleChange"
                    />
                    <td>{{ material.needed }}</td>
                    <td>
                        {{ material.remain >= (data.Options.alwaysOneMoreMaterial ? 0 : 1) ? material.remain : "Parfait" }}
                    </td>
                    <td>
                        {{ !!serverDay ? (typeof material.farming_days === "number" ?
                            material.farming_days.toString().includes(serverDay.toString()) : "") : "" }}
                    </td>
                    <td>{{ material.synthesis ? material.group_have : "" }}</td>
                    <td>{{ material.synthesis ? material.group_needed : "" }}</td>
                    <td>{{ material.group_resin > 0 ? material.group_resin : "" }}</td>
                </tr>
            </tbody>
        </table>
        <div style="background-color: #4b453c;">
            <input v-model="searchingCharactersQuery" for="searching-characters" type="text">
            <label name="searching-characters">Rechercher un personnage</label>
        </div>
        <table class="all-character-progress">
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>J'ai</th>
                    <th>Build</th>
                    <th>Only</th>
                    <th>Lvl-A</th>
                    <th>Lvl-V</th>
                    <th>Ap1-A</th>
                    <th>Ap1-V</th>
                    <th>Ap2-A</th>
                    <th>Ap2-V</th>
                    <th>Ap3-A</th>
                    <th>Ap3-V</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="character in filteredCharacters" :key="character.name">
                    <td>
                        <div class="name_cell">
                            <img
                                v-if="data.Options.loadIMG"
                                :src="require(`@static/images/genshin_icon/characters/${character.name}.png`)"
                                :style="{ backgroundImage: `url('${require(`@static/images/genshin_icon/rarity/${charactersList.find(fi => fi.name === character.name).rarity}.png`)}')` }"
                            >
                            <p>{{ character.name }}</p>
                        </div>
                    </td>
                    <InputCreator
                        v-model:checked="character.got" type="checkbox"
                        :index="data.Characters.findIndex(el => el.name === character.name)" valuename="got"
                        group="Characters" @update:checked="handleChange"
                    />
                    <InputCreator
                        v-model:checked="character.doing" type="checkbox" :disabled="character.only"
                        :index="data.Characters.findIndex(el => el.name === character.name)" valuename="doing"
                        group="Characters" @update:checked="handleChange"
                    />
                    <InputCreator
                        v-model:checked="character.only" type="checkbox" :disabled="!character.doing"
                        :index="data.Characters.findIndex(el => el.name === character.name)" valuename="only"
                        group="Characters" @update:checked="handleChange"
                    />
                    <InputCreator
                        v-model:value="character.cLvl" type="select-level"
                        :index="data.Characters.findIndex(el => el.name === character.name)" valuename="cLvl"
                        :list="levelingData.level.filter((el) => el.id <= character.wLvl)" group="Characters"
                        @update:value="handleChange"
                    />
                    <InputCreator
                        v-model:value="character.wLvl" type="select-level"
                        :index="data.Characters.findIndex(el => el.name === character.name)" valuename="wLvl"
                        :list="levelingData.level.filter((el) => el.id >= character.cLvl)" group="Characters"
                        @update:value="handleChange"
                    />
                    <InputCreator
                        v-model:value="character.cAp1" type="select-aptitude"
                        :index="data.Characters.findIndex(el => el.name === character.name)" valuename="cAp1"
                        :list="aptList.filter((el) => el <= character.wAp1)" group="Characters"
                        @update:value="handleChange"
                    />
                    <InputCreator
                        v-model:value="character.wAp1" type="select-aptitude"
                        :index="data.Characters.findIndex(el => el.name === character.name)" valuename="wAp1"
                        :list="aptList.filter((el) => el >= character.cAp1)" group="Characters"
                        @update:value="handleChange"
                    />
                    <InputCreator
                        v-model:value="character.cAp2" type="select-aptitude"
                        :index="data.Characters.findIndex(el => el.name === character.name)" valuename="cAp2"
                        :list="aptList.filter((el) => el <= character.wAp2)" group="Characters"
                        @update:value="handleChange"
                    />
                    <InputCreator
                        v-model:value="character.wAp2" type="select-aptitude"
                        :index="data.Characters.findIndex(el => el.name === character.name)" valuename="wAp2"
                        :list="aptList.filter((el) => el >= character.cAp2)" group="Characters"
                        @update:value="handleChange"
                    />
                    <InputCreator
                        v-model:value="character.cAp3" type="select-aptitude"
                        :index="data.Characters.findIndex(el => el.name === character.name)" valuename="cAp3"
                        :list="aptList.filter((el) => el <= character.wAp3)" group="Characters"
                        @update:value="handleChange"
                    />
                    <InputCreator
                        v-model:value="character.wAp3" type="select-aptitude"
                        :index="data.Characters.findIndex(el => el.name === character.name)" valuename="wAp3"
                        :list="aptList.filter((el) => el >= character.cAp3)" group="Characters"
                        @update:value="handleChange"
                    />
                </tr>
            </tbody>
        </table>
        <div>
            <div class="search-input">
                <input
                    v-model="searchingWeaponQuery"
                    class="input"
                    type="text"
                    placeholder="Rechercher une arme"
                    @focus="showResultList = true"
                    @blur="hideList"
                >
                <ul v-if="showResultList" class="list">
                    <li
                        v-for="result in filteredResults"
                        :key="result"
                        class="one-result"
                        @click="addWeaponToDo(result)"
                    >
                        <img
                            v-if="data.Options.loadIMG"
                            class="results-image"
                            :src="require(`@static/images/genshin_icon/weapons/${weaponsList.find(fi => fi.name === result || fi.eng_name === result).name}.png`)"
                            :style="{ backgroundImage: `url('${require(`@static/images/genshin_icon/rarity/${weaponsList.find(fi => fi.name === result || fi.eng_name === result).rarity}.png`)}')` }"
                        >
                        <p class="result-name">{{ result }}</p>
                    </li>
                </ul>
            </div>
            <table class="all-weapons-progress">
                <thead>
                    <tr>
                        <th>Nom de l'arme</th>
                        <th>Niveau actuel</th>
                        <th>Niveau voulu</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(weapon, index) in data.Weapons" :key="index">
                        <td>
                            <div class="name_cell">
                                <button class="deleting-weapon" type="button" @click="deletingWeaponToDo(index)">X</button>
                                <img
                                    v-if="data.Options.loadIMG"
                                    :src="require(`@static/images/genshin_icon/weapons/${weapon.name}.png`)"
                                    :style="{ backgroundImage: `url('${require(`@static/images/genshin_icon/rarity/${weaponsList.find(fi => fi.name === weapon.name).rarity}.png`)}')` }"
                                >
                                <p>{{ weapon.name }}</p>
                            </div>
                        </td>
                        <InputCreator
                            v-model:value="weapon.cLvl" type="select-level"
                            :index="index" valuename="cLvl"
                            :list="levelingData[`weapon_${weapon.rarity}`].filter((el) => el.id <= weapon.wLvl)" group="Weapons"
                            @update:value="handleChange"
                        />
                        <InputCreator
                            v-model:value="weapon.wLvl" type="select-level"
                            :index="index" valuename="wLvl"
                            :list="levelingData[`weapon_${weapon.rarity}`].filter((el) => el.id >= weapon.cLvl)" group="Weapons"
                            @update:value="handleChange"
                        />
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style lang="scss">
@import "@styles/variables.scss";

.dev-options {
    background-color: #ffffff;
    border-radius: 20px;
    padding: 10px;
    color: #000000;
    width: fit-content;
    display: flex;
    flex-direction: column;
    align-items: start;

    .clean-button {
        font-weight: 500;

        &:hover {
            text-decoration: underline 3px;
        }
    }

    .boolean {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        gap: 8px;
        align-items: center;

        &-checkbox {
            appearance: checkbox;
            width: 18px;
            height: 18px;
        }

        &-label {
            font-weight: 500;
        }
    }
}

.tabs-contener {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    padding: 30px;
    align-items: start;
    gap: 15px;

}

.all-character-progress,
.all-materials-inventory,
.all-weapons-progress {
    border-collapse: collapse;

    th,
    td {
        border: 1px solid #cacaca;
        padding: 6px 2px;
    }

    th {
        color: #f5f5f5;
        background-color: #4650ac;
        width: 54px;

        &:first-child {
            width: fit-content;
        }
    }

    tr {
        background-color: #bbbbbb;
    }

    tr:nth-child(even) {
        background-color: #a3a3a3;
    }

    td {
        color: #000000;
        font-weight: 300;
        text-align: center;

        .name_cell {
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            justify-content: flex-start;
            font-weight: 400;

            img {
                border-radius: 5px;
                width: 40px;
                background-position: center;
                background-repeat: no-repeat;
                background-size: cover;
            }
        }
    }
}

.all-character-progress {
    td {
        .checkbox {
            appearance: checkbox;
            width: 20px;
            height: 20px;
        }

        .select {
            appearance: menulist-button;
            padding: 3px 0 3px 0px;
            text-align: center;
            border-radius: 4px;
            box-shadow: 0px 0px 4px 0px #000000 inset;

            option {
                color: #000000;
                background-color: #bbbbbb;
                margin: 20px;
            }

            &:hover {
                cursor: pointer;
                background-color: #7c7c7c;
                color: #cacaca;
            }
        }
    }
}

.search-input {
    position: relative;
    color: #f5f5f5;
    background-color: #4650ac;
    margin: 10px;

    .input {
        padding: 5px;

        &::placeholder {
            color: #c9c9c9;
            font-style: oblique;
            font-size: 0.8rem;
        }
    }

    .list {
        z-index: 1;
        position: absolute;
        display: flex;
        flex-direction: column;
        gap: 5px;
        background-color: #24252c;
        border: 2px solid #24252c;

        .one-result {
            display: flex;
            gap: 4px;
            cursor: pointer;
            background-color: #3f425e;
            padding: 4px;

            .results-image {
                border-radius: 5px;
                width: 30px;
                background-position: center;
                background-repeat: no-repeat;
                background-size: cover;
            }

            &:hover {
                background-color: #b8b9bd;
                color: #32333a;
            }
        }
    }
}

.deleting-weapon {
    font-weight: 500;
    font-size: 19px;
    color: #d6d6d6;
    background-color: #c94b4b;
    padding: 0px 5px;
    border-radius: 20px;
    margin: 0 10px;
}
</style>