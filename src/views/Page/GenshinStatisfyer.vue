<script setup>
import { ref, computed, watch } from "vue";
const charactersData = ref(require("@middlewares/genshinCharactersData.json"));
const weaponsData = ref(require("@middlewares/genshinWeaponsData.json"));

const data = ref({
    // La liste de nos filtres qui seront utilisés pour les personnages et les armes
    filter: {
        characterElements: ["anemo", "geo", "electro", "dendro", "hydro", "pyro", "cryo",],
        characterWeapons: ["sword", "claymore", "bow", "spear", "catalyst"],
        characterRarities: [4, 5],
        weaponRarities: [1, 2, 3, 4, 5],
        weaponStats: ["atk_purcent", "crt_dmg", "crt_rate", "def_purcent", "elemental_mastery", "energy_recharge", "hp_purcent", "physical_bonus", "none",],
    },
    // Liste de noms des 5 artefacts
    artifactName: ["flower", "plume", "sands", "gobelet", "circlet"],
    // La liste des stats principales possibles pour chaque artefact
    mainStatPossible: [
        ["hp_flat"],
        ["atk_flat"],
        [
            "hp_purcent",
            "atk_purcent",
            "def_purcent",
            "elemental_mastery",
            "energy_recharge",
        ],
        [
            "hp_purcent",
            "atk_purcent",
            "def_purcent",
            "elemental_mastery",
            "pyro_bonus",
            "hydro_bonus",
            "dendro_bonus",
            "electro_bonus",
            "anemo_bonus",
            "cryo_bonus",
            "geo_bonus",
            "physical_bonus",
        ],
        [
            "hp_purcent",
            "atk_purcent",
            "def_purcent",
            "crt_dmg",
            "crt_rate",
            "elemental_mastery",
            "heal",
        ],
    ],
    // Association des statistiques principales des artefacts avec leurs valeur niveau 20
    mainStatValue: [
        {
            name: "hp_purcent",
            value: 46.6,
        },
        {
            name: "hp_flat",
            value: 4780,
        },
        {
            name: "atk_purcent",
            value: 46.6,
        },
        {
            name: "atk_flat",
            value: 311,
        },
        {
            name: "def_purcent",
            value: 58.3,
        },
        {
            name: "elemental_mastery",
            value: 187,
        },
        {
            name: "energy_recharge",
            value: 51.8,
        },
        {
            name: "crt_dmg",
            value: 62.2,
        },
        {
            name: "crt_rate",
            value: 31.1,
        },
        {
            name: "heal",
            value: 35.9,
        },
        {
            name: "pyro_bonus",
            value: 46.6,
        },
        {
            name: "hydro_bonus",
            value: 46.6,
        },
        {
            name: "dendro_bonus",
            value: 46.6,
        },
        {
            name: "electro_bonus",
            value: 46.6,
        },
        {
            name: "anemo_bonus",
            value: 46.6,
        },
        {
            name: "cryo_bonus",
            value: 46.6,
        },
        {
            name: "geo_bonus",
            value: 46.6,
        },
        {
            name: "physical_bonus",
            value: 58.3,
        },
    ],
    // La liste des sous-statistiques possibles des artefacts
    subStatList: [
        "hp_purcent",
        "hp_flat",
        "atk_purcent",
        "atk_flat",
        "def_purcent",
        "def_flat",
        "elemental_mastery",
        "energy_recharge",
        "crt_dmg",
        "crt_rate",
    ],
    // Association des statistiques secondaires des artefacts avec leurs valeurs maximum de l'aléatoire (parmi 4 valeurs)
    subStatValue: [
        {
            name: "hp_purcent",
            value: 5.83,
        },
        {
            name: "hp_flat",
            value: 298.75,
        },
        {
            name: "atk_purcent",
            value: 5.83,
        },
        {
            name: "atk_flat",
            value: 19.45,
        },
        {
            name: "def_purcent",
            value: 7.29,
        },
        {
            name: "def_flat",
            value: 23.15,
        },
        {
            name: "elemental_mastery",
            value: 23.31,
        },
        {
            name: "energy_recharge",
            value: 6.48,
        },
        {
            name: "crt_dmg",
            value: 7.77,
        },
        {
            name: "crt_rate",
            value: 3.89,
        },
    ],
    // Stockage du tableau des statistiques finales de notre perso qui est copié pour redevenir vierge avant chaque re-calcul
    baseStat: {
        hp_purcent: [0],
        hp_flat: [0],
        atk_purcent: [0],
        atk_flat: [0],
        def_purcent: [0],
        def_flat: [0],
        elemental_mastery: [0],
        energy_recharge: [100],
        crt_dmg: [50],
        crt_rate: [5],
        heal: [0],
        pyro_bonus: [0],
        hydro_bonus: [0],
        dendro_bonus: [0],
        electro_bonus: [0],
        anemo_bonus: [0],
        cryo_bonus: [0],
        geo_bonus: [0],
        physical_bonus: [0],
    },
    baseChosenStat: [
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [9, 9, 9, 9, 9]
    ],
});

