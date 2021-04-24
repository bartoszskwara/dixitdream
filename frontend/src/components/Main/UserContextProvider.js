import React, {useEffect, useState} from 'react'
import { UserContext } from "components/contexts";
import {Api, apiCall} from "api/Api";

const UserContextProvider = ({ children }) => {
    const [userData, setUserData] = useState(UserContext);

    const fetchUserData = async () => {
        setUserData(u => ({...u, loading: true}));
        const userDataResponse = await apiCall(Api.getCurrentProfile);
        if(!userDataResponse.error) {
            setUserData({
                ...userDataResponse,
                loading: false,
                error: false,
                refresh: fetchUserData
            });
        } else {
            setUserData({ loading: false, error: true });
        }
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    return <UserContext.Provider value={userData}>
        {children}
    </UserContext.Provider>;
}

export default UserContextProvider;