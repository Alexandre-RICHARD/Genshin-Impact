export const cookieHandler = {
    setCookie: (name, value, days = 365) => {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
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

    handleAccountSessionCookie: (
        context,
        callback,
        nickname = "",
        mail = "",
        days = 365
    ) => {
        switch (context) {
        case "collect":
            if (
                cookieHandler.getCookie("accountNickname") &&
                    cookieHandler.getCookie("accountMail")
            ) {
                callback(
                    true,
                    cookieHandler.getCookie("accountNickname"),
                    cookieHandler.getCookie("accountMail")
                );
            }
            break;
        case "write":
            cookieHandler.setCookie("accountNickname", nickname, days);
            cookieHandler.setCookie("accountMail", mail, days);
            break;
        case "erase":
            cookieHandler.setCookie("accountNickname", null, -days);
            cookieHandler.setCookie("accountMail", null, -days);
            break;
        default:
            break;
        }
    },
};