const userData = ref({
    // Les filtres qui ont été Sélectionnés pour les personnages
    characterS: {
        name: "",
        rarity: 0,
        element: "",
        weapon: "",
    },
    // Les filtres qui ont été Sélectionnés pour les armes
    weaponS: {
        name: "",
        rarity: 0,
        stat: "",
    },
    // Le personnage choisi
    character: "",
    // L'arme choisie
    weapon: "",
});

// Fonction pour appliquer la sélection d'un élément, soit une arme ou un personnage
const selectElement = (type, data) => {
    if (userData.value[type].name != data.name) {
        userData.value[type] = data;
        // Si on choisi un peros, alors on applique un scroll automatique personnalisé...
        // ...si on a choisi les deux, on va aux artefacts
        if (!!userData.value.character && !!userData.value.weapon) {
            document.getElementById("statisfyer-container").scrollIntoView({ behavior: "smooth" });
        }
        // ...si on a pas choisi de personnage, on y va
        if (!userData.value.character && !!userData.value.weapon) {
            document.getElementById("select-characters").scrollIntoView({ behavior: "smooth" });
        }
        // ...si on a pas choisi d'arme, on y va
        if (!!userData.value.character && !userData.value.weapon) {
            document.getElementById("select-weapons").scrollIntoView({ behavior: "smooth" });
        }
    } else {
        userData.value[type] = "";
    }
};

// On vient retirer les différents filtres appliquer aux armes et aux personnages
const removeFilters = (where) => {
    if (where === "character") {
        userData.value.characterS = {
            name: "",
            rarity: 0,
            element: "",
            weapon: "",
        };
        if (where === "weapon") {
            userData.value.weaponS = {
                name: "",
                rarity: 0,
                stat: "",
            };
        }
    }
};

// On applique les filtres choisis pour les personnages :
const filteredCharacters = computed(() => {
    const filter = charactersData.value.filter((character) => {
        // Si on a choisi une arme, alors on ne montre que les personnages avec un type d'arme correspondant
        const weaponTypeFilter = !userData.value.weapon || character.weapon === userData.value.weapon.type;
        // On applique le texte entré comme recherche de nom
        const characterNameFilter = !userData.value.characterS.name || character.name.toLowerCase().includes(userData.value.characterS.name.toLowerCase());
        // On tri par qualité, par élément ou par type d'arme
        const characterRarityFilter = !userData.value.characterS.rarity || character.rarity === userData.value.characterS.rarity;
        const characterElementFilter = !userData.value.characterS.element || character.element === userData.value.characterS.element;
        const characterweaponS = !userData.value.characterS.weapon || character.weapon === userData.value.characterS.weapon;

        return (
            weaponTypeFilter &&
            characterNameFilter &&
            characterRarityFilter &&
            characterElementFilter &&
            characterweaponS
        );
    });
    return filter;
});

