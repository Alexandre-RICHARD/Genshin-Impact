// Importation de Pinia, le store officiel de Vue.js
import { defineStore } from "pinia";

export const useMainStore = defineStore("Main", {
    state: () => ({
        error: {
            uuidNotFound: {
                bool: false,
                text: "Aucun identifiant correspondant",
            },
        },
        userSession: {
            gotSession: false,
            type: null,
            uuid: "",
            step: "start"
        }
    }),
});
