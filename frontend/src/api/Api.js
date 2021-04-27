import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL
});

export const Api = {
    getCurrentProfile: {
        url: "/profile/current",
        method: "get",
        responseType: "json"
    },
    getProfile: {
        url: "/profile/{id}",
        method: "get",
        responseType: "json"
    },
    getCurrentChallenge: {
        url: "/challenge",
        method: "get",
        responseType: "json"
    },
    getSettings: {
        url: "/settings",
        method: "get",
        responseType: "json"
    },
    uploadPainting: {
        url: "/painting/upload",
        method: "post",
        responseType: "json"
    },
    getPainting: {
        url: "/painting/{paintingId}",
        method: "get",
        responseType: "json"
    },
    getPaintings: {
        url: "/painting",
        method: "post",
        responseType: "json"
    },
    getTags: {
        url: "/tag",
        method: "get",
        responseType: "json"
    },
    deletePainting: {
        url: "/painting/{id}",
        method: "delete"
    },
    updatePainting: {
        url: "/painting/{id}",
        method: "put"
    },
    toggleLikePainting: {
        url: "/painting/{id}/like",
        method: "put"
    },
    markPaintingAsVisited: {
        url: "/painting/{id}/visit",
        method: "put"
    }
};

const formData = (data) => {
    const formData = Object.keys(data).reduce((form, key) => {
        form.append(key, data[key]);
        return form;
    }, new FormData());
    return formData;
}

export const apiCall = async (api, { pathParams, urlParams, postData, isFormData } = {}) => {
    const apiCall = { ...api };
    if(pathParams && Object.keys(pathParams).length) {
        apiCall.url = Object.keys(pathParams).reduce((url, key) => {
            return url.replaceAll(new RegExp(`{${key}}`, "g"), pathParams[key]);
        }, apiCall.url);
    }
    if(urlParams && Object.keys(urlParams).length) {
        apiCall.url = `${apiCall.url}?`;
        apiCall.url = Object.keys(urlParams).reduce((url, key) => {
            return `${url}${key}=${urlParams[key]}&`;
        }, apiCall.url);
        apiCall.url = apiCall.url.replace(/&$/, "");
    }

    const data = isFormData ? formData(postData) : postData;
    try {
        const response = await axiosInstance({
            ...apiCall,
            ...(data ? { data } : {} ),
            headers: {
                'Access-Control-Allow-Origin': "*"
            }
        });
        return response ? response.data : {};
    } catch(error) {
        return error.response && error.response.data ? error.response.data : { error: "Unexpected error." };
    }
};