// Application des choix de filtres pour les personnages
const applyCharactersFilter = (type, filter) => {
    switch (type) {
    case "rarity":
        userData.value.characterS.rarity =
            userData.value.characterS.rarity === filter ? 0 : filter;
        break;
    case "element":
        userData.value.characterS.element =
            userData.value.characterS.element === filter ? "" : filter;
        break;
    case "weapon":
        userData.value.characterS.weapon =
            userData.value.characterS.weapon === filter ? "" : filter;
        break;
    }
};


const filteredWeapons = computed(() => {
    const filter = weaponsData.value.filter((weapon) => {
        // Si on a choisi un personnage, alors on ne montre que les armes avec le type correspondant
        const weaponTypeFilter = !userData.value.character || weapon.type === userData.value.character.weapon;
        // On applique le texte entré comme recherche de nom
        const weaponNameFilter = !userData.value.weaponS.name || weapon.name.toLowerCase().includes(userData.value.weaponS.name.toLowerCase());
        // On tri par qualité ou par sous stat
        const weaponRarityFilter = !userData.value.weaponS.rarity || weapon.rarity === userData.value.weaponS.rarity;
        const weaponStatFilter = !userData.value.weaponS.stat || weapon.stat_type === userData.value.weaponS.stat;

        return (
            weaponTypeFilter &&
            weaponNameFilter &&
            weaponRarityFilter &&
            weaponStatFilter
        );
    });
    return filter;
});

// Application des choix de filtres pour les armes
const applyWeaponsFilter = (type, filter) => {
    switch (type) {
    case "rarity":
        userData.value.weaponS.rarity =
            userData.value.weaponS.rarity === filter ? 0 : filter;
        break;
    case "stat_type":
        userData.value.weaponS.stat =
            userData.value.weaponS.stat === filter ? "" : filter;
        break;
    }
};

// Deux watchers qui viennent compléter la fonction applyStat afin de venir calculer les statistiques chaque fois qu'un élément change
watch(() => userData.value.character, () => applyStat());
watch(() => userData.value.weapon, () => applyStat());

// Un tableau qui sera notre recueil de modificateur pour chacune des stats finales
const statM = ref({});

// Une fonction pour faire la relation entre les stats définies par l'arme, le personnage et les artefact configurée, et les stats finales
const globalStat = computed(() => {
    // L'objet vide qui sera complété au fil des stats
    const characterStat = {};
    // Chaque stat finale qui sera compilé dans CharacterStat
    const toDoStat = ["hp", "atk", "def", "elemental_mastery", "energy_recharge", "crt_dmg", "crt_rate", "heal", "pyro_bonus", "hydro_bonus", "dendro_bonus", "electro_bonus", "anemo_bonus", "cryo_bonus", "geo_bonus", "physical_bonus"];
    // Les 3 premières stats ont une particularité d'avoir un calcul combinant deux sous-stat, les autres ont toutes le même fonctionnement
    for (let i = 0; i < 16; i++) {
        if (i <= 2) {
            characterStat[toDoStat[i]] =
                Math.round(
                    (userData.value.character[`base_${toDoStat[i]}`] + ((i === 1 && userData.value.weapon.atk) ? userData.value.weapon.atk : 0))
                        *
                        ((100 + statM.value[`${toDoStat[i]}_purcent`].reduce((a, c) => a + c)) / 100)
                        +
                        statM.value[`${toDoStat[i]}_flat`].reduce((a, c) => a + c)
                );
        } else if (i >= 3) {
            characterStat[toDoStat[i]] = statM.value[`${toDoStat[i]}`].reduce((a, c) => a + c);
        }
    }
    return characterStat;
});

// Tableau de donnée représentant les statistiques des artefacts.  2x5 lignes pour les 5 artefact. 2*5 valeurs dans chaque pour les 5 stats et leur valeur (nombre de fois que la stat a été augmenté). La dernière ligne récapitule le nombre d'augmentation de stat qui peuvent être faite
const chosenStat = ref([
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [9, 9, 9, 9, 9]
]);

