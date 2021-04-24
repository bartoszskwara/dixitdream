import React, {useContext, useState, useEffect} from 'react'
import Dashboard from "components/Dashboard/Dashboard";
import {themes, muiThemeProvider, ThemeContext} from "components/themes";
import SettingsContext from "components/contexts/SettingsContext";
import DialogContext from "components/contexts/DialogContext";
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
import UserContextProvider from "./UserContextProvider";
import UploadContextProvider from "./UploadContextProvider";
import Dialog from "../Dialog/Dialog";

const MainWrapper = () => {
    const [theme, setTheme] = useState(themes.light);
    const [muiTheme, setMuiTheme] = useState(muiThemeProvider(theme));
    const [settings, setSettings] = useState(SettingsContext);
    const [globalLoading, setGlobalLoading] = useState(false);
    const [alert, setAlert] = useState({
        visible: false
    });
    const [dialog, setDialog] = useState({
        open: false
    });

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

    const toggleTheme = () => {
        setTheme(theme => {
            const newTheme = theme === themes.dark ? themes.light : themes.dark;
            setMuiTheme(muiThemeProvider(newTheme))
            return newTheme;
        });
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <UserContextProvider>
                <GlobalLoadingContext.Provider value={{ globalLoading, setGlobalLoading }} >
                    <AlertContext.Provider value={{ ...alert, setAlert }} >
                        <DialogContext.Provider value={{ ...dialog, setDialog }} >
                            <SettingsContext.Provider value={settings} >
                                <UploadContextProvider>
                                    <ThemeProvider theme={muiTheme}>
                                        <CssBaseline />
                                        <Main toggleTheme={toggleTheme} />
                                    </ThemeProvider>
                                </UploadContextProvider>
                            </SettingsContext.Provider>
                        </DialogContext.Provider>
                    </AlertContext.Provider>
                </GlobalLoadingContext.Provider>
            </UserContextProvider>
        </ThemeContext.Provider>
    );
}

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
        borderBottom: props => `1px solid ${props.colors.primary700}`
    },
    navbar: {
        background: props => props.colors.primary500,
        borderTop: props => `1px solid ${props.colors.primary700}`
    },
    empty: {
        height: 80
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
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
    }
});

const Main = () => {
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
                    <Route path="/profile/:profileId" exact component={Profile} />
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

export default MainWrapper;