<script setup>
const charactersList = require("@middlewares/genshinCharactersData.json");
const materialsList = require("@middlewares/genshinMaterialData.json");
const levelingData = require("@middlewares/genshinLevelingData.json");
import InputCreator from "@parts/InputCreator.vue";
import { computed, onBeforeMount, reactive, ref } from "vue";

const lvlList = levelingData.level.map(el => el.id);
const aptList = levelingData.aptitude.map(el => el.level);
const serverList = ["Sélectionne ton serveur", "American", "Asiatic", "European"];

const data = reactive({ Characters: null, Material: null, Options: {} });

const dataInit = () => {
    // Pour gérer les stats et souhaits de chaque perso
    const lsCharacter = localStorage.getItem("genshinCharactersData");
    if (lsCharacter) {
        data.Characters = JSON.parse(lsCharacter);
        charactersList.forEach(({ name }) => {
            const currentChar = data.Characters.find(fi => name === fi.name);
            if (currentChar) {
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
                data.Characters.push(filler("Characters", name));
            }
        });
    } else {
        data.Characters = [];
        charactersList.forEach(({ name }) => {
            data.Characters.push(filler("Characters", name));
        });
    }
    updateLocalStorage("genshinCharactersData", "Characters");

    // Pour gérer l'inventaire des ressources de farm
    const lsMaterial = localStorage.getItem("genshinMaterialData");
    if (lsMaterial) {
        data.Material = JSON.parse(lsMaterial);
        materialsList.forEach(({ code }) => {
            const currentMat = data.Material.find(fi => code === fi.code);
            if (currentMat) {
                const i = data.Material.findIndex(fi => code === fi.code);
                if (currentMat.have < 0 || !Number.isInteger(currentMat.have)) data.Material[i].have = 0;
            } else {
                data.Material.push(filler("Material", code));
            }
        });
    } else {
        data.Material = [];
        materialsList.forEach(({ code }) => {
            data.Material.push(filler("Material", code));
        });
    }
    updateLocalStorage("genshinMaterialData", "Material");

    // Pour gérer les options
    const lsOptions = localStorage.getItem("genshinOptionsData");
    if (lsOptions) {
        data.Options = JSON.parse(lsOptions);
        if ([false, true].indexOf(data.Options.onlyShowsDoingCharacter) < 0) data.Options.onlyShowsDoingCharacter = false;
        if ([false, true].indexOf(data.Options.onlyShowsNeededMaterials) < 0) data.Options.onlyShowsNeededMaterials = false;
        if ([false, true].indexOf(data.Options.alwaysOneMoreMaterial) < 0) data.Options.alwaysOneMoreMaterial = false;
        if ([false, true].indexOf(data.Options.explaination) < 0) data.Options.explaination = true;
        if (serverList.indexOf(data.Options.server) < 0) data.Options.server = "";
    } else {
        data.Options = {
            onlyShowsDoingCharacter: false,
            onlyShowsNeededMaterials: false,
            alwaysOneMoreMaterial: false,
            explaination: true,
            server: "",
        };
    }
    updateLocalStorage("genshinOptionsData", "Options");
};

const filler = (type, name) => {
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
    case "Material":
        return {
            code: name,
            have: 0,
        };
    }

};

const cleanLocalStorage = () => {
    localStorage.removeItem("genshinCharactersData");
    localStorage.removeItem("genshinMaterialData");
    localStorage.removeItem("genshinOptionsData");
    dataInit();
};

const updateLocalStorage = (type, array) => {
    localStorage.setItem(type, JSON.stringify(data[array]));
};

const handleChange = (group, index, valuename, value) => {
    data[group][index][valuename] = value;
    updateLocalStorage(`genshin${group}Data`, group);
};

const filteredCharacters = computed(() => {
    if (data.Options.onlyShowsDoingCharacter) {
        return [...data.Characters].filter(el => el.doing === true).sort(sortFunction("name"));
    } else {
        return [...data.Characters].sort(sortFunction("name"));
    }
});

const filteredMaterials = computed(() => {
    if (data.Options.onlyShowsNeededMaterials) {
        return farmingMaterial.value.filter(el => el.needed > 0);
    } else {
        return farmingMaterial.value;
    }
});

function sortFunction(...args) {
    return function (a, b) {
        if (a[args[0]] < b[args[0]]) return -1;
        if (a[args[0]] > b[args[0]]) return 1;
        return 0;
    };
}

const farmingMaterial = computed(() => {
    const computedBuildArray = [];
    const processVar = [
        { searchLoc: "level", currentValue: "cLvl", wantedValue: "wLvl" },
        { searchLoc: "aptitude", currentValue: "cAp1", wantedValue: "wAp1" },
        { searchLoc: "aptitude", currentValue: "cAp2", wantedValue: "wAp2" },
        { searchLoc: "aptitude", currentValue: "cAp3", wantedValue: "wAp3" },
    ];

    data.Characters.filter(char => char.doing === true).forEach(char => {
        const currentcharacter = charactersList.find(find => find.name === char.name);
        for (let i = 0; i < 4; i++) {
            const progressStep = levelingData[processVar[i].searchLoc].filter(step => step.id > char[processVar[i].currentValue] && step.id <= char[processVar[i].wantedValue]);
            if (progressStep.length > 0) {
                progressStep.forEach(step => {
                    for (const [key, value] of Object.entries(step)) {
                        if (value > 0 && key != "id" && key != "level") {
                            let materialCode;
                            if (!isNaN(key.charAt(key.length - 1))) {
                                materialCode = currentcharacter[key.slice(0, -2)] + key.slice(-1);
                            } else {
                                materialCode = currentcharacter[key];
                            }
                            const findIndex = computedBuildArray.findIndex(fi => fi.code === materialCode);
                            if (findIndex >= 0) {
                                computedBuildArray[findIndex].needed += value;
                            } else {
                                computedBuildArray.push({
                                    ...materialsList.find(material => material.code === materialCode),
                                    needed: value,
                                });
                            }

                        }
                    }
                });
            }
        }
    });
    const xp_book = computedBuildArray.findIndex(fi => fi.code === "g2");
    if (xp_book >= 0) computedBuildArray[xp_book].needed = Math.ceil(computedBuildArray[xp_book].needed);

    materialsList.forEach(material => {
        const userValue = data.Material.find(fi => fi.code === material.code).have;
        const alreadyIn = computedBuildArray.findIndex(fi => fi.id === material.id);
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
        } else {
            computedBuildArray[alreadyIn] = {
                ...computedBuildArray[alreadyIn],
                have: userValue,
                needed: computedBuildArray[alreadyIn].needed,
                remain: computedBuildArray[alreadyIn].needed - userValue,
                group_have: 0,
                group_needed: 0,
                group_resin: 0,
                synthesis: false,
            };
        }
    });

    computedBuildArray.forEach((el, index) => {
        const category = el.code.slice(0, 1);
        const quality = el.code.slice(-1);

        if ((["m", "l"].indexOf(category) >= 0 && quality === "3") || (["p", "a"].indexOf(category) >= 0 && quality === "4")) {
            let group_have = 0;
            let group_needed = 0;

            computedBuildArray.filter(fi => fi.code.slice(0, 3) === el.code.slice(0, 3)).forEach(ele => {
                const multiplier = Math.pow(3, parseInt(ele.code.slice(-1)) - 1);
                const have = ele.have;
                const needed = ele.needed;
                group_have += multiplier * have;
                group_needed += multiplier * needed;
            });
            computedBuildArray[index] = {
                ...computedBuildArray[index],
                group_have: group_have,
                group_needed: group_needed,
                synthesis: true,
            };
        }

        const coefficientResin = {
            weekly_boss: 2.38 / 3,
            mini_boss: 2.55,
            gem: 0.215325,
            talent_book: 10.18,
            weapon_material: 17.05,
            
        };

        if (category === "b" && computedBuildArray[index].needed - computedBuildArray[index].have > 0) {
            computedBuildArray[index].group_resin = Math.ceil((computedBuildArray[index].needed - computedBuildArray[index].have) / coefficientResin.weekly_boss) * 60;
        }

        if (category === "s" && computedBuildArray[index].needed - computedBuildArray[index].have > 0) {
            computedBuildArray[index].group_resin = Math.ceil((computedBuildArray[index].needed - computedBuildArray[index].have) / coefficientResin.mini_boss) * 40;
        }

        if (category === "p" && quality === "4" && computedBuildArray[index].needed - computedBuildArray[index].have > 0) {
            computedBuildArray[index].group_resin = Math.ceil((computedBuildArray[index].group_needed - computedBuildArray[index].group_have) / coefficientResin.gem / 20);
        }

        if (category === "l" && quality === "3" && computedBuildArray[index].needed - computedBuildArray[index].have > 0) {
            computedBuildArray[index].group_resin = Math.ceil((computedBuildArray[index].group_needed - computedBuildArray[index].group_have) / coefficientResin.talent_book) * 20;
        }

        if (category === "a" && quality === "4" && computedBuildArray[index].needed - computedBuildArray[index].have > 0) {
            computedBuildArray[index].group_resin = Math.ceil((computedBuildArray[index].group_needed - computedBuildArray[index].group_have) / coefficientResin.weapon_material) * 40;
        }
    });

    const sorted = computedBuildArray.sort(sortFunction("id"));
    return sorted;
});

let currentTime = ref();
let coultdownReset = ref();
let serverDay = ref();

const handleTime = {
    timeShift: {
        Asiatic: 8,
        European: 1,
        American: -5,
    },
    oneHour: 60 * 60 * 1000,
    timeZone: null,
    minusTheFourHoursReset: null,

    coultdownBuilder: (date, serverTime) => {
        const tomorrowMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 1);
        const difference = tomorrowMidnight - serverTime;
        return new Date(new Date(difference).getTime() + new Date(difference).getTimezoneOffset() * 60000);
    },

    getBeautifulHours: () => {
        handleTime.timeZone = (handleTime.timeShift[data.Options.server] - new Date().getTimezoneOffset() / -60) * handleTime.oneHour,
        handleTime.minusTheFourHoursReset = handleTime.oneHour * 4;

        const serverTime = Date.now() + handleTime.timeZone - handleTime.minusTheFourHoursReset;
        currentTime.value = handleTime.renderDate(new Date(Date.now()));
        coultdownReset.value = handleTime.renderDate(handleTime.coultdownBuilder(new Date(serverTime + 24 * handleTime.oneHour), new Date(serverTime)));
        serverDay.value = ((new Date(Date.now() + handleTime.timeZone - handleTime.minusTheFourHoursReset).getDay() + 6) % 7) + 1;

        handleTime.timeRefresh();
    },

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

    timeRefresh: () => {
        setTimeout(handleTime.getBeautifulHours, 1000);
    },
};

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
                type="checkbox" name="boolean-doing" @change="updateLocalStorage('genshinOptionsData', 'Options');"
            >
            <label class="boolean-label" for="boolean-doing">Ne montrer que les "doing"</label>
        </div>
        <div class="boolean">
            <input
                id="boolean-needed" v-model="data.Options.onlyShowsNeededMaterials" class="boolean-checkbox"
                type="checkbox" name="boolean-needed" @change="updateLocalStorage('genshinOptionsData', 'Options');"
            >
            <label class="boolean-label" for="boolean-needed">Afficher uniquement les ressources nécessaires</label>
        </div>
        <div class="boolean">
            <input
                id="boolean-one-more" v-model="data.Options.alwaysOneMoreMaterial" class="boolean-checkbox"
                type="checkbox" name="boolean-one-more" @change="updateLocalStorage('genshinOptionsData', 'Options');"
            >
            <label class="boolean-label" for="boolean-one-more">Toujours avoir 1 de plus</label>
        </div>
        <div class="boolean">
            <input
                id="boolean-explaination" v-model="data.Options.explaination" class="boolean-checkbox" type="checkbox"
                name="boolean-explaination" @change="updateLocalStorage('genshinOptionsData', 'Options')"
            >
            <label class="boolean-label" for="boolean-explaination">Montrer les explications</label>
        </div>
        <select
            v-model="data.Options.server" style="appearance: menulist-button"
            @change="updateLocalStorage('genshinOptionsData', 'Options')"
        >
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
        <table class="all-material-inventory">
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
                    <td>{{ material.name }}</td>
                    <InputCreator
                        v-model:value="data.Material.find(el => el.code === material.code).have" type="number"
                        :index="data.Material.findIndex(el => el.code === material.code)" valuename="have" group="Material"
                        @update:value="handleChange"
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
                    <td class="name">{{ character.name }}</td>
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
.all-material-inventory,
.farming-review {
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

        &.name {
            font-weight: 400;
            text-align: left;
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
</style>