// Importation de Pinia, le store officiel de Vue.js
import { defineStore } from "pinia";

export const useMainStore = defineStore("Main", {
    state: () => ({
        error: {
            uuidNotFound: false,
            notManyCharactersContact: false,
        },
        userSession: {
            gotSession: false,
            type: null,
            uuid: "",
            step: "start"
        },
        otherData: {
            loading: false,
        } 
    }),
});
