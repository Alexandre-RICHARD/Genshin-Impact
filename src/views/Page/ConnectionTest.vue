<script setup>
import { onBeforeMount, ref } from "vue";
import { getNewIdentifier, loginWithUuid } from "@middlewares/fetchHandler.js";
import { useMainStore } from "@store/Main";
const { error, userSession } = useMainStore();

const inputUuidValue = ref("");

const dataInit = () => {
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
};

const updateLocalStorage = () => {
    localStorage.setItem("userSessionInfo", JSON.stringify(userSession));
};

const cleanLocalStorage = () => {
    localStorage.removeItem("userSessionInfo");
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
    const request = await loginWithUuid(userSession.gotSession, inputUuidValue.value);
    if (request.status === 200) {
        error.uuidNotFound.bool = false;
        userSession.gotSession = true;
        userSession.type = "identified";
        userSession.uuid = inputUuidValue.value;
        changeStep("ready");
    } else {
        error.uuidNotFound.bool = true;
    }
};

const copyUuid = () => {
    navigator.clipboard.writeText(userSession.uuid);
    changeStep("ready");
};

onBeforeMount(() => {
    dataInit();
});
</script>

<template>
    <button @click="cleanLocalStorage">VIDER LE LOCAL STORAGE</button>
    <p>{{ userSession.step }}</p>
    <p v-if="userSession.type === 'identified'">{{ userSession.uuid }}</p>
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
            <button class="copy-uuid-button" @click="copyUuid">Copier</button>
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