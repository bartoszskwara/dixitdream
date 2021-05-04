import React, {useContext, useEffect, useState} from 'react'
import Dashboard from "components/Dashboard/Dashboard";
import {ThemeContext} from "components/themes";
import {AlertContext, DialogContext, GlobalLoadingContext, SettingsContext} from "components/contexts";
import {makeStyles} from "@material-ui/core"
import cn from 'classnames';
import {Redirect, Route, Switch} from "react-router";
import NavBar from "components/NavBar/NavBar";
import TopBar from "components/TopBar/TopBar";
import UploadForm from "components/UploadForm/UploadForm";
import Explore from "components/Explore/Explore";
import {Api, apiCall} from "api/Api";
import Painting from "components/Painting/Painting";
import User from "components/User/User";
import Alert from "../Alert/Alert";
import Loader from "../Loader/Loader";
import UploadContextProvider from "./UploadContextProvider";
import Dialog from "../Dialog/Dialog";

const useStyles = makeStyles({
    mainRoot: {
        minWidth: 300,
        maxWidth: "100%",
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        background: props => props.colors.background100,
        color: props => props.colors.secondary700
    },
    topPanel: {
        background: props => props.colors.primary500,
        borderBottom: props => `1px solid ${props.colors.primary700}`,
        zIndex: 1000
    },
    navbar: {
        background: props => props.colors.primary500,
        borderTop: props => `1px solid ${props.colors.primary700}`,
        zIndex: 1000
    },
    content: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        overflow: "auto",
        overflowWrap: "break-word",
        position: "relative"
    },
    globalLoading: {
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100
    }
});

const AppInnerContent = () => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const alert = useContext(AlertContext);
    const dialog = useContext(DialogContext);
    const { globalLoading } = useContext(GlobalLoadingContext);
    return (
        <div className={classes.mainRoot}>
            <div className={cn(classes.topPanel)}>
                <TopBar/>
            </div>
            <div id="page-content" className={classes.content} >
                {globalLoading && <div className={classes.globalLoading}><Loader /></div>}
                {dialog.open && <Dialog />}
                {alert.visible && <Alert />}
                <Switch>
                    <Route path="/" exact component={Dashboard} />
                    <Route path="/upload" exact component={UploadForm} />
                    <Route path="/explore" exact component={Explore} />
                    <Route path="/painting/:paintingId" exact component={Painting} />
                    <Route path="/user/:userId" exact component={User} />
                    <Redirect from="/home" to="/" />
                    <Redirect to="/" />
                </Switch>
            </div>
            <div className={cn(classes.navbar)}>
                <NavBar />
            </div>
        </div>
    );
}


const AppContent = ({ toggleTheme }) => {
    const [settings, setSettings] = useState(SettingsContext);

    const fetchSettings = async () => {
        setSettings(u => ({...u, loading: true}));
        const settingsData = await apiCall(Api.getSettings);
        if(!settingsData.error) {
            setSettings({...settingsData, loading: false, error: false });
        } else {
            setSettings({ loading: false, error: true });
        }
    }

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={settings} >
            <UploadContextProvider>
                <AppInnerContent toggleTheme={toggleTheme} />
            </UploadContextProvider>
        </SettingsContext.Provider>
    );
}

export default AppContent;