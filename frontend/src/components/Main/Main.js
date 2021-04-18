import React, {useContext, useState, useEffect} from 'react'
import Dashboard from "components/Dashboard/Dashboard";
import {themes, muiThemeProvider, ThemeContext} from "components/themes";
import UserContext from "components/contexts/UserContext";
import SettingsContext from "components/contexts/SettingsContext";
import UploadContext from "components/contexts/UploadContext";
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

const MainWrapper = () => {
    const [theme, setTheme] = useState(themes.light);
    const [muiTheme, setMuiTheme] = useState(muiThemeProvider(theme));
    const [userData, setUserData] = useState(UserContext);
    const [settings, setSettings] = useState(SettingsContext);
    const [currentUploadFile, setCurrentUploadFile] = useState(null);
    const [currentUploadChallengeData, setCurrentUploadChallengeData] = useState({});
    const [currentUploadFirstAttempt, setCurrentUploadFirstAttempt] = useState(true);
    const [currentUploadFileBase64, setCurrentUploadFileBase64] = useState(null);

    const fetchUserData = async () => {
        setUserData(u => ({...u, loading: true}));
        const userDataResponse = await apiCall(Api.getCurrentProfile);
        setUserData(userDataResponse);
        setUserData(u => ({...u, loading: false, error: false}));
    }

    const fetchSettings = async () => {
        setSettings(u => ({...u, loading: true}));
        const settingsData = await apiCall(Api.getSettings);
        setSettings(settingsData);
        setSettings(u => ({...u, loading: false, error: false}));
    }

    useEffect(() => {
        fetchUserData().catch(err => setUserData(u => ({...u, loading: false, error: true})));
        fetchSettings().catch(err => setSettings(u => ({...u, loading: false, error: true})));
    }, []);

    const toggleTheme = () => {
        setTheme(theme => {
            const newTheme = theme === themes.dark ? themes.light : themes.dark;
            setMuiTheme(muiThemeProvider(newTheme))
            return newTheme;
        });
    }

    return (
        <ThemeContext.Provider value={{
            theme,
            toggleTheme
        }}>
            <UserContext.Provider value={{
                ...userData,
                refresh: fetchUserData
            }}>
                <SettingsContext.Provider value={settings} >
                    <UploadContext.Provider
                        value={{
                            file: currentUploadFile,
                            setFile: setCurrentUploadFile,
                            challengeData: currentUploadChallengeData,
                            setChallengeData: setCurrentUploadChallengeData,
                            firstAttempt: currentUploadFirstAttempt,
                            setFirstAttempt: setCurrentUploadFirstAttempt,
                            fileBase64: currentUploadFileBase64,
                            setFileBase64: setCurrentUploadFileBase64
                        }}
                    >
                        <ThemeProvider theme={muiTheme}>
                            <CssBaseline />
                            <Main toggleTheme={toggleTheme} />
                        </ThemeProvider>
                    </UploadContext.Provider>
                </SettingsContext.Provider>
            </UserContext.Provider>
        </ThemeContext.Provider>
    );
}

const useStyles = makeStyles({
    mainRoot: {
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
        overflowWrap: "break-word"
    }
});

const Main = () => {
    const classes = useStyles(useContext(ThemeContext).theme);
    return (
        <div className={classes.mainRoot}>
            <div className={cn(classes.topPanel)}>
                <TopBar/>
            </div>
            <div id="page-content" className={classes.content} >
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