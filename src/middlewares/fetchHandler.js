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
        return await requestTemplate("/genshin/login", "POST", { "uuid": uuid });
    }
};

export const getOneData = async (uuid, data_type) => {
    return await requestTemplate("/genshin/getData", "POST", { "uuid": uuid, "data_type": data_type });
};

export const saveOneData = async (uuid, data_type, data_string) => {
    return await requestTemplate("/genshin/saveData", "POST", { "uuid": uuid, "data_type": data_type, "data_string": data_string });
};

export const deleteOneData = async (uuid, data_type) => {
    return await requestTemplate("/genshin/delete", "DELETE", { "uuid": uuid, "data_type": data_type });
};

const requestTemplate = async (url, method, body) => {
    try {
        const response = await fetch(API_URL + url, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: method,
            body: JSON.stringify(body),
        });
        return response;
    } catch (error) {
        return error;
    }
};