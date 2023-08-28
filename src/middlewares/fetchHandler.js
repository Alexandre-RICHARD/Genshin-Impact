const API_URL = process.env.API_URL;

export const getNewIdentifier = async () => {
    try {
        const response = await fetch(API_URL + "/genshin/generate-uuid");
        return response.json();
    } catch (error) {
        return error;
    }
};

export const loginWithUuid = async (session, uuid) => {
    if (session === false) {
        return await postTemplate("/genshin/login", { "uuid": uuid });
    } else {
        console.log("Ceci ne devrait pas être possible");
    }
};

export const getOneData = async (uuid, data_type) => {
    return await postTemplate("/genshin/getData", { "uuid": uuid, "data_type": data_type });
};

export const saveOneData = async (uuid, data_type, data_string) => {
    return await postTemplate("/genshin/saveData", { "uuid": uuid, "data_type": data_type, "data_string": data_string });
};

const postTemplate = async (url, body) => {
    try {
        const response = await fetch(API_URL + url, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(body),
        });
        return response;
    } catch (error) {
        return error;
    }
};