import axios from "axios";

const apiState = {
    refreshing: false
};

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL
});
axiosInstance.interceptors.request.use(
    (config) => {
        config.headers = {
            ...config.headers,
            ...(localStorage.getItem("accessToken") ? { "Authorization": `Bearer ${localStorage.getItem("accessToken")}` } : {} )
        }
        return config;
    }
);
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        let refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken && error.response.status === 401) {
            if(!apiState.refreshing) {
                apiState.refreshing = true;
                await refreshTokenAndPerformRequest( { refreshToken } );
                return axiosInstance(originalRequest);
            } else {
                return new Promise(resolve => {
                    const interval = setInterval(() => {
                        if(!apiState.refreshing) {
                            resolve(axiosInstance(originalRequest));
                            clearInterval(interval);
                        }
                    }, 100);
                });
            }
        }
        let accessToken = localStorage.getItem("accessToken");
        if(!refreshToken && !accessToken) {
            window.dispatchEvent(new Event("ACCESS_TOKEN_EVENT"));
        }
        return Promise.reject(error);
    }
);

const refreshTokenAndPerformRequest = async ({ refreshToken }) => {
    try {
        const response = await axiosInstance({
            ...Api.refreshToken,
            data: { refreshToken },
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        });
        if (response.status === 200) {
            localStorage.setItem("accessToken", response.data.accessToken);
        }
    } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.dispatchEvent(new Event("ACCESS_TOKEN_EVENT"));
    }
    apiState.refreshing = false;
}

export const Api = {
    authenticate: {
        url: "/auth/login",
        method: "post",
        responseType: "json"
    },
    refreshToken: {
        url: "/auth/refresh",
        method: "post",
        responseType: "json"
    },
    signUp: {
        url: "/user",
        method: "post",
        responseType: "json"
    },
    getCurrentUser: {
        url: "/user/current",
        method: "get",
        responseType: "json"
    },
    getUser: {
        url: "/user/{id}",
        method: "get",
        responseType: "json"
    },
    checkIfUserExists: {
        url: "/user/exists",
        method: "post",
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
    console.log("api call");
    if(pathParams && Object.keys(pathParams).length) {
        apiCall.url = Object.keys(pathParams).reduce((url, key) => {
            return url.replaceAll(new RegExp(`{${key}}`, "g"), pathParams[key]);
        }, apiCall.url);
    }
    if(urlParams && Object.keys(urlParams).length) {
        const urlParameters = Object.keys(urlParams).reduce((params, key) => {
            params.set(key, urlParams[key]);
            return params;
        }, new URLSearchParams());
        apiCall.url = `${apiCall.url}?${urlParameters.toString()}`.replace(/&$/, "");
    }

    const data = isFormData ? formData(postData) : postData;
    try {
        const response = await axiosInstance({
            ...apiCall,
            ...(data ? { data } : {} ),
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        });
        console.log("tu res", response);
        return response ? response.data : {};
    } catch(error) {
        return error.response && error.response.data ? {
            ...error.response.data,
            status: error.response.status
        } : {
            status: error.response.status,
            error: "Unexpected error."
        };
    }
};