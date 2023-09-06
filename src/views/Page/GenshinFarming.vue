<script setup>
// Importation des différentes données de Genshin stockées en JSON
const CharactersList = require("@data/genshinCharactersData.json");
const WeaponsList = require("@data/genshinWeaponsData.json");
const MaterialsList = require("@data/genshinMaterialsData.json");
const levelingData = require("@data/genshinLevelingData.json");
import GenshinImage from "@parts/GenshinImage.vue";
import InputCreator from "@parts/InputCreator.vue";
import ParamsLogo from "@svgs/ParamsLogo.vue";
import HideText from "@svgs/HideText.vue";
import ShowText from "@svgs/ShowText.vue";
import WarningLogo from "@svgs/WarningLogo.vue";
import { computed, onBeforeMount, reactive, ref } from "vue";
import { deleteOneData, deleterUser, getOneData, saveOneData } from "@middlewares/fetchHandler.js";
import { useMainStore } from "@store/Main";
const { otherData, userSession } = useMainStore();
const URL = process.env.URL;

const readyToSaveData = async (type) => {
    if (userSession.type === "identified") {
        await saveOneData(userSession.uuid, `genshin${type}Data`, JSON.stringify(data[type]));
    } else if (userSession.type === "guest") {
        localStorage.setItem(`genshin${type}Data`, JSON.stringify(data[type]));
    }
};

const readyToLoadData = async (type) => {
    if (userSession.type === "identified") {
        const X = await (await getOneData(userSession.uuid, `genshin${type}Data`)).json();
        if (X[0]) return X[0].data_string;
        return undefined;
    } else if (userSession.type === "guest") {
        const X = localStorage.getItem(`genshin${type}Data`);
        if (X) return X;
        return undefined;
    }
};

const readyToDestroyData = async (type) => {
    if (userSession.type === "identified") {
        await deleteOneData(userSession.uuid, `genshin${type}Data`);
    } else if (userSession.type === "guest") {
        localStorage.removeItem(`genshin${type}Data`);
    }
};

const copyUuid = (type) => {
    switch (type) {
    case "uuid":
        navigator.clipboard.writeText(userSession.uuid);
        break;
    case "link-with-uuid":
        navigator.clipboard.writeText(`${URL}?uuid=${userSession.uuid}`);
        break;
    }

    const copyAlert = document.querySelector(`#${type}`);
    copyAlert.classList.toggle("displayed");
    setTimeout(() => {
        copyAlert.classList.toggle("displayed");
    }, 2000);
};

// Dès le début, on stock la liste des Niveaux de personnages et d'aptitudes séparément pour faciliter leurs accès dans le template
const lvlList = levelingData.level.map(el => el.id);
const aptList = levelingData.aptitude.map(el => el.level);
const weaponNameList = WeaponsList.flatMap(el => [el.name, el.eng_name]);
// Les différentes options du choix de serveur
const serverList = ["Asiatique", "Européen", "Américain"];

// Notre gros objet global qui va contenir toutes les informations utiles à sauvegarder pour que l'utilisateur concerve ses données
const data = reactive({ Characters: [], Weapons: [], Materials: [], Options: {} });

// Une fonction appelé lors du chargement de la page (ou lors du clean du localStorage). Elle récupère, traite et vérifie les données du localStorage
const dataInit = async () => {
    otherData.loading = true;
    // On récupère dans le localStorage la chaine de caractère correspondant à nos données de personnages
    const lsCharacter = await readyToLoadData("Characters");
    // On vérifie qu'elle existe
    if (lsCharacter) {
        // Si oui, on la transforme en un tableau utilisable
        data.Characters = JSON.parse(lsCharacter);
        // Boucle initié avec la liste des personnages complètes avec uniquement le nom du personnages servant d'identifiant unique
        CharactersList.forEach(({ id }) => {
            // On le cherche dans notre nouveau tableau. 
            const currentChar = data.Characters.find(fi => id === fi.id);
            // S'il existe, on va étudier chacune des valeurs que ce personnage contient pour assurer leur validité et les remplacer si besoin
            if (currentChar) {
                // Pour chaque donnée, on va regarder si elle est logique et du bon type auquel cas inverse, cela casserai l'application. Un mauvais type ne pourrait être présent que par maladresse ou volonté de l'utilisateur
                // On regarde si chaque valeur est contenu dans les tableaux de référence, et sinon, on la remplace par la valeur par défaut
                const i = data.Characters.findIndex(fi => id === fi.id);
                if ([false, true].indexOf(currentChar.got) < 0) data.Characters[i].got = false;
                if ([false, true].indexOf(currentChar.doing) < 0) data.Characters[i].doing = false;
                if ([false, true].indexOf(currentChar.only) < 0) data.Characters[i].only = false;
                if (lvlList.indexOf(currentChar.cLvl) < 0) data.Characters[i].cLvl = 1;
                if (lvlList.indexOf(currentChar.wLvl) < 0) data.Characters[i].wLvl = 96;
                if (aptList.indexOf(currentChar.cAp1) < 0) data.Characters[i].cAp1 = 1;
                if (aptList.indexOf(currentChar.wAp1) < 0) data.Characters[i].wAp1 = 9;
                if (aptList.indexOf(currentChar.cAp2) < 0) data.Characters[i].cAp2 = 1;
                if (aptList.indexOf(currentChar.wAp2) < 0) data.Characters[i].wAp2 = 9;
                if (aptList.indexOf(currentChar.cAp3) < 0) data.Characters[i].cAp3 = 1;
                if (aptList.indexOf(currentChar.wAp3) < 0) data.Characters[i].wAp3 = 9;

                // Rajout d'une condition, au chargement, on vérifie les données. On en profite pour checker si tous les persos ont leur valeurs doing ou pas. Si oui, on change la variable correspondante en true
                if (currentChar.only) isOnlyCharacters.value = true;
            } else {
                // Sinon, on va simplement créer ce personnage avec son nom et les valeurs par défaut à l'aide de la fonction filler
                data.Characters.push(filler("Characters", id));
            }
        });
        // Si la chaîne de caractère n'existe pas, alors on va la créer de toute pièce en utilisant la fonction filler pour mettre par défaut chaque personnage
    } else {
        data.Characters = [];
        CharactersList.forEach(({ id }) => {
            data.Characters.push(filler("Characters", id));
        });
    }
    // Une fois tout cela géré, on va mettre à jour le localStorage avec nos données actualisées et vérifiées
    readyToSaveData("Characters");

    const lsWeapons = await readyToLoadData("Weapons");
    if (lsWeapons) {
        data.Weapons = JSON.parse(lsWeapons);
        WeaponsList.forEach(({ id }) => {
            const currentChar = data.Weapons.find(fi => id === fi.id);
            if (currentChar) {
                const i = data.Weapons.findIndex(fi => id === fi.id);
                if (lvlList.indexOf(currentChar.cLvl) < 0) data.Weapons[i].cLvl = 1;
                if (lvlList.indexOf(currentChar.wLvl) < 0) data.Weapons[i].wLvl = 74;
            }
        });
    } else {
        data.Weapons = [];
    }
    readyToSaveData("Weapons");

    // Pour gérer l'inventaire des ressources de farm, même procédé que la fonction ci-dessus, mais compliqué et probablement vilain à factoriser les 2 en 1
    const lsMaterial = await readyToLoadData("Materials");
    if (lsMaterial) {
        data.Materials = JSON.parse(lsMaterial);
        MaterialsList.forEach(({ code }) => {
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
        MaterialsList.forEach(({ code }) => {
            data.Materials.push(filler("Materials", code));
        });
    }
    readyToSaveData("Materials");

    // Pour gérer les options, pratiquement le même procédé mais avec beaucoup moins de valeurs et propriétés donc fait à la main pour chacune
    const lsOptions = await readyToLoadData("Options");
    if (lsOptions) {
        data.Options = JSON.parse(lsOptions);
        if ([false, true].indexOf(data.Options.onlyShowsDoingCharacter) < 0) data.Options.onlyShowsDoingCharacter = false;
        if ([false, true].indexOf(data.Options.onlyShowsNeededMaterials) < 0) data.Options.onlyShowsNeededMaterials = false;
        if ([false, true].indexOf(data.Options.alwaysOneMoreMaterial) < 0) data.Options.alwaysOneMoreMaterial = false;
        if ([false, true].indexOf(data.Options.leyLineResin) < 0) data.Options.leyLineResin = false;
        if ([false, true].indexOf(data.Options.proposeToRemoveRessources) < 0) data.Options.proposeToRemoveRessources = false;
        if ([false, true].indexOf(data.Options.loadIMG) < 0) data.Options.loadIMG = true;
        if (serverList.indexOf(data.Options.server) < 0) data.Options.server = "";
    } else {
        data.Options = {
            onlyShowsDoingCharacter: false,
            onlyShowsNeededMaterials: false,
            alwaysOneMoreMaterial: false,
            leyLineResin: false,
            proposeToRemoveRessources: false,
            loadIMG: true,
            server: "",
        };
    }
    readyToSaveData("Options");
    otherData.loading = false;
};

// La fonction filler, utilisée pour complété les données de l'array data quand les données présente dans le localStorage ne sont pas bonnes
const filler = (type, id) => {
    // Prise en compte du type de données pour différencier les propriétés à renvoyer et le nom.
    switch (type) {
    case "Characters":
        return {
            id: id,
            got: false,
            doing: false,
            only: false,
            cLvl: 1,
            wLvl: 96,
            cAp1: 1,
            wAp1: 9,
            cAp2: 1,
            wAp2: 9,
            cAp3: 1,
            wAp3: 9,
        };
    case "Materials":
        return {
            code: id,
            have: 0,
        };
    }

};

// Relié à un bouton permettant de nettoyer et reset par défaut le localStorage
const userResetData = async (type) => {
    await readyToDestroyData("Characters");
    await readyToDestroyData("Weapons");
    await readyToDestroyData("Materials");
    await readyToDestroyData("Options");
    if (type === "reset") {
        paramsOpen.value = false;
        explainationOpen.value = false;
        dataInit();
    }
};

const deleteUserData = async () => {
    await userResetData("delete");
    await deleterUser(userSession.uuid);
    quitSession();
};

const quitSession = () => {
    localStorage.removeItem("userSessionInfo");
    userSession.gotSession = false;
    userSession.type = null;
    userSession.uuid = "";
    userSession.step = "start";
};

const removeResData = reactive({
    removeRessourcesModal: false,
    weaponsOrCharactersConcerned: null,
    levelOrAptitude: null,
    oldLevel: null,
    newLevel: null,
    oldLevelName: null,
    newLevelName: null,
    levelDifference: null,
    ressorcesConcerned: [],
    enoughForAll: true,
});

// Quand un input créer avec le composant InputCreator, sa valuer est suivi avec un V-model puis un emit envoyé dans la fonction handleChange qui se charge de changer la bonne valeur dans l'array "data"
const handleChange = (group, index, valuename, value) => {
    if (valuename === "only") isOnlyCharacters.value = value;
    if (data.Options.proposeToRemoveRessources && ["cLvl", "cAp1", "cAp2", "cAp3"].indexOf(valuename) >= 0) {
        if (group === "Weapons" ? true : (group === "Characters" && data[group][index].doing === true)) {
            removeResData.weaponsOrCharactersConcerned = (group === "Characters" ? CharactersList : WeaponsList).find(fi => fi.id === data[group][index].id);
            removeResData.oldLevel = data[group][index][valuename];
            removeResData.newLevel = value;
            removeResData.levelDifference = value - data[group][index][valuename];
            let searchingString;
            if (removeResData.levelDifference > 0) {
                if (removeResData.weaponsOrCharactersConcerned.weapon_material) {
                    searchingString = `weapon_${removeResData.weaponsOrCharactersConcerned.rarity}`;
                    removeResData.levelOrAptitude = "level";
                } else if (valuename === "cLvl") {
                    searchingString = "level";
                    removeResData.levelOrAptitude = "level";
                } else {
                    searchingString = "aptitude";
                    removeResData.levelOrAptitude = "aptitude";
                }
                removeResData.oldLevelName = levelingData[searchingString].find(fi => fi.id === removeResData.oldLevel).level;
                removeResData.newLevelName = levelingData[searchingString].find(fi => fi.id === removeResData.newLevel).level;
                const progressStep = levelingData[searchingString].filter(fi => fi.id > removeResData.oldLevel && fi.id <= removeResData.newLevel);
                removeResData.ressorcesConcerned = [];
                progressStep.forEach(step => {
                    for (const [key, value] of Object.entries(step)) {
                        if (value > 0 && key != "id" && key != "level") {
                            let materialCode;
                            if (!isNaN(key.slice(-1))) {
                                materialCode = removeResData.weaponsOrCharactersConcerned[key.slice(0, -2)] + key.slice(-1);
                            } else {
                                materialCode = removeResData.weaponsOrCharactersConcerned[key];
                            }
                            if (["g02", "g05"].indexOf(materialCode) < 0) {
                                const findIndex = removeResData.ressorcesConcerned.findIndex(fi => fi.code === materialCode);
                                if (findIndex >= 0) {
                                    removeResData.ressorcesConcerned[findIndex].needed += value;
                                } else {
                                    removeResData.ressorcesConcerned.push({
                                        ...MaterialsList.find(material => material.code === materialCode),
                                        needed: value,
                                    });
                                }
                            }
                        }
                    }
                });
                removeResData.enoughForAll = true;
                removeResData.ressorcesConcerned.forEach(el => {
                    const inventory = farmingMaterial.value.find(fi => fi.code === el.code);
                    if (inventory.have - el.needed < 0) removeResData.enoughForAll = false;
                });
                removeResData.removeRessourcesModal = true;
            }
        }
    }
    data[group][index][valuename] = value;
    readyToSaveData(group);
};

const removeRessourcesAfterChangeLevel = () => {
    removeResData.ressorcesConcerned.forEach(el => {
        const materialIndex = data.Materials.findIndex(fi => el.code === fi.code);
        data.Materials[materialIndex].have -= el.needed;
    });
    removeResData.removeRessourcesModal = false;
    removeResData.weaponsOrCharactersConcerned = null;
    removeResData.levelOrAptitude = null;
    removeResData.oldLevel = null;
    removeResData.newLevel = null;
    removeResData.oldLevelName = null;
    removeResData.newLevelName = null;
    removeResData.levelDifference = null;
    removeResData.ressorcesConcerned = [];
    removeResData.enoughForAll = true;
    readyToSaveData("Materials");
};

// Chaine de caractère pour la recherche d'une arme
const searchingWeaponQuery = ref("");
// Chaine de caractère pour la recherche d'un personnage
const searchingCharactersQuery = ref("");
// Chaine de caractère pour la recherche d'une ressource
const searchingMaterialsQuery = ref("");

// Un objet computed afin de filtrer en fonction d'une options si on ne veut voir que les personnages qui ont été noté comme build
const filteredCharacters = computed(() => {
    const filter = [...data.Characters].filter((character) => {
        const currentCharacter = CharactersList.find(fi => fi.id === character.id);
        const doingCharacters = !data.Options.onlyShowsDoingCharacter || character.doing === true;
        const searchedCharacters = !searchingCharactersQuery.value || currentCharacter.name.toLowerCase().includes(searchingCharactersQuery.value.toLowerCase());

        return (
            doingCharacters &&
            searchedCharacters
        );
    });

    const sorted = filter.sort((a, b) => {
        const aName = CharactersList.find(fi => fi.id === a.id).name;
        const bName = CharactersList.find(fi => fi.id === b.id).name;
        if (aName < bName) return -1;
        if (aName > bName) return 1;
        return 0;
    });

    return sorted;
});

// Fonction de filtre pour les armes en fonction de la recherche effectuée
const filteredWeaponsResults = computed(() => {
    const temporaryArray = [];

    if (searchingWeaponQuery.value.length >= 1) {
        const firstFilter = weaponNameList.filter(name => name.toLowerCase().includes(searchingWeaponQuery.value.toLowerCase()));
        firstFilter.forEach(el => {
            if (WeaponsList.findIndex(fi => fi.eng_name === el) >= 0) {
                if (WeaponsList.findIndex(fi => fi.name === el) < 0) {
                    temporaryArray.push(WeaponsList.find(fi => fi.eng_name === el).name);
                }
            }
        });

        firstFilter.forEach(el => {
            if (temporaryArray.indexOf(el) < 0 && WeaponsList.findIndex(fi => fi.name === el) >= 0) {
                temporaryArray.push(el);
            }
        });
    }
    return temporaryArray.slice(0, 7);
});

// Un objet computed afin de filtrer en fonction d'une option si on ne veut voir que les matériaux de farm dont on a besoin
const filteredMaterials = computed(() => {
    const filter = [...farmingMaterial.value].filter((material) => {
        const neededMaterial = !data.Options.onlyShowsNeededMaterials || material.farm_require === true;
        const searchedMaterial = !searchingMaterialsQuery.value || material.name.toLowerCase().includes(searchingMaterialsQuery.value.toLowerCase());

        return (
            neededMaterial &&
            searchedMaterial
        );
    });
    return filter;
});

// Boolean indiquand si oui ou non on affiche la liste de recherche
const showResultList = ref(false);

const clickEverywhereHandler = (event) => {
    if (showResultList.value) {
        const elementToVerify = [...document.querySelectorAll(".ceh-verify")];
        if (elementToVerify.every(el => !el.contains(event.target))) {
            hideList();
        }
    }
};

// En cas d'ajout d'une arme ou de sortie du focus de l'input, on ferme la liste
const hideList = () => {
    showResultList.value = false;
};

// Fonction pour rajouter une arme à la liste.
// On procède ainsi car il y a trop d'armes donc les afficher toutes seraient imbuvables, et on peut aussi imaginer le cas d'avoir deux fois la même
const addWeaponToDo = (name) => {
    const currentWeapon = WeaponsList.find(el => el.name === name);
    data.Weapons.push({
        id: currentWeapon.id,
        rarity: currentWeapon.rarity,
        cLvl: 1,
        // En fonction de la rareté de l'arme, elle ne peut pas être amélioré au même niveau maximum
        wLvl: currentWeapon.rarity < 3 ? 74 : 96,
    });
    // On vide le champ de recherche
    searchingWeaponQuery.value = "";
    showResultList.value = false;
    // On ferme la liste
    hideList();
    // On sauvegarde le tableau d'armes actualisée
    readyToSaveData("Weapons");
};

// Action déclenché par un bouton près de chaque arme afin de la supprimer de la liste
const deletingWeaponToDo = (index) => {
    // Ayant récupéré l'index de l'arme dans le tableau en v-for, on l'envoi et l'utilise dans cette fonction
    data.Weapons.splice(index, 1);
    // On sauvegarde le tableau des armes actualisé
    readyToSaveData("Weapons");
};

// Variable pour indiquer à l'objet computed ci dessous ainsi qu'au tableau ce qu'ils doivent faire dans le cas ou un personnage a été indiqué comme étant le seul
let isOnlyCharacters = ref(false);
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
                            ...MaterialsList.find(material => material.code === materialCode),
                            needed: value,
                        });
                    }
                }
            }
        });
    };

    // La logique est donc :
    // POur chaque personnage, on ne va prendre en compte que ceux qui ont été noté comme étant à faire, à monter. On boucle sur ceux qui restent.
    // Cependant, si on a un personnages qui a été coché comme only, alors on ne va cherche que cette propriété donc que ce perso
    data.Characters.filter(char => !isOnlyCharacters.value ? char.doing === true : char.only === true).forEach(char => {
        // Dans la données de persos, on récupère celles du personnage actuel.
        const currentElement = CharactersList.find(find => find.id === char.id);
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
    // On rajoute juste une condition au cas-où un personnage a été marqué comme "only", dans ce cas on ne traite aucun autre élément
    if (!isOnlyCharacters.value) {
        data.Weapons.forEach(weap => {
            const currentElement = WeaponsList.find(find => find.id === weap.id);
            const progressStep = levelingData[`weapon_${currentElement.rarity}`].filter(step => step.id > weap.cLvl && step.id <= weap.wLvl);
            if (progressStep.length > 0) {
                materialsAttributor(progressStep, currentElement);
            }
        });
    }

    // Ce code va servir a tout de même crée un objet pour chaque ressources, même s'il n'est pas demandé pour le farm des persos choisis
    MaterialsList.forEach(material => {
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
                farm_require: false,
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
                farm_require: true,
            };
        }
    });

    // Bloc de code spécifique pour les cristaux d'expérience d'arme et les livres d'expérience de personnage
    {
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
            // On va inclure une fausse valeur de synthèse mais en reprenant le principe car cela revient au même. Ainsi on multiplie par les bons coefficient les valeurs de besoin/   possession
            group_have: computedBuildArray[xp_ore_3].have * 25 + computedBuildArray[xp_ore_2].have * 5 + computedBuildArray[xp_ore_1].have,
            group_needed: Math.ceil(computedBuildArray[xp_ore_3].needed * 25),
            // On active la synthèse pour que cela soit affiché par la suite
            synthesis: Math.ceil(computedBuildArray[xp_ore_3].needed * 25) > 0 ? true : false,
        };

        if (computedBuildArray[xp_ore_3].group_needed > 0) {
            computedBuildArray[xp_ore_3].farm_require = true;
            computedBuildArray[xp_ore_2].farm_require = true;
            computedBuildArray[xp_ore_1].farm_require = true;
        }

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
            synthesis: Math.ceil(computedBuildArray[xp_book_3].needed * 20) > 0 ? true : false,
        };

        if (computedBuildArray[xp_book_3].group_needed > 0) {
            computedBuildArray[xp_book_3].farm_require = true;
            computedBuildArray[xp_book_2].farm_require = true;
            computedBuildArray[xp_book_1].farm_require = true;
        }
    }

    // On inscrit ici les différents coefficient de drop propre à leur catégorie
    const coefficientResin = {
        weekly_boss: 2.38 / 3,
        mini_boss: 2.55,
        gem: 0.215325 * 20,
        talent_book: 10.18,  //10.18 selon un fan tableau, 10.12 selon le wiki 9,8 selon mes propres résultats
        weapon_material: 17.05,
        mora: 60000,
        character_xp: 61.25, // 122500 / 20000 * 20, données provenant du Wiki
    };

    const moraIndex = computedBuildArray.findIndex(fi => fi.code === "g01");
    const bookXpIndex = computedBuildArray.findIndex(fi => fi.code === "g05");

    if (data.Options.leyLineResin) {
        if (computedBuildArray[moraIndex].remain > 0) {
            computedBuildArray[moraIndex].group_resin = Math.ceil(computedBuildArray[moraIndex].remain / coefficientResin.mora) * 20;
        }
        if (computedBuildArray[bookXpIndex].group_needed - computedBuildArray[bookXpIndex].group_have > 0) {
            computedBuildArray[bookXpIndex].group_resin = Math.ceil((computedBuildArray[bookXpIndex].group_needed - computedBuildArray[bookXpIndex].group_have) / coefficientResin.character_xp) * 20;
        }
    }

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

            // Petit morceau de code ayant pour but que si après application des calculs de points de synthèse, un groupe a un besoin, alors toutes les ressources de son groupe seront considérés comme nécessaires.
            if (group_needed > 0) {
                for (let i = 1; i <= parseInt(quality); i++) {
                    computedBuildArray[computedBuildArray.findIndex(fi => fi.code === el.code.slice(0, 3) + i)].farm_require = true;
                }
            }

            // Puis on modifie l'objet concerné pour lui affecter ces nouvelles valeurs
            computedBuildArray[index] = {
                ...computedBuildArray[index],
                group_have: group_have,
                group_needed: group_needed,
                synthesis: group_needed > 0 ? true : false,
            };
        }

        // Nouvelle partie, dernière, le calcul de la quantité estimée de résine nécessaires pour farmer toutes les ressources qui en dépendent
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
                (
                    processResinVar[i].qualityCheck
                        ? computedBuildArray[index].group_needed - computedBuildArray[index].group_have > 0
                        : computedBuildArray[index].needed - computedBuildArray[index].have > 0
                )
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
    const sorted = computedBuildArray.sort((a, b) => {
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
        return 0;
    });

    return sorted;
});

const otherInfo = computed(() => {
    const temporary = {
        common: {
            name: "",
            code: "",
            quantity: 1000000,
        },
        rare: {
            name: "",
            code: "",
            quantity: 1000000,
        },
        local: {
            name: "",
            code: "",
            quantity: 1000000,
        },
        resin: 0,
    };

    const mobMaterials = farmingMaterial.value.filter(fi => fi.code.slice(0, 1) === "m" && fi.code.slice(-1) === "3");
    mobMaterials.forEach(el => {
        if (el.group_have < temporary[el.category.split("_")[0]].quantity) {
            temporary[el.category.split("_")[0]] = {
                name: el.name,
                code: el.code.slice(0, 3),
                quantity: el.group_have,
            };
        }
    });

    const localSpeciality = farmingMaterial.value.filter(fi => fi.code.slice(0, 1) === "r");
    localSpeciality.forEach(el => {
        if (el.have < temporary.local.quantity) {
            temporary.local = {
                name: el.name,
                code: el.code,
                quantity: el.have,
            };
        }
    });

    temporary.resin = farmingMaterial.value.map(el => el.group_resin).reduce((a, b) => a + b);

    return temporary;
});

// Création de trois valeur en ref qui se chargement d'accueillir les données liées aux heures
let currentTime = ref(null);
let coultdownReset = ref(null);
let serverDay = ref(null);

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

        // Heure local avec fonction pour la rendre au format voulu
        currentTime.value = handleTime.renderDate(new Date(Date.now()));
        if (serverList.indexOf(data.Options.server) >= 0) {
            // Heure du serveur = heureLocal + décalage - les 4 heures
            const serverTime = Date.now() + handleTime.timeZone - handleTime.minusTheFourHoursReset;
            // Calcul du compte à rebourd jusqu'à arriver au reset du serveur.
            coultdownReset.value = handleTime.renderDate(handleTime.coultdownBuilder(new Date(serverTime + 24 * handleTime.oneHour), new Date(serverTime)));
            // On essaie de savoir à quel jour le serveur est. On prend l'heure server, on prend la date (dimanche 0 et samedi 6) et on adapte ce résultat pour avoir (lundi 1 et dimanche 7)
            serverDay.value = ((new Date(Date.now() + handleTime.timeZone - handleTime.minusTheFourHoursReset).getDay() + 6) % 7) + 1;
        } else {
            coultdownReset.value = null;
            serverDay.value = null;
        }

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