// Objet computed qui va régulièrement calculé quelles sont les sous-stats restantes disponibles pour les 5 artefacts
const disponibility = computed(() => {
    const statDisponibility = [[], [], [], [], []];
    for (let i = 0; i < 5; i++) {
        // On fait une boucle sur le tableau stockant les sous-stat, on regarde si elle est déjà sur un artefact, si non, alors on la rend disponible
        data.value.subStatList.forEach((element) => {
            if (chosenStat.value[i].indexOf(element) === -1) {
                statDisponibility[i].push(element);
            }
        });
    }
    return statDisponibility;
});

// Variable décrivant quel micro-modal est affiché, celle contenant les stats d'artefact
const displayStatList = ref(null);
//  La fonction qui gère cette variable
const handleDisplayingStatList = (id) => {
    displayStatList.value = displayStatList.value === id ? null : id;
};

const handleChangeArtifactStat = (mode, whichOne, firstPosition, secondPosition) => {
    if (secondPosition === 0 && chosenStat.value[firstPosition].indexOf(whichOne)) {
        handleChangeArtifactStat("delete", "", firstPosition, chosenStat.value[firstPosition].indexOf(whichOne));
    }
    displayStatList.value = null;
    switch (mode) {
    case "insert":
        chosenStat.value[firstPosition][secondPosition] = whichOne;
        chosenStat.value[firstPosition + 5][secondPosition] = 1;
        break;
    case "delete":
        chosenStat.value[firstPosition][secondPosition] = "";
        chosenStat.value[firstPosition + 5][secondPosition] = 0;
        break;
    case "rise":
        if (chosenStat.value[firstPosition + 5][secondPosition] <= 5 && chosenStat.value[10][firstPosition] >= 1) {
            chosenStat.value[firstPosition + 5][secondPosition] += 1;
        }
        break;
    case "down":
        if (chosenStat.value[firstPosition + 5][secondPosition] === 1) {
            handleChangeArtifactStat("delete", "", firstPosition, secondPosition);
        }
        if (chosenStat.value[firstPosition + 5][secondPosition] >= 2) {
            chosenStat.value[firstPosition + 5][secondPosition] -= 1;
        }
        break;
    }

    for (let i = 5; i < 10; i++) {
        chosenStat.value[10][i - 5] = 9 - (chosenStat.value[i][1] + chosenStat.value[i][2] + chosenStat.value[i][3] + chosenStat.value[i][4]);
    }
    applyStat();
};

const convertor = (category, stat, multiplier) => {
    const find = data.value[`${category}StatValue`].find(element => {
        return stat === element.name;
    });
    return ({ name: stat, value: Math.round(find.value * multiplier * 100) / 100 });
};

const applyStat = () => {
    statM.value = JSON.parse(JSON.stringify(data.value.baseStat));
    if (userData.value.character) {
        statM.value[userData.value.character.stat_type].push(userData.value.character.stat_value);
    }
    if (userData.value.weapon) {
        statM.value[userData.value.weapon.stat_type].push(userData.value.weapon.stat_value);
    }

    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            if (chosenStat.value[x][y]) {
                const stat = convertor(y != 0 ? "sub" : "main", chosenStat.value[x][y], chosenStat.value[x + 5][y]);
                statM.value[stat.name].push(stat.value);
            }
        }
    }
};

const cleanArtifactsStats = () => {
    chosenStat.value = JSON.parse(JSON.stringify(data.value.baseChosenStat));
    statM.value = JSON.parse(JSON.stringify(data.value.baseStat));
};
</script>

<template>
    <div class="genshin">
        <div id="select-characters" class="select-characters">
            <div class="characters-filters">
                <label class="characters-filter-name" for="characters-filter-name">Recherche par nom :
                    <input id="characters-filter-name" v-model="userData.characterS.name" type="text">
                </label>

                <button
                    v-for="rarity in data.filter.characterRarities" :key="rarity" class="characters-filter-rarity"
                    @click="applyCharactersFilter('rarity', rarity)"
                >
                    {{ rarity }}
                </button>

                <button
                    v-for="element in data.filter.characterElements" :key="element" class="characters-filter-rarity"
                    @click="applyCharactersFilter('element', element)"
                >
                    {{ element }}
                </button>

                <button
                    v-for="weapon in data.filter.characterWeapons" :key="weapon" class="characters-filter-rarity"
                    @click="applyCharactersFilter('weapon', weapon)"
                >
                    {{ weapon }}
                </button>
                <button class="characters-remove-filter" @click="removeFilters('character')">
                    Retirer les filtres
                </button>
            </div>
            <div class="characters-container">
                <button
                    v-for="character in filteredCharacters" :key="character.name" class="character" :class="{
                        'character-selected':
                            userData.character.name === character.name,
                    }"
                    @click="selectElement('character', character)"
                >
                    <p>{{ character.name }}</p>
                    <p>{{ character.rarity }}</p>
                    <p>{{ character.element }}</p>
                    <p>{{ character.weapon }}</p>
                </button>
            </div>
        </div>
        <div id="select-weapons" class="select-weapons">
            <div class="weapons-filters">
                <label class="weapons-filter-name" for="weapons-filter-name">Recherche par nom :
                    <input id="weapons-filter-name" v-model="userData.weaponS.name" type="text">
                </label>
                <button
                    v-for="rarity in data.filter.weaponRarities" :key="rarity" class="characters-filter-rarity"
                    @click="applyWeaponsFilter('rarity', rarity)"
                >
                    {{ rarity }}
                </button>
                <button
                    v-for="stat_type in data.filter.weaponStats" :key="stat_type" class="characters-filter-rarity"
                    @click="applyWeaponsFilter('stat_type', stat_type)"
                >
                    {{ stat_type }}
                </button>
                <button class="weapons-remove-filter" @click="removeFilters('weapon')">
                    Retirer les filtres
                </button>
            </div>
            <div class="weapons-container">
                <button
                    v-for="weapon in filteredWeapons" :key="weapon.name" class="weapon" :class="{
                        'weapon-selected':
                            userData.weapon.name === weapon.name,
                    }"
                    @click="selectElement('weapon', weapon)"
                >
                    <p>{{ weapon.name }}</p>
                    <p>{{ weapon.rarity }}</p>
                    <p>{{ weapon.atk }}</p>
                    <p>{{ weapon.stat_type }}</p>
                    <p>{{ weapon.stat_value }}</p>
                </button>
            </div>
        </div>
        <div id="statisfyer-container" class="statisfyer-container">
            <div v-if="!!userData.character">
                <p>{{ userData.character.name }}</p>
                <p>{{ userData.weapon.name }}</p>
                <div v-for="(value, key) in globalStat" :key="key">
                    <p v-if="value != 0">{{ key }} - {{ value }}</p>
                </div>
                <div class="artifacts-container">
                    <div v-for="x in 5" :key="x" class="artifact">
                        <p class="artifact-name">{{ data.artifactName[x - 1] }} - ({{ chosenStat[10][x - 1] }} pts)</p>
                        <div v-for="y in 5" :key="y" class="stat" :class="[y === 1 ? 'main-stat' : null]">
                            <button
                                v-if="chosenStat[x - 1][y - 1] !== ''" class="delete-stat-button" @click="
                                    handleChangeArtifactStat('delete', '', x - 1, y - 1)
                                "
                            >
                                X
                            </button>
                            <button class="stat-button" @click="handleDisplayingStatList((x - 1) * 5 + y)">
                                {{
                                    chosenStat[x - 1][y - 1] !== ""
                                        ? chosenStat[x - 1][y - 1]
                                        : "CHOISIR"
                                }}
                            </button>
                            <p v-if="chosenStat[x - 1][y - 1] !== ''">
                                {{ convertor(y != 1 ? "sub" : "main", chosenStat[x -
                                    1][y - 1], chosenStat[x + 4][y - 1]).value }}
                            </p>
                            <div v-if="chosenStat[x - 1][y - 1] !== '' && y != 1" class="value-changer">
                                <button
                                    class="value-changer-button"
                                    @click="handleChangeArtifactStat('down', '', x - 1, y - 1)"
                                >
                                    {{ '<' }}
                                </button>
                                <span>{{ chosenStat[x + 4][y - 1] }}</span>
                                <button
                                    class="value-changer-button"
                                    @click="handleChangeArtifactStat('rise', '', x - 1, y - 1)"
                                >
                                    {{ '>' }}
                                </button>
                            </div>
                            <ol v-if="y === 1" v-show="displayStatList === (x - 1) * 5 + y" class="stat-list">
                                <button
                                    v-for="dispoStat in data.mainStatPossible[x - 1]" :key="dispoStat" @click="
                                        handleChangeArtifactStat('insert', dispoStat, x - 1, y - 1)
                                    "
                                >
                                    {{ dispoStat }}
                                </button>
                            </ol>
                            <ol v-if="y > 1" v-show="displayStatList === (x - 1) * 5 + y" class="stat-list">
                                <button
                                    v-for="dispoStat in disponibility[x - 1]" :key="dispoStat" @click="
                                        handleChangeArtifactStat('insert', dispoStat, x - 1, y - 1)
                                    "
                                >
                                    {{ dispoStat }}
                                </button>
                            </ol>
                        </div>
                    </div>
                    <button class="clean-artifact" @click="cleanArtifactsStats">Nettoyer les artefacts</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import "@styles/variables.scss";

$background-color: #25294a;
$foreground-color: #f3f3f3;

.genshin {
    max-width: 1500px;
    margin: 20px auto 0 auto;
    padding: 10px;
    color: $foreground-color;
    background-color: $background-color;

    .characters-filters,
    .weapons-filters {
        display: flex;
        flex-wrap: wrap;
        justify-content: start;
        gap: 25px;
    }

    .characters-container,
    .weapons-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        gap: 20px;
        margin: 20px 0;

        .character,
        .weapon {
            display: flex;
            flex-direction: column;
            padding: 6px;
            border: 2px solid $foreground-color;
            border-radius: 12px;
            width: 110px;
            height: fit-content;
            overflow: hidden;

            &-selected {
                border: 2px solid #d6be52;
                background-color: #ffffff56;
            }
        }
    }

    .statisfyer-container {
        min-height: 100px;

        .artifacts-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
            gap: 30px;
            margin: 20px;

            .artifact {
                color: black;
                background-color: #b9b18e;
                padding: 10px;
                border-radius: 15px;

                .artifact-name {
                    text-align: center;
                    font-weight: 700;
                    font-size: 18px;
                    text-transform: uppercase;
                }

                .stat {
                    position: relative;
                    margin: 8px auto;
                    display: flex;

                    &.main-stat {
                        .stat-button {
                            font-weight: 400;
                            font-size: 18px;
                            text-decoration: underline;
                        }
                    }

                    .value-changer {
                        margin: 4px 8px;

                        &-button {
                            font-weight: 500;
                            font-size: 18px;
                            margin: 3px;
                        }
                    }

                    .delete-stat-button {
                        font-weight: 500;
                        font-size: 18px;
                        margin: 5px;
                    }

                    .stat-list {
                        display: flex;
                        flex-direction: column;
                        position: absolute;
                        background-color: #d6be52;
                        color: black;
                        padding: 20px;
                        border-radius: 4px;
                        z-index: $z-index-one;
                    }
                }
            }
        }

        .clean-artifact {
            background: #151d3f;
            padding: 10px;
            border-radius: 18px;
            margin: 15px auto;
            font-weight: 500;
            font-size: 20px;
        }
    }
}
</style>
