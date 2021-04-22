import React, {useContext, useState, useEffect} from 'react'
import Dashboard from "components/Dashboard/Dashboard";
import {themes, muiThemeProvider, ThemeContext} from "components/themes";
import UserContext from "components/contexts/UserContext";
import SettingsContext from "components/contexts/SettingsContext";
import UploadContext from "components/contexts/UploadContext";
import AlertContext from "components/contexts/AlertContext";
import GlobalLoadingContext from "components/contexts/GlobalLoadingContext";
import {makeStyles, ThemeProvider} from "@material-ui/core"
import cn from 'classnames';
import {Redirect, Route, Switch} from "react-router";
import CssBaseline from "@material-ui/core/CssBaseline";
import NavBar from "components/NavBar/NavBar";
import TopBar from "components/TopBar/TopBar";
import UploadForm from "components/UploadForm/UploadForm";
import Explore from "components/Explore/Explore";
import { Api, apiCall } from "api/Api";
import Painting from "components/Painting/Painting";
import Profile from "components/Profile/Profile";
import Alert from "../Alert/Alert";
import Loader from "../Loader/Loader";

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