import React, {useEffect, useState} from 'react'
import {UserContext} from "components/contexts";
import {Api, apiCall} from "api/Api";

const UserContextProvider = ({ children }) => {
    const [userDataContext, setUserDataContext] = useState({});

    const fetchUserData = async () => {
        setUserDataContext(u => ({...u, loading: true}));
        const userDataResponse = await apiCall(Api.getCurrentUser);
        if(!userDataResponse.error) {
            setUserDataContext(u => ({
                ...u,
                ...userDataResponse,
                loading: false,
                error: false,
                refresh: fetchUserData
            }));
        } else {
            setUserDataContext(u => ({
                ...u,
                loading: false,
                error: true
            }));
        }
    }

    const authenticate = async ({ email, password }) => {
        setUserDataContext(u => ({
            ...u,
            authLoading: true,
            authError: undefined
        }));
        const authResponse = await apiCall(Api.authenticate, { postData: { email, password }});
        if(!authResponse.error) {
            localStorage.setItem("accessToken", authResponse.accessToken);
            localStorage.setItem("refreshToken", authResponse.refreshToken);
            setUserDataContext(u => ({
                ...u,
                id: authResponse.userId,
                authLoading: false,
                authenticated: true
            }));
        } else {
            setUserDataContext(u => ({
                ...u,
                authLoading: false,
                authError: authResponse.error,
                authenticated: false
            }));
        }
    }

    useEffect(() => {
        const isAuthenticated = () => {
            console.log(">>>>>>>tututuut", localStorage.getItem("accessToken"));
            setUserDataContext(u => ({
                ...u,
                authenticated: !!localStorage.getItem("accessToken")
            }));
        }
        console.log("tut add listener");
        window.addEventListener("ACCESS_TOKEN_EVENT", isAuthenticated);
        return () => {
            console.log("tut remove listener");
            window.removeEventListener("ACCESS_TOKEN_EVENT", isAuthenticated);
        }
    }, [])

    useEffect(() => {
        if (userDataContext.authenticated) {
            fetchUserData();
        }
    }, [userDataContext.authenticated]);

    console.log(userDataContext);

    return <UserContext.Provider value={{
        ...userDataContext,
        authenticate
    }}>
        {children}
    </UserContext.Provider>;
}

export default UserContextProvider;