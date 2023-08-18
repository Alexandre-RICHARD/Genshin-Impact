<script setup>
const charactersList = require("@middlewares/genshinCharactersData.json");
const materialsList = require("@middlewares/genshinMaterialData.json");
import InputCreator from "@parts/InputCreator.vue";
import { onBeforeMount, reactive } from "vue";

const boolList = [true, false];
const lvlList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90];
const aptList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const data = reactive({ Character: null });

const dataInit = () => {
    const lsCharacter = localStorage.getItem("genshinCharactersData");
    if (lsCharacter) {
        data.Character = JSON.parse(lsCharacter);
        charactersList.forEach(({ name }) => {
            const currentChar = data.Character.find(fi => name === fi.name);
            if (currentChar) {
                const i = data.Character.findIndex(fi => name === fi.name);
                if (boolList.indexOf(currentChar.got) < 0) data.Character[i].got = false;
                if (boolList.indexOf(currentChar.doing) < 0) data.Character[i].doing = false;
                if (boolList.indexOf(currentChar.only) < 0) data.Character[i].only = false;
                if (lvlList.indexOf(currentChar.cLvl) < 0) data.Character[i].cLvl = 1;
                if (lvlList.indexOf(currentChar.wLvl) < 0) data.Character[i].wLvl = 90;
                if (aptList.indexOf(currentChar.cAp1) < 0) data.Character[i].cAp1 = 1;
                if (aptList.indexOf(currentChar.wAp1) < 0) data.Character[i].wAp1 = 10;
                if (aptList.indexOf(currentChar.cAp2) < 0) data.Character[i].cAp2 = 1;
                if (aptList.indexOf(currentChar.wAp2) < 0) data.Character[i].wAp2 = 10;
                if (aptList.indexOf(currentChar.cAp3) < 0) data.Character[i].cAp3 = 1;
                if (aptList.indexOf(currentChar.wAp3) < 0) data.Character[i].wAp3 = 10;
            } else {
                data.Character.push(filler(name));
            }
        });
    } else {
        data.Character = [];
        charactersList.forEach(({ name }) => {
            data.Character.push(filler(name));
        });
    }
    updateLocalStorage("genshinCharactersData", "Character");
};

const filler = (name) => {
    return {
        name: name,
        got: false,
        doing: false,
        only: false,
        cLvl: 1,
        wLvl: 90,
        cAp1: 1,
        wAp1: 10,
        cAp2: 1,
        wAp2: 10,
        cAp3: 1,
        wAp3: 10,
    };
};

const updateLocalStorage = (type, array) => {
    localStorage.setItem(type, JSON.stringify(data[array]));
};

onBeforeMount(() => {
    dataInit();
});

const cleanLocalStorage = () => {
    localStorage.removeItem("genshinCharactersData");
    dataInit();
};

const handleChange = (index, valuename, value) => {
    data.Character[index][valuename] = value;
    updateLocalStorage("genshinCharactersData", "Character");
};
</script>

<template>
    <button @click="cleanLocalStorage">VIDER LE LOCAL STORAGE</button>
    <div class="explaination">
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
    </div>
    <div class="tabs-contener">
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
                <tr v-for="(character, index) in data.Character" :key="character.name">
                    <td class="name">{{ index + 1 }} - {{ character.name }}</td>
                    <InputCreator
                        v-model:checked="character.got" type="checkbox" :index="index" valuename="got"
                        @update:checked="handleChange"
                    />
                    <InputCreator
                        v-model:checked="character.doing" type="checkbox" :disabled="character.only"
                        :index="index" valuename="doing" @update:checked="handleChange"
                    />
                    <InputCreator
                        v-model:checked="character.only" type="checkbox" :disabled="!character.doing"
                        :index="index" valuename="only" @update:checked="handleChange"
                    />
                    <InputCreator
                        v-model:value="character.cLvl" type="select" :index="index" valuename="cLvl"
                        :list="lvlList.filter((el) => el <= character.wLvl)" @update:value="handleChange"
                    />
                    <InputCreator
                        v-model:value="character.wLvl" type="select" :index="index" valuename="wLvl"
                        :list="lvlList.filter((el) => el >= character.cLvl)" @update:value="handleChange"
                    />
                    <InputCreator
                        v-model:value="character.cAp1" type="select" :index="index" valuename="cAp1"
                        :list="aptList.filter((el) => el <= character.wAp1)" @update:value="handleChange"
                    />
                    <InputCreator
                        v-model:value="character.wAp1" type="select" :index="index" valuename="wAp1"
                        :list="aptList.filter((el) => el >= character.cAp1)" @update:value="handleChange"
                    />
                    <InputCreator
                        v-model:value="character.cAp2" type="select" :index="index" valuename="cAp2"
                        :list="aptList.filter((el) => el <= character.wAp2)" @update:value="handleChange"
                    />
                    <InputCreator
                        v-model:value="character.wAp2" type="select" :index="index" valuename="wAp2"
                        :list="aptList.filter((el) => el >= character.cAp2)" @update:value="handleChange"
                    />
                    <InputCreator
                        v-model:value="character.cAp3" type="select" :index="index" valuename="cAp3"
                        :list="aptList.filter((el) => el <= character.wAp3)" @update:value="handleChange"
                    />
                    <InputCreator
                        v-model:value="character.wAp3" type="select" :index="index" valuename="wAp3"
                        :list="aptList.filter((el) => el >= character.cAp3)" @update:value="handleChange"
                    />
                </tr>
            </tbody>
        </table>
        <table class="all-material-inventory">
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Code</th>
                    <th>Quantité</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="material in materialsList" :key="material.id">
                    <td class="name">{{ material.name }}</td>
                    <td>{{ material.code }}</td>
                    <td>{{ material.quantity }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style lang="scss">
@import "@styles/variables.scss";

.tabs-contener {
    display: flex;
    justify-content: space-evenly;
    padding: 30px;
    align-items: start;
    gap: 15px;

    .all-character-progress,
    .all-material-inventory {
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
}
</style>