<script setup>
import GenshinFarming from "@views/Page/GenshinFarming.vue";
import { onBeforeMount, ref } from "vue";
import { getNewIdentifier, loginWithUuid } from "@middlewares/fetchHandler.js";
import { useMainStore } from "@store/Main";
import { useRoute } from "vue-router";
const { error, userSession } = useMainStore();
const route = useRoute();
const URL = process.env.URL;

const inputUuidValue = ref("");

const dataInit = async () => {
    let uuidSuccess = false;
    if (route.query.uuid) {
        const response = await loginWithUuid(false, route.query.uuid);
        if (response.status === 200) {
            userSession.gotSession = true;
            userSession.type = "identified";
            userSession.uuid = route.query.uuid;
            userSession.step = "ready";
            uuidSuccess = true;
        }
    }

    if (!uuidSuccess) {
        const lsSessionInfo = localStorage.getItem("userSessionInfo");
        if (lsSessionInfo) {
            const parse = JSON.parse(lsSessionInfo);
            if (parse.gotSession) {
                userSession.gotSession = parse.gotSession;
                userSession.type = parse.type;
                userSession.uuid = parse.uuid;
                userSession.step = parse.step;
            }
        }
    }
    updateLocalStorage();
};

const updateLocalStorage = () => {
    localStorage.setItem("userSessionInfo", JSON.stringify(userSession));
};

const confirmChoice = async (choice_type) => {
    switch (choice_type) {
    case "guest":
        userSession.gotSession = true;
        userSession.type = "guest";
        changeStep("ready");
        break;
    case "new":
        userSession.gotSession = true;
        userSession.type = "identified";
        userSession.uuid = await getNewIdentifier();
        changeStep("show-uuid");
        break;
    case "login":
        changeStep("enter-uuid");
        break;
    }
    updateLocalStorage();
};

const changeStep = (step) => {
    userSession.step = step;
    updateLocalStorage();
};

const login = async () => {
    const response = await loginWithUuid(userSession.gotSession, inputUuidValue.value);
    if (response.status === 200) {
        error.uuidNotFound.bool = false;
        userSession.gotSession = true;
        userSession.type = "identified";
        userSession.uuid = inputUuidValue.value;
        changeStep("ready");
    } else {
        error.uuidNotFound.bool = true;
    }
};

const copyUuid = (type) => {
    switch (type) {
    case "uuid":
        navigator.clipboard.writeText(userSession.uuid);
        changeStep("ready");
        break;
    case "link-with-uuid":
        navigator.clipboard.writeText(`${URL}?uuid=${userSession.uuid}`);
        break;
    }
};

onBeforeMount(() => {
    dataInit();
});
</script>

<template>
    <button v-if="userSession.uuid.length > 0" @click="copyUuid('link-with-uuid')">Copier le lien vers cette session</button>
    <button v-if="userSession.uuid.length > 0" @click="copyUuid('uuid')">Copier l'Uuid</button>
    <div v-if="userSession.step === 'start'" class="cache">
        <button class="choice" @click="confirmChoice('guest')">
            <p class="first-line">Parcourir en tant qu'</p>
            <p class="second-line">Invité</p>
            <p class="third-line">
                Mes données ne seront sauvegardées que sur mon navigateur. Je ne pourrai y accéder
                ailleurs
            </p>
        </button>
        <button class="choice" @click="confirmChoice('new')">
            <p class="first-line">Nouvelle session et </p>
            <p class="second-line">Obtenir un identifiant</p>
            <p class="third-line">
                J'obtiens un identifiant que je pourrai réutiliser sur tous mes appareils ou navigateur et
                garder mes données
            </p>
        </button>
        <button class="choice" @click="confirmChoice('login')">
            <p class="first-line">J'ai un identifiant et</p>
            <p class="second-line">Je m'identifie</p>
            <p class="third-line">
                J'ai déjà un identifiant venant d'un autre appareil et je souhaite récupérer mes données
                avec.
            </p>
        </button>
    </div>

    <div v-if="userSession.step === 'show-uuid'" class="cache">
        <div class="show-uuid">
            <button class="close-button" @click="changeStep(ready)">X</button>
            <p class="first-line">Mon identifiant unique</p>
            <p class="second-line">{{ userSession.uuid }}</p>
            <button class="copy-uuid-button" @click="copyUuid('uuid')">Copier</button>
        </div>
    </div>

    <div v-if="userSession.step === 'enter-uuid'" class="cache">
        <div class="enter-uuid">
            <button class="close-button" @click="changeStep('ready')">X</button>
            <p class="first-line">Mon identifiant unique</p>
            <p class="third-line">Au format</p>
            <p class="uuid-format">XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX</p>
            <input v-model="inputUuidValue" type="text" class="input-uuid">
            <p v-if="error.uuidNotFound.bool" class="error">{{ error.uuidNotFound.text }}</p>
            <button
                class="send-uuid-button"
                :disabled="inputUuidValue.length === 0"
                @click="login"
            >
                Se connecter
            </button>
        </div>
    </div>

    <GenshinFarming v-if="userSession.step === 'ready'" />
</template>

<style lang="scss">
@import "@styles/variables.scss";

.cache {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: $cache;
    color: $color2;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 30px;

    .choice,
    .show-uuid,
    .enter-uuid {
        width: 240px;
        height: 240px;
        background-color: $color8;
        border-radius: 15px;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border: 2px solid $color9;

        .first-line {
            padding-bottom: 15px;
            font-weight: 400;
            font-size: 18px;
            text-align: center;
        }

        .second-line {
            font-weight: 500;
            font-size: 20px;
            color: $color4;
            text-align: center;
        }

        .third-line {
            text-align: justify;
            color: $color3;
        }
    }

    .choice:hover {
        border-color: $color2;
    }

    .show-uuid,
    .enter-uuid {
        position: relative;

        .close-button {
            position: absolute;
            top: 6px;
            right: 6px;
            font-weight: 500;
            font-size: 19px;
            color: #d6d6d6;
            background-color: $color5;
            padding: 0px 8px;
            border-radius: 20px;
        }

        .error {
            font-size: 12px;
            color: $color7;
        }

        .copy-uuid-button, 
        .send-uuid-button {
            margin-top: 20px;
            padding: 5px 15px;
            font-weight: 400;
            font-size: 18px;
            background-color: $color7;
            border-radius: 12px;
            border: 2px solid transparent;

            &:hover:not(:disabled) {
                border-color: $color2;
            }

            &:disabled {
                background-color: $color9;
            }

            &:hover:disabled {
                cursor: not-allowed;
            }
        }

    }

    .enter-uuid {
        width: 280px;

        .uuid-format {
            font-size: 10px;
            margin: 5px;
        }

        .input-uuid {
            width: 100%;
            background-color: $color3;
            padding: 5px;
            color: $color8;
            font-size: 12px;
            border-radius: 7px;
        }
    }
}</style>