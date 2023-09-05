import { visitCounterAdd } from "@middlewares/fetchHandler.js";

export const cookieHandler = {
    setCookie: (name, value, hours = 1) => {
        let expires = "";
        if (hours) {
            const date = new Date();
            date.setTime(date.getTime() + hours * 60 * 60 * 1000);
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    },

    getCookie: (name) => {
        const nameEQ = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(";");
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == " ") c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0)
                return c.substring(nameEQ.length, c.length);
        }
        return null;
    },

    handleVisitCookie: async (hours = 1) => {
        let visits = "";
        if (!cookieHandler.getCookie("visits")) {
            visits = 1;
            cookieHandler.setCookie("visits", visits, hours);
            await visitCounterAdd("genshin");
        } else {
            visits = parseInt(cookieHandler.getCookie("visits")) + 1;
            cookieHandler.setCookie("visits", visits, hours);
        }
    },
};