const paramsOpen = ref(false);
const explainationOpen = ref(false);
const showUuid = ref(false);

const openCloseLeftModal = (type) => {
    if (type === "params") {
        paramsOpen.value = !paramsOpen.value;
        explainationOpen.value = false;
    } else if (type === "explaination") {
        explainationOpen.value = !explainationOpen.value;
        paramsOpen.value = false;
    }
};

// Fonction appelé avant le montage du composant afin d'initier les tablaux de données et la mise en marche de l'horloge
onBeforeMount(() => {
    dataInit();
    handleTime.timeRefresh();
});
</script>

<template>
    <div v-if="!otherData.loading" class="project-farming-container" @click="clickEverywhereHandler">
        <div :class="{ 'open': paramsOpen || explainationOpen }" class="left-container">
            <div class="left-content">
                <Transition mode="out-in" name="vue-transition">
                    <div v-if="paramsOpen" class="params-box">
                        <p class="left-title">Paramètres de l'outil</p>
                        <select v-model="data.Options.server" class="server-select" @change="readyToSaveData('Options')">
                            <option value="" disabled selected hidden>Choisir mon serveur Genshin</option>
                            <option v-for="server in serverList" :key="server" :value="server">
                                Serveur {{ server }}
                            </option>
                        </select>
                        <div class="params-checkbox">
                            <input
                                id="boolean-load-image" v-model="data.Options.loadIMG" class="checkbox" type="checkbox"
                                name="boolean-load-image" @change="readyToSaveData('Options')"
                            >
                            <label class="checkbox-label" for="boolean-load-image">Afficher les images (chargement plus
                                long)</label>
                        </div>
                        <div class="params-checkbox">
                            <input
                                id="boolean-doing" v-model="data.Options.onlyShowsDoingCharacter" class="checkbox"
                                type="checkbox" name="boolean-doing" @change="readyToSaveData('Options');"
                            >
                            <label class="checkbox-label" for="boolean-doing">N'afficher que les personnages à monter</label>
                        </div>
                        <div class="params-checkbox">
                            <input
                                id="boolean-needed" v-model="data.Options.onlyShowsNeededMaterials" class="checkbox"
                                type="checkbox" name="boolean-needed" @change="readyToSaveData('Options');"
                            >
                            <label class="checkbox-label" for="boolean-needed">N'afficher que les ressources
                                nécessaires</label>
                        </div>
                        <div class="params-checkbox">
                            <input
                                id="boolean-ley-line-resin" v-model="data.Options.leyLineResin" class="checkbox"
                                type="checkbox" name="boolean-ley-line-resin" @change="readyToSaveData('Options');"
                            >
                            <label class="checkbox-label" for="boolean-ley-line-resin">Calculer la résine pour
                                les lignes
                                énergétiques (Mora et livres d'xp)</label>
                        </div>
                        <div class="params-checkbox">
                            <input
                                id="boolean-remove-ressorces" v-model="data.Options.proposeToRemoveRessources"
                                class="checkbox" type="checkbox" name="boolean-remove-ressorces"
                                @change="readyToSaveData('Options')"
                            >
                            <label class="checkbox-label" for="boolean-remove-ressorces">Augmenter le niveau actuel d'un personnage à monter ou d'une arme proposera de retirer automatiquement les ressources de votre inventaire
                                (sauf livres/minerais d'expérience et uniquement si en quantité suffisante)</label>
                        </div>
                        <div class="params-checkbox">
                            <input
                                id="boolean-one-more" v-model="data.Options.alwaysOneMoreMaterial" class="checkbox"
                                type="checkbox" name="boolean-one-more" @change="readyToSaveData('Options');"
                            >
                            <label class="checkbox-label" for="boolean-one-more">Toujours avoir 1 exemplaire en plus avant d'être noté "parfait"</label>
                        </div>
                        <div v-if="userSession.type === 'identified'" class="uuid-show-box">
                            <div>
                                <ShowText v-if="showUuid" class="uuid-logo-hide-show" @click="showUuid = false" />
                                <HideText v-else-if="!showUuid" class="uuid-logo-hide-show" @click="showUuid = true" />
                            </div>
                            <p class="uuid">Uuid : {{ showUuid ? userSession.uuid : '********-****-****-****-************' }}</p>
                        </div>
                        <div v-if="userSession.type === 'identified'" class="params-button">
                            <button class="safe" @click="copyUuid('uuid')">
                                Copier mon identifiant
                            </button>
                            <span id="uuid" class="copy-confirm-alert">Copié !</span>
                        </div>
                        <div v-if="userSession.type === 'identified'" class="params-button">
                            <p class="copy-uuid-link-detail">Ce lien permet de se connecter facilement depuis n'importe quel appareil/navigateur. À mettre en favoris</p>
                            <button class="safe" @click="copyUuid('link-with-uuid')">
                                Copier le lien vers ma session
                            </button>
                            <span id="link-with-uuid" class="copy-confirm-alert">Copié !</span>
                        </div>
                        <div class="params-button">
                            <button class="safe" @click="quitSession">Fermer ma session</button>
                        </div>
                        <div class="params-button">
                            <button class="warning" @click="userResetData('reset')">
                                <WarningLogo class="warning-logo" />Réinitialiser mes données
                            </button>
                        </div>
                        <div class="params-button">
                            <button class="warning" @click="deleteUserData">
                                <WarningLogo class="warning-logo" />Supprimer toutes mes données
                            </button>
                        </div>
                    </div>
                    <div v-else-if="explainationOpen" class="explaination-box">
                        <p class="left-title">Aide et explications</p>
                        <p class="title">Signification des couleurs</p>
                        <p class="sub-title">Pour les personnages</p>
                        <p class="one-color have">Je possède ce personnage</p>
                        <p class="one-color doing">Je le possède et je veux le monter</p>
                        <p class="one-color doing-havnt">Je l'ai pas, mais je le prépare en avance</p>
                        <p class="one-color have-and-done">Je l'ai et je l'ai fini</p>
                        <p class="sub-title">Pour les ressources</p>
                        <p class="one-color require">Ressource requise parmi toutes</p>
                        <p class="one-color require-and-done">Ressource requise parmi toutes et j'en ai assez</p>
                        <p class="one-color done">Parmi les requises uniquement, celle-ci est bonne</p>
                        <p class="title">Présentation</p>
                        <p>
                            Voici mon outil. Il n'a pas véritablement de nom, pas encore, mais est destiné à vous aider à
                            gérer vos décisions en ce qui concerne le farming dans Genshin Impact. Que ce soit les armes ou
                            les personnages, sachez où vous en êtes, ce que vous pouvez faire et combien de temps cela va
                            vous prendre.
                        </p>
                        <p>
                            Il est composé de 4 parties distinctes que je vais vous détailler, j'ai essayé de faire un outil
                            bien présenté et ergonomique, mais ce n'est peut-être pas parfaitement réussi (toute suggestion
                            est bonne à prendre, n'hésitez pas à me les envoyer à l'aide du formulaire accessible en bas de
                            la page).
                        </p>
                        <p class="title">Description</p>
                        <p class="sub-title">Quelques infos</p>
                        <p>La partie supérieur vous propose en plus des réglages, quelques informations :</p>
                        <p class="indent-1">L'heure actuelle et dans combien de temps se fait le reset de votre serveur.</p>
                        <p class="indent-1">
                            Quelles sont les ressources de farm ne nécessitant pas de résine que vous avez
                            le moins. Cela concerne les drops de mobs (communs et élites) ainsi que les ressources locales
                            de chaque région.
                        </p>
                        <p class="indent-1">
                            Et enfin, la somme de résine que le calculateur estime qu'il va être nécessaire
                            pour finir votre farm. C'est une estimation basée sur des moyennes.
                        </p>
                        <p class="sub-title">Le tableau des personnages</p>
                        <p>Le premier tableau est celui des personnages (sauf le voyageur et ses différents éléments).</p>
                        <p class="indent-1">Vous pouvez les rechercher par nom.</p>
                        <p class="indent-1">Pour chaque personnage, vous pouvez indiquer 3 informations primordiales, </p>
                        <p class="indent-2">si vous l'avez ou non</p>
                        <p class="indent-2">
                            si vous voulez le monter/le build. Ceci l'ajoutera à la liste des
                            personnages/armes qui seront comptés dans le calculateur
                        </p>
                        <p class="indent-2">
                            si vous ne voulez voir les résultats que pour ce personnage (colonne Only).
                            Ainsi, seul ce personnage sera pris en compte dans le calcul. (option absente pour les armes
                            cependant)
                        </p>
                        <p class="indent-1">
                            Les 8 colonnes suivantes, ou plutôt les 4 groupes de 2 colonnes représentent le
                            Niveau (Lvl) et les 3 Aptitudes (Ap1, 2 et 3). La première colonne est votre niveau actuelle
                            (noté A et par défaut 1) et la
                            deuxième le niveau que vous visez (noté V par défaut 90 ou 10 pour les aptitudes). À noter que
                            les 6
                            niveaux d'ascensions sont présent, donc si vous vous mettez niveau 20, les matériaux de
                            l'Ascension 1 seront calculés. Mais pas si vous vous mettez Ascension 1 (il en est de même pour
                            les armes).
                        </p>
                        <p class="sub-title">Le tableau des armes</p>
                        <p>Le deuxième tableau est celui des armes, un peu différent.</p>
                        <p class="indent-1">
                            J'ai décide de ne pas les afficher car il y en à plus de 160, ça serait trop
                            grand et aussi car cela forcerait les joueurs à n'avoir qu'une arme de chaque. Le cas serait
                            rare, mais je veux laisser la liberté à qui le veut de pouvoir monter deux fois la même arme.
                        </p>
                        <p class="indent-1">
                            Ainsi, il suffit de taper son nom (anglais ou français) dans la barre de
                            recherche pour la trouver
                        </p>
                        <p class="indent-1">
                            Le système est ensuite le même que pour les personnage mais avec juste le
                            niveau. Pas de déclaration comme quoi "j'ai cette arme" ou "je veux la build" car c'est induit
                            par le fait de la rajouter à sa liste de farming.
                        </p>
                        <p class="sub-title">Le tableau des ressources</p>
                        <p>Le troisième tableau est celui des ressources directement :</p>
                        <p class="indent-1">Il est composé de 8 colonnes que je vais expliquer en détails :</p>
                        <p class="indent-2">Nom de la ressources (simple ^^)</p>
                        <p class="indent-2">
                            Possédé : Il s'agit d'un input où vous pouvez indiquer combien vous en avez. On
                            peut passer d'une ligne à l'autre avec tab sur PC ou la flèche suivante sur mobile. Les
                            ressources sont dans le même ordre que l'inventaire du jeu. 1ère page : minerai de renforcement
                            d'arme -> 3ème page : Quasi toutes les ressources -> 5ème page : Les ressources locales
                        </p>
                        <p class="indent-2">Nécessaire : Combien il en faut pour tout le farm que vous avez indiqué.</p>
                        <p class="indent-2">
                            Reste, la soustraction simple de combien il en faut par combien vous en avez. Si
                            vous en avez plus, cela indique "parfait". Aussi, une option permet de toujours en avoir 1 de
                            plus. Cela est utile quand il s'agit de rentrer la quantité de ressources qu'on a depuis le jeu.
                            Avoir toutes les ressources en au moins 1 exemplaire permet de pouvoir aller plus vite sans
                            vérifier quelles ressources ils manquent.
                        </p>
                        <p class="indent-2">
                            Farmable : Si vous avez indiqué sur quel serveur vous jouez, il sera
                            automatiquement mis pour les livres d'aptitudes et les matériaux d'armes s'ils sont farmables
                            aujourd'hui.
                        </p>
                        <p class="indent-2">Pour les deux colonnes de synthèses, je dois expliquer un point.</p>
                        <p class="indent-2">
                            Pas mal de ressources du jeu sont synthétisables. Les drops de monstres, les
                            pierres, les livres et matériaux d'armes permettent de prendre 3 ressources et de les combiner
                            en une ressource de qualité supérieure. Ainsi, je considère dans mon calculateur que 1 ressource
                            de qualité 4 vaut 27 points (1x3x3x3), 1 ressource de qualité 3 vaut 9 (1x3*3), 1 ressource de
                            qualité 2 vaut 3 (1x3) et enfin une ressource de qualité 1 vaut 1. Ainsi, on obtient une somme
                            de point pour chaque type de ces ressources qui est utilisée pour la farmer.
                        </p>
                        <p class="indent-2">Exemple :</p>
                        <p class="indent-3">
                            J'ai besoin pour un perso de 6 pierres et 9 morceaux géo. Cela fait 243 points
                            (6x27 + 9x9).
                        </p>
                        <p class="indent-3">
                            J'ai 1 pierre, 4 morceaux, 47 fragments et 78 éclats. Cela fait 282 points (1x27
                            + 4x9 + 47x3 + 78)
                        </p>
                        <p class="indent-3">
                            Donc le calculateur va me le montrer et je saurai qu'avec de la synthèse, j'ai
                            assez et que je peux arrêter de farm cette ressource.
                        </p>
                        <p class="indent-3">
                            Ainsi, la première colonne montre combien de points vous avez pour un type de
                            ressources et la deuxième vous montrer combien vous en avez besoin. Si vous dépassez, cela est
                            indiqué et vous savez que vous pouvez aller synthétiser.
                        </p>
                        <p class="indent-2">
                            La dernière colonne est une estimation de combien de résine vous aurez besoin
                            pour les ressources qui le demandent.
                        </p>
                        <p class="enjoy">En espérant que mon projet vous sera utile. Have Fun</p>
                    </div>
                </Transition>
            </div>
            <div class="left-navigation">
                <button
                    class="left-open-button" :class="{ 'not-open': !paramsOpen && explainationOpen }"
                    @click="openCloseLeftModal('params')"
                >
                    <ParamsLogo class="params-gear-logo" />
                </button>
                <button
                    class="left-open-button" :class="{ 'not-open': !explainationOpen && paramsOpen }"
                    @click="openCloseLeftModal('explaination')"
                >
                    <p class="explaination-logo">?</p>
                </button>
            </div>
        </div>
        <div class="farming-informations-container">
            <div class="fewer-resources">
                <p>Les trois ressources farmables sans résine que tu as le moins sont :</p>
                <div class="resources-categories">
                    <div class="image-container">
                        <GenshinImage
                            v-if="data.Options.loadIMG" type="materials" :identifier="`${otherInfo.common.code}1`"
                            rarity="1"
                        />
                        <GenshinImage
                            v-if="data.Options.loadIMG" type="materials" :identifier="`${otherInfo.common.code}2`"
                            rarity="2"
                        />
                        <GenshinImage
                            v-if="data.Options.loadIMG" type="materials" :identifier="`${otherInfo.common.code}3`"
                            rarity="3"
                        />
                    </div>
                    <p class="fewer-resources-description">
                        Drop de mobs communs : {{ otherInfo.common.name }} et ses dérivés
                        avec {{ otherInfo.common.quantity }} {{ otherInfo.common.quantity > 1 ? 'points' : 'point' }}.
                    </p>
                </div>
                <div class="resources-categories">
                    <div class="image-container">
                        <GenshinImage
                            v-if="data.Options.loadIMG" type="materials" :identifier="`${otherInfo.rare.code}1`"
                            rarity="1"
                        />
                        <GenshinImage
                            v-if="data.Options.loadIMG" type="materials" :identifier="`${otherInfo.rare.code}2`"
                            rarity="2"
                        />
                        <GenshinImage
                            v-if="data.Options.loadIMG" type="materials" :identifier="`${otherInfo.rare.code}3`"
                            rarity="3"
                        />
                    </div>
                    <p class="fewer-resources-description">
                        Drop de mobs élites : {{ otherInfo.rare.name }} et ses dérivés
                        avec {{ otherInfo.rare.quantity }} {{ otherInfo.rare.quantity > 1 ? 'points' : 'point' }}.
                    </p>
                </div>
                <div class="resources-categories">
                    <div class="image-container">
                        <GenshinImage
                            v-if="data.Options.loadIMG" type="materials" :identifier="`${otherInfo.local.code}`"
                            rarity="1"
                        />
                    </div>
                    <p class="fewer-resources-description">
                        Ressources locales : {{ otherInfo.local.name }} avec {{
                            otherInfo.local.quantity }} {{ otherInfo.local.quantity > 1 ? 'unités' : 'unité' }}.
                    </p>
                </div>
                <div class="resources-categories">
                    <p class="resin-description">
                        Résine totale : <span class="resin-count">{{ otherInfo.resin }}</span>
                    </p>
                    <p class="resin-description">
                        Nombre de jours que cela représente : <span class="resin-count">{{ Math.ceil(otherInfo.resin /
                            180) }}</span>
                    </p>
                </div>
            </div>
            <div class="time-box">
                <p>Heure actuelle : {{ currentTime }}</p>
                <p v-if="coultdownReset != null">Reset serveur : {{ coultdownReset }}</p>
                <p v-else-if="coultdownReset === null">Choisir un serveur dans les options</p>
            </div>
        </div>
        <div v-if="removeResData.removeRessourcesModal" class="remove-resources-cache">
            <div class="remove-resources-modal">
                <img
                    class="close-modal" src="@static/images/close.png"
                    @click="removeResData.removeRessourcesModal = false"
                >
                <p class="status">
                    Vous avez amélioré {{ removeResData.levelOrAptitude === 'level' ? 'le niveau' : 'une aptitude' }} de
                    <span class="status-bold">{{ removeResData.weaponsOrCharactersConcerned.name }}</span> de <span
                        class="status-bold"
                    >{{
                        removeResData.oldLevelName }}</span> à <span class="status-bold">{{ removeResData.newLevelName
                    }}</span>.
                </p>
                <div v-if="removeResData.enoughForAll" class="choice-container">
                    <p class="information information-choice">
                        Voulez-vous retirer les ressources correspondantes de votre
                        inventaire ?
                    </p>
                    <p class="little-precision">
                        (Les livres d'expérience et minerai de renforcement ne sont pas pris en
                        compte, à vous de changer en fonction de ce qui a été utilisé)
                    </p>
                    <div class="remove-ressources-list">
                        <table>
                            <tbody>
                                <tr
                                    v-for="ressource in removeResData.ressorcesConcerned" :key="ressource.code"
                                    class="one-resource"
                                >
                                    <td>
                                        <GenshinImage
                                            v-if="data.Options.loadIMG" type="materials"
                                            :identifier="`${ressource.code}`"
                                            :rarity="`${MaterialsList.find(fi => fi.code === ressource.code).rarity}`"
                                        />
                                    </td>
                                    <td class="needed-count">{{ ressource.needed }}x </td>
                                    <td class="resource-name">{{ ressource.name }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="remove-resources-choices">
                        <button class="confirm-choice" @click="removeRessourcesAfterChangeLevel">Oui, les retirer</button>
                        <button class="cancel-choice" @click="removeResData.removeRessourcesModal = false">
                            Non, je le ferai
                            manuellement
                        </button>
                    </div>
                </div>
                <div v-if="!removeResData.enoughForAll">
                    <p class="information">
                        Une ou plusieurs des ressources nécessaires n'est pas en quantité suffisante dans l'inventaire, vous
                        devriez gérer vos ressources manuellement pour éviter les erreurs.
                    </p>
                </div>
            </div>
        </div>
        <div class="section-container">
            <div class="table-section characters-table-section">
                <div class="characters-top-table-box">
                    <p class="characters-informations">{{ data.Characters.filter(fi => fi.got).length }} / {{ data.Characters.length }} personnages possédés</p>
                    <div class="search-input">
                        <input
                            v-model="searchingCharactersQuery" class="input" type="text"
                            placeholder="Rechercher un personnage"
                        >
                    </div>
                    <p class="characters-informations">{{ data.Characters.filter(fi => fi.got && fi.cLvl === fi.wLvl && fi.cAp1 === fi.wAp1 && fi.cAp2 === fi.wAp2 && fi.cAp3 === fi.wAp3).length }} / {{ data.Characters.length }} personnages finis</p>
                </div>
                <div class="table-box">
                    <table class="table characters-informations">
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
                            <tr
                                v-for="character in filteredCharacters" :key="character.id" :class="{
                                    'have': character.got,
                                    'doing': character.doing,
                                    'doing-havnt': !character.got && character.doing,
                                    'have-and-done': character.got && character.cLvl === character.wLvl && character.cAp1 === character.wAp1 && character.cAp2 === character.wAp2 && character.cAp3 === character.wAp3,
                                }"
                            >
                                <td>
                                    <div class="name-cell">
                                        <GenshinImage
                                            v-if="data.Options.loadIMG" type="characters"
                                            :identifier="`c-${character.id}`"
                                            :rarity="`${CharactersList.find(fi => fi.id === character.id).rarity}`"
                                        />
                                        <p>{{ CharactersList.find(fi => fi.id === character.id).name }}</p>
                                    </div>
                                </td>
                                <InputCreator
                                    :checked="character.got" type="checkbox"
                                    @update:checked="newValue => handleChange('Characters', data.Characters.findIndex(el => el.id === character.id), 'got', newValue)"
                                />
                                <InputCreator
                                    :checked="character.doing" type="checkbox" :disabled="character.only"
                                    @update:checked="newValue => handleChange('Characters', data.Characters.findIndex(el => el.id === character.id), 'doing', newValue)"
                                />
                                <InputCreator
                                    :checked="character.only" type="checkbox"
                                    :disabled="!character.doing || (!character.only && isOnlyCharacters)"
                                    @update:checked="newValue => handleChange('Characters', data.Characters.findIndex(el => el.id === character.id), 'only', newValue)"
                                />
                                <InputCreator
                                    :value="character.cLvl" type="select-level"
                                    :list="levelingData.level.filter((el) => el.id <= character.wLvl)"
                                    @update:value="newValue => handleChange('Characters', data.Characters.findIndex(el => el.id === character.id), 'cLvl', newValue)"
                                />
                                <InputCreator
                                    :value="character.wLvl" type="select-level"
                                    :list="levelingData.level.filter((el) => el.id >= character.cLvl)"
                                    @update:value="newValue => handleChange('Characters', data.Characters.findIndex(el => el.id === character.id), 'wLvl', newValue)"
                                />
                                <InputCreator
                                    :value="character.cAp1" type="select-aptitude"
                                    :list="aptList.filter((el) => el <= character.wAp1)"
                                    @update:value="newValue => handleChange('Characters', data.Characters.findIndex(el => el.id === character.id), 'cAp1', newValue)"
                                />
                                <InputCreator
                                    :value="character.wAp1" type="select-aptitude"
                                    :list="aptList.filter((el) => el >= character.cAp1)"
                                    @update:value="newValue => handleChange('Characters', data.Characters.findIndex(el => el.id === character.id), 'wAp1', newValue)"
                                />
                                <InputCreator
                                    :value="character.cAp2" type="select-aptitude"
                                    :list="aptList.filter((el) => el <= character.wAp2)"
                                    @update:value="newValue => handleChange('Characters', data.Characters.findIndex(el => el.id === character.id), 'cAp2', newValue)"
                                />
                                <InputCreator
                                    :value="character.wAp2" type="select-aptitude"
                                    :list="aptList.filter((el) => el >= character.cAp2)"
                                    @update:value="newValue => handleChange('Characters', data.Characters.findIndex(el => el.id === character.id), 'wAp2', newValue)"
                                />
                                <InputCreator
                                    :value="character.cAp3" type="select-aptitude"
                                    :list="aptList.filter((el) => el <= character.wAp3)"
                                    @update:value="newValue => handleChange('Characters', data.Characters.findIndex(el => el.id === character.id), 'cAp3', newValue)"
                                />
                                <InputCreator
                                    :value="character.wAp3" type="select-aptitude"
                                    :list="aptList.filter((el) => el >= character.cAp3)"
                                    @update:value="newValue => handleChange('Characters', data.Characters.findIndex(el => el.id === character.id), 'wAp3', newValue)"
                                />
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="table-section weapons-table-section">
                <div class="search-input ceh-verify">
                    <input
                        v-model="searchingWeaponQuery" class="input" type="text" placeholder="Rechercher une arme"
                        @focus="showResultList = true"
                    >
                    <ul v-if="showResultList && searchingWeaponQuery.length >= 1" class="list">
                        <li
                            v-for="result in filteredWeaponsResults" :key="result" class="one-result"
                            @click="addWeaponToDo(result)"
                        >
                            <GenshinImage
                                v-if="data.Options.loadIMG" type="weapons"
                                :identifier="`w-${WeaponsList.find(fi => fi.name === result).id}`"
                                :rarity="`${WeaponsList.find(fi => fi.name === result).rarity}`"
                            />
                            <p class="result-name">{{ result }}</p>
                        </li>
                    </ul>
                </div>
                <div class="table-box">
                    <table class="table weapons-informations">
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
                                    <div class="name-cell">
                                        <img
                                            class="deleting-weapon" src="@static/images/close.png"
                                            @click="deletingWeaponToDo(index)"
                                        >
                                        <GenshinImage
                                            v-if="data.Options.loadIMG" type="weapons"
                                            :identifier="`w-${weapon.id}`"
                                            :rarity="`${WeaponsList.find(fi => fi.id === weapon.id).rarity}`"
                                        />
                                        <p>{{ WeaponsList.find(fi => fi.id === weapon.id).name }}</p>
                                    </div>
                                </td>
                                <InputCreator
                                    :value="weapon.cLvl" type="select-level"
                                    :list="levelingData[`weapon_${weapon.rarity}`].filter(el => el.id <= weapon.wLvl)"
                                    @update:value="newValue => handleChange('Weapons', index, 'cLvl', newValue)"
                                />
                                <InputCreator
                                    :value="weapon.wLvl" type="select-level"
                                    :list="levelingData[`weapon_${weapon.rarity}`].filter(el => el.id >= weapon.cLvl)"
                                    @update:value="newValue => handleChange('Weapons', index, 'wLvl', newValue)"
                                />
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="table-section materials-table-section">
                <div class="search-input">
                    <input
                        v-model="searchingMaterialsQuery" class="input" type="text"
                        placeholder="Rechercher une ressource"
                    >
                </div>
                <div class="table-box">
                    <table class="table materials-informations">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>J'en ai</th>
                                <th>Besoin</th>
                                <th>Reste</th>
                                <th>Farmable</th>
                                <th>Synt - J'ai</th>
                                <th>Synt - Besoin</th>
                                <th>Résine</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="material in filteredMaterials" :key="material.id" :class="{
                                    'require': material.farm_require && !data.Options.onlyShowsNeededMaterials,
                                    'require-and-done': !data.Options.onlyShowsNeededMaterials && material.farm_require && material.needed - material.have < (data.Options.alwaysOneMoreMaterial ? 0 : 1),
                                    'done': data.Options.onlyShowsNeededMaterials && material.needed - material.have < (data.Options.alwaysOneMoreMaterial ? 0 : 1)
                                }"
                            >
                                <td>
                                    <div class="name-cell">
                                        <GenshinImage
                                            v-if="data.Options.loadIMG" type="materials"
                                            :identifier="`${material.code}`"
                                            :rarity="`${MaterialsList.find(fi => fi.code === material.code).rarity}`"
                                        />
                                        <p>{{ material.name }}</p>
                                    </div>
                                </td>
                                <InputCreator
                                    :value="data.Materials.find(el => el.code === material.code).have"
                                    type="number"
                                    @update:value="newValue => handleChange('Materials', data.Materials.findIndex(el => el.code === material.code), 'have', !!parseInt(newValue) ? (newValue >= 0 ? newValue : 0) : 0)"
                                />
                                <td>{{ material.needed }}</td>
                                <td>
                                    {{ material.needed - material.have >= (data.Options.alwaysOneMoreMaterial ? 0 : 1) ?
                                        material.remain : "Parfait" }}
                                </td>
                                <td
                                    :class="{
                                        'farm-day': material.needed - material.have >= (data.Options.alwaysOneMoreMaterial ? 0 : 1) &&
                                            !!serverDay &&
                                            typeof material.farming_days === 'number' &&
                                            !!material.farming_days.toString().includes(serverDay.toString())
                                    }"
                                >
                                    {{
                                        (material.needed - material.have >= (data.Options.alwaysOneMoreMaterial ? 0 : 1) &&
                                            !!serverDay &&
                                            typeof material.farming_days === "number" &&
                                            !!material.farming_days.toString().includes(serverDay.toString()))
                                            ? "OUI"
                                            : ""
                                    }}
                                </td>
                                <td :class="{ 'synthesis-ok': material.synthesis && material.group_have > material.group_needed }">{{ material.synthesis ? material.group_have : "" }}</td>
                                <td :class="{ 'synthesis-ok': material.synthesis && material.group_have > material.group_needed }">{{ material.synthesis ? material.group_needed : "" }}</td>
                                <td>{{ material.group_resin > 0 ? material.group_resin : "" }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import "@styles/variables.scss";

.project-farming-container {
    padding: 10px;
    width: 100%;

    .genshin-image {
        border-radius: 5px;
        width: 40px;
        height: 40px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }

    .left-container {
        position: fixed;
        display: flex;
        width: 95%;
        max-width: 750px;
        min-height: 300px;
        height: fit-content;
        max-height: 715px;
        background-color: transparent;
        transition: all 0.7s;
        z-index: $left-container;
        transform: translateX(calc(-100% + 70px - 10px));
        pointer-events: none;

        .left-content {
            width: calc(100% - 70px);
            background-color: $color3;
            border-radius: 0 0 30px 0;
            border: 2px solid $color8;
            padding: 10px;
            color: $color5;
            overflow-y: auto;
            max-height: 95vh;
            z-index: $left-content-box;
            pointer-events: visiblePainted;

            .params-box {
                display: flex;
                flex-direction: column;

                .server-select {
                    cursor: pointer;
                    position: relative;
                    appearance: menulist-button;
                    font-weight: 400;
                    background-color: $color19;
                    padding: 6px;
                    margin: 8px 0;
                    border-radius: 10px;
                }

                .params-checkbox {
                    padding: 7px 0;
                    border-top: 1px solid $color10;

                    .checkbox {
                        cursor: pointer;
                        float: left;
                        appearance: none;
                        color: $color5;
                        margin-right: 5px;
                        width: 24px;
                        height: 24px;
                        border: 2px solid $color5;
                        border-radius: 4px;
                        transform: translateY(1px);
                        display: grid;
                        place-content: center;

                        &:checked {
                            border-color: transparent;
                            background-color: $color6;
                        }
                    }

                    .checkbox::before {
                        content: "";
                        width: 18px;
                        height: 18px;
                        clip-path: polygon(0 50%, 15% 47%, 27% 43%, 36% 36%, 43% 26%, 46% 14%, 50% 0, 53% 13%, 56% 25%, 64% 36%, 75% 43%, 85% 45%, 100% 50%, 85% 54%, 75% 58%, 64% 64%, 57% 74%, 53% 85%, 50% 100%, 46% 85%, 43% 74%, 36% 64%, 27% 58%, 15% 54%);
                        transform: scale(0);
                        transition: 0.1s transform ease-in-out;
                        transform-origin: bottom left;
                        background-color: $color2;
                    }

                    .checkbox:checked::before {
                        transform: scale(1);
                    }

                    .checkbox-label {
                        display: block;
                        font-weight: 400;
                        text-align: justify;
                    }
                }

                .uuid-show-box {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 0 5px;

                    .uuid-logo-hide-show {
                        cursor: pointer;
                        width: 32px;
                        height: 32px;
                    }
                }

                .params-button {
                    position: relative;

                    button {
                        font-weight: 400;
                        margin: 3px;
                        border: 2px solid $color8;
                        border-radius: 8px;
                        color: $color3;
                        padding: 4px 12px;
                        width: 100%;

                        &:hover {
                            letter-spacing: 0.8px;
                            color: $color2;
                        }
                    }

                    .copy-confirm-alert {
                        position: absolute;
                        top: -15px;
                        left: calc(50% - 65px / 2);
                        width: 65px;
                        text-align: center;
                        background-color: $color7;
                        color: $color3;
                        padding: 3px 8px;
                        border-radius: 4px;
                        display: none;

                        &.displayed {
                            display: block;
                            animation: showQuickMessage 2s ease normal;
                        }

                        @keyframes showQuickMessage {
                            0% {
                                opacity: 0;
                                transform: translateX(-40px);
                            }

                            20% {
                                opacity: 1;
                            }

                            50% {
                                opacity: 1;
                                transform: translateX(0px);
                            }

                            100% {
                                opacity: 0;
                                transform: translateX(40px);
                            }
                        }
                    }

                    button.safe {
                        background-color: $color6;
                    }

                    button.warning {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background-color: $color15;
                        gap: 0 10px;

                        .warning-logo {
                            width: 21px;
                            height: 21px;
                        }
                    }

                    .copy-uuid-link-detail {
                        margin-top: 8px;
                        font-style: oblique;
                        font-size: 14px;
                        text-align: center;
                    }
                }

            }

            .explaination-box {
                .title {
                    font-weight: 700;
                    font-size: 25px;
                    color: $color4;
                    text-align: center;
                }

                .one-color {
                    padding: 5px;
                    font-size: 16px;
                    border-radius: 6px;
                    padding: 4px;
                    text-align: center;
                }

                .one-color.have {
                    background: linear-gradient(90deg, $characters-have 0%, $characters-have-even 100%);
                }

                .one-color.doing {
                    background: linear-gradient(90deg, $characters-doing 0%, $characters-doing-even 100%);
                }

                .one-color.doing-havnt {
                    background: linear-gradient(90deg, $characters-doing-havnt 0%,  $characters-doing-havnt-even 100%);
                }

                .one-color.have-and-done {
                    background: linear-gradient(90deg, $characters-have-and-done 0%,    $characters-have-and-done-even 100%);
                }

                .one-color.require {
                    background: linear-gradient(90deg, $material-require 0%, $material-require-even 100%);
                }

                .one-color.require-and-done {
                    background: linear-gradient(90deg, $material-require-and-done 0%,    $material-require-and-done-even 100%);
                }
                
                .one-color.done {
                    background: linear-gradient(90deg, $material-only-need-and-done 0%,    $material-only-need-and-done-even 100%);
                }

                .sub-title {
                    font-weight: 500;
                    font-size: 20px;
                    color: $color7;
                }

                p {
                    margin: 5px 5px 5px 0;
                    text-align: justify;
                }

                .indent-1 {
                    margin-left: 20PX;
                    display: list-item;
                    list-style: disc;
                }

                .indent-2 {
                    margin-left: 40PX;
                    display: list-item;
                    list-style: square;
                }

                .indent-3 {
                    margin-left: 60PX;
                    display: list-item;
                    list-style: circle;
                }

                .enjoy {
                    text-align: center;
                    font-weight: 400;
                    font-style: oblique;
                    color: $color4;
                }
            }

            .params-box,
            .explaination-box {
                .left-title {
                    text-align: center;
                    font-size: 22px;
                    font-weight: 500;
                    color: $color4;
                    padding: 9px;
                    margin: 6px auto;
                    width: fit-content;
                    border-radius: 5px;
                    border: 3px solid $color8;
                }
            }

            .vue-transition-enter-from,
            .vue-transition-leave-to {
                opacity: 0;
            }
        }


        .left-navigation {
            display: flex;
            flex-direction: column;
            gap: 15px 0;
            height: fit-content;
            pointer-events: visiblePainted;

            .left-open-button {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 70px;
                height: 60px;
                background-color: $color3;
                border-radius: 0 18px 18px 0;
                overflow: hidden;
                z-index: $left-nav-button;

                .params-gear-logo {
                    width: 52px;
                    height: 52px;
                    transition: all 0.7s;
                    transform: rotate(0deg);

                    path {
                        fill: none;
                        stroke: $color5;
                    }
                }

                .explaination-logo {
                    font-size: 52px;
                    font-weight: 700;
                    color: $color5;
                    width: 100%;
                }
            }

            .not-open {
                background-color: $color10;
                transform: translateX(-15px);
            }
        }
    }

    .left-container.open {
        transform: translateX(-10px);

        .left-navigation {
            .left-open-button {
                .params-gear-logo {
                    transform: rotate(450deg);
                }
            }
        }
    }

    .farming-informations-container {
        margin: 0 50px 20px 85px;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 35px 65px;

        .fewer-resources {
            display: flex;
            flex-direction: column;

            .resources-categories {
                padding: 9px;
                border: 3px solid $color8;
                background-color: $color18;
                border-radius: 15px;
                margin: 10px 0;

                .image-container {
                    float: left;
                    display: flex;
                    flex-wrap: wrap;

                    .genshin-image {
                        margin: 0 5px;
                    }
                }

                .fewer-resources-description {
                    min-height: 40px;
                }

                .resin-description {
                    .resin-count {
                        font-weight: 500;
                        font-size: 22px;
                        color: $color3;
                    }
                }
            }
        }

        .time-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            height: fit-content;
            background-color: $color8;
            border-radius: 7px;
            padding: 9px;
            width: fit-content;
        }
    }

    .remove-resources-cache {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: $cache-z-index;
        background-color: $cache;

        .remove-resources-modal {
            position: relative;
            background-color: $color3;
            padding: 15px 30px;
            border-radius: 25px;
            color: $color8;
            width: 95%;
            max-width: 550px;
            max-height: 700px;
            overflow-y: auto;

            .close-modal {
                position: absolute;
                cursor: pointer;
                right: 9px;
                top: 9px;
                width: 26px;
                height: 26px;
                padding: 3px;
                background-color: transparent;

                &:hover {
                    border-radius: 13px;
                    background-color: $color11;
                }
            }

            .status {
                font-size: 18px;
                font-weight: 400;

                &-bold {
                    color: $color17;
                    font-weight: 600;
                    letter-spacing: 1px;
                }
            }

            .choice-container {
                .little-precision {
                    font-size: 14px;
                    font-weight: 300;
                    color: $color6;
                    text-align: center;
                    margin: 5px;
                }

                .remove-ressources-list {
                    table {
                        border-collapse: separate;
                        border-spacing: 6px 5px;

                        tbody {
                            tr {
                                margin: 6px 0;
                            }

                            .one-resource {

                                .genshin-image {
                                    vertical-align: middle;
                                    width: 30px;
                                    height: 30px;
                                }

                                .needed-count {
                                    vertical-align: middle;
                                    text-align: right;
                                }

                                .resource-name {
                                    vertical-align: middle;
                                    text-align: left;
                                    font-weight: 400;
                                }
                            }
                        }
                    }
                }

                .remove-resources-choices {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-evenly;

                    button {
                        font-weight: 400;
                        margin: 3px;
                        border: 2px solid $color8;
                        border-radius: 5px;
                        color: $color3;
                        padding: 4px 12px;

                        &:hover {
                            text-decoration: underline 2px;
                            text-underline-offset: 2px;
                            color: $color2;
                        }
                    }

                    .confirm-choice {
                        background-color: $color6;
                    }

                    .cancel-choice {
                        background-color: $color15;
                    }
                }
            }

            .information {
                font-weight: 400;
                font-size: 16px;
                color: $color5;
                margin: 8px 0;
            }
        }
    }

    .section-container {
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
        gap: 20px;

        .table-section {
            display: flex;
            flex-direction: column;
            align-items: center;

            .search-input {
                position: relative;

                .input {
                    margin-bottom: 10px;
                    padding: 6px;
                    width: 100%;
                    max-width: 300px;
                    color: $color3;
                    background-color: $color7;

                    &::placeholder {
                        color: $color3;
                        font-style: oblique;
                        font-size: 14px;
                        font-weight: 300;
                        opacity: 0.7;
                    }
                }

            }

            .table-box {
                overflow-y: auto;
                max-height: 500px;
                height: fit-content;
                border: 2px solid $color10;

                .table {
                    height: fit-content;
                    border-collapse: collapse;

                    thead {
                        color: $color2;
                        position: sticky;
                        top: 0px;
                        z-index: $table-head;

                        tr {
                            background-color: $color7;

                            th {
                                text-align: center;
                                vertical-align: middle;
                                width: fit-content;
                                padding: 6px 4px;
                                font-weight: 400;
                                font-size: 18px;
                            }
                        }
                    }

                    tbody {
                        color: $color8;

                        tr {
                            background-color: $color3;

                            &:nth-child(even) {
                                background-color: $color19;
                            }

                            td {
                                text-align: center;
                                vertical-align: middle;
                                font-weight: 400;
                                font-size: 18px;
                            }
                        }

                        th,
                        td {
                            padding: 3px 4px;
                            font-size: 16px;
                            text-align: center;

                            .name-cell {
                                max-width: 220px;
                                display: flex;
                                flex-direction: row;
                                align-items: center;
                                justify-content: flex-start;
                                gap: 0 5px;
                                font-weight: 400;

                                p {
                                    text-align: left;
                                }
                            }
                        }
                    }
                }
            }
        }

        // Uniqement les couleurs spécifiques à certain cas de personnages
        .characters-table-section {
            .characters-top-table-box {
                width: 100%;
                display: flex;
                align-items: flex-end;
                justify-content: space-around;

                .characters-informations {
                    margin-bottom: 6px;
                    font-weight: 400;
                }
            }

            .table-box {
                .characters-informations {
                    tbody {
                        tr.have {
                            background-color: $characters-have;
                        }

                        tr:nth-child(even).have {
                            background-color: $characters-have-even;
                        }

                        tr.doing {
                            background-color: $characters-doing;
                        }

                        tr:nth-child(even).doing {
                            background-color: $characters-doing-even;
                        }

                        tr.doing-havnt {
                            background-color: $characters-doing-havnt;
                        }

                        tr:nth-child(even).doing-havnt {
                            background-color: $characters-doing-havnt-even;
                        }

                        tr.have-and-done {
                            background-color: $characters-have-and-done;
                        }

                        tr:nth-child(even).have-and-done {
                            background-color: $characters-have-and-done-even;
                        }
                    }
                }
            }
        }

        // Uniquement le style pour la liste d'arme
        .weapons-table-section {
            .search-input {
                .input {
                    z-index: $z-index-two;
                }

                .list {
                    z-index: $weapons-research-list;
                    position: absolute;
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                    gap: 2px;
                    transform: translateY(-10px);
                    width: 100%;
                    border: 2px solid #24252c;

                    .one-result {
                        display: flex;
                        align-items: center;
                        gap: 5px;
                        cursor: pointer;
                        padding: 4px;

                        &:hover {
                            color: $color8;
                            background-color: $color14;
                        }
                    }
                }
            }

            .table-box {
                .weapons-informations {
                    tbody {
                        tr {
                            td {
                                .name-cell {
                                    position: relative;

                                    .deleting-weapon {
                                        cursor: pointer;
                                        width: 26px;
                                        height: 26px;
                                        padding: 3px;

                                        &:hover {
                                            border-radius: 13px;
                                            background-color: $color11;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Uniqement les couleurs spécifiques à certain cas de ressources
        .materials-table-section {
            .table-box {
                .materials-informations {
                    tbody {
                        tr.require {
                            background-color: $material-require;
                        }

                        tr:nth-child(even).require {
                            background-color: $material-require-even;
                        }

                        tr.require-and-done {
                            background-color: $material-require-and-done;
                        }

                        tr:nth-child(even).require-and-done {
                            background-color: $material-require-and-done-even;
                        }

                        tr.done {
                            background-color: $material-only-need-and-done;
                        }

                        tr:nth-child(even).done {
                            background-color: $material-only-need-and-done-even;
                        }

                        tr {
                            td.farm-day {
                                background-color: $color11;
                            }
                        }

                        tr {
                            .synthesis-ok {
                                background-color: $material-synthesis-ok;
                            }
                        }

                        tr:nth-child(even) {
                            .synthesis-ok {
                                background-color: $material-synthesis-ok-even;
                            }
                        }
                    }
                }
            }
        }
    }
}

@media only screen and (min-width: 950px) {
    .project-farming-container {
        .farming-informations-container {
            flex-direction: row;
        }
    }
}
</style>