<script setup>
import { onBeforeMount, reactive } from "vue";

const charactersList = [
    "Albedo",
    "Alhaitham",
    "Aloy",
    "Amber",
    "Arataki Itto",
    "Baizhu",
    "Barbara",
    "Beidou",
    "Bennett",
    "Candace",
    "Chongyun",
    "Collei",
    "Cyno",
    "Dehya",
    "Diluc",
    "Diona",
    "Dori",
    "Eula",
    "Faruzan",
    "Fischl",
    "Ganyu",
    "Gorou",
    "Hu Tao",
    "Jean",
    "Kaedehara Kazuha",
    "Kaeya",
    "Kamisato Ayaka",
    "Kamisato Ayato",
    "Kaveh",
    "Keqing",
    "Kirara",
    "Klee",
    "Kujou Sara",
    "Kuki Shinobu",
    "Layla",
    "Lisa",
    "Mika",
    "Mona",
    "Nahida",
    "Nilou",
    "Ningguang",
    "Noelle",
    "Nomade",
    "Qiqi",
    "Raiden Shogun",
    "Razor",
    "Rosaria",
    "Sangonomiya Kokomi",
    "Sayu",
    "Shenhe",
    "Shikanoin Heizou",
    "Sucrose",
    "Tartaglia",
    "Thoma",
    "Tighnari",
    "Venti",
    "Voyageur",
    "Xiangling",
    "Xiao",
    "Xingqiu",
    "Xinyan",
    "Yae Miko",
    "Yanfei",
    "Yaoyao",
    "Yelan",
    "Yoimiya",
    "Yun Jin",
    "Zhongli",
];
const boolList = [true, false];
const lvlList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90];
const aptList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

let charactersData = reactive([]);

const dataInit = () => {
    const data = localStorage.getItem("genshinCharactersData");
    if (data) {
        charactersData = JSON.parse(data);
        charactersList.forEach(el => {
            const currentChar = charactersData.find(fi => el === fi.name);
            if (currentChar) {
                const i = charactersData.findIndex(fi => el === fi.name);
                if (boolList.indexOf(currentChar.got) < 0) charactersData[i].got = false;
                if (boolList.indexOf(currentChar.doing) < 0) charactersData[i].doing = false;
                if (boolList.indexOf(currentChar.only) < 0) charactersData[i].only = false;
                if (lvlList.indexOf(currentChar.cLvl) < 0) charactersData[i].cLvl = 1;
                if (lvlList.indexOf(currentChar.wLvl) < 0) charactersData[i].wLvl = 90;
                if (aptList.indexOf(currentChar.cAp1) < 0) charactersData[i].cAp1 = 1;
                if (aptList.indexOf(currentChar.wAp1) < 0) charactersData[i].wAp1 = 10;
                if (aptList.indexOf(currentChar.cAp2) < 0) charactersData[i].cAp2 = 1;
                if (aptList.indexOf(currentChar.wAp2) < 0) charactersData[i].wAp2 = 10;
                if (aptList.indexOf(currentChar.cAp3) < 0) charactersData[i].cAp3 = 1;
                if (aptList.indexOf(currentChar.wAp3) < 0) charactersData[i].wAp3 = 10;
            } else {
                charactersData.push(filler(el));
            }
        });
    } else {
        charactersData = [];
        charactersList.forEach(el => {
            charactersData.push(filler(el));
        });
    }
    updateLocalStorage();
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

const updateLocalStorage = () => {
    localStorage.setItem("genshinCharactersData", JSON.stringify(charactersData));
};


onBeforeMount(() => {
    dataInit();
});
</script>

<template>
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
            <tr v-for="character in charactersData" :key="character.name">
                <td>{{ character.name }}</td>
                <td>{{ character.got }}</td>
                <td>{{ character.doing }}</td>
                <td>{{ character.only }}</td>
                <td>{{ character.cLvl }}</td>
                <td>{{ character.wLvl }}</td>
                <td>{{ character.cAp1 }}</td>
                <td>{{ character.wAp1 }}</td>
                <td>{{ character.cAp2 }}</td>
                <td>{{ character.wAp2 }}</td>
                <td>{{ character.cAp3 }}</td>
                <td>{{ character.wAp3 }}</td>
            </tr>
        </tbody>
    </table>
</template>

<style lang="scss">
@import "@styles/variables.scss";

.all-character-progress {
    border-collapse: collapse;
    margin: 30px auto 0 auto;

    th,
    td {
        border: 1px solid #cacaca;
        padding: 5px;
    }

    th {
        color: #f5f5f5;
        background-color: #4650ac;
    }

    td {
        color: #000000;
        font-weight: 300;
        text-align: center;
    }

    tr {
        background-color: #bbbbbb;
    }

    tr:nth-child(even) {
        background-color: #a0a0a0;
    }
}
</style>
