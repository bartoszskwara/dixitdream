import React, {useContext, useState} from 'react'
import {muiThemeProvider, ThemeContext, themes} from "components/themes";
import {AlertContext, DialogContext, GlobalLoadingContext, UserContext, NotificationsContext} from "components/contexts";
import {ThemeProvider} from "@material-ui/core"
import CssBaseline from "@material-ui/core/CssBaseline";
import UserContextProvider from "./UserContextProvider";
import AppContent from "./AppContent";
import GuestContent from "./GuestContent";

const MainContent = ({ }) => {
    const { id, authenticated } = useContext(UserContext);
    const { toggleTheme } = useContext(ThemeContext);

    return <>
        {!authenticated && <GuestContent />}
        {authenticated && <AppContent toggleTheme={toggleTheme}/>}
    </>
}

const MainWrapper = () => {
    const [theme, setTheme] = useState(themes.light);
    const [muiTheme, setMuiTheme] = useState(muiThemeProvider(theme));
    const [globalLoading, setGlobalLoading] = useState(false);
    const [alert, setAlert] = useState({
        visible: false
    });
    const [dialog, setDialog] = useState({
        open: false
    });
    const [notificationsContext, setNotificationsContext] = useState({
        visible: false
    });

    const toggleTheme = () => {
        setTheme(theme => {
            const newTheme = theme === themes.dark ? themes.light : themes.dark;
            setMuiTheme(muiThemeProvider(newTheme))
            return newTheme;
        });
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <ThemeProvider theme={muiTheme}>
                <CssBaseline />
                <UserContextProvider>
                    <GlobalLoadingContext.Provider value={{ globalLoading, setGlobalLoading }} >
                        <AlertContext.Provider value={{ ...alert, setAlert }} >
                            <DialogContext.Provider value={{ ...dialog, setDialog }} >
                                <NotificationsContext.Provider value={{ ...notificationsContext, setNotificationsContext }} >
                                    <MainContent />
                                </NotificationsContext.Provider>
                            </DialogContext.Provider>
                        </AlertContext.Provider>
                    </GlobalLoadingContext.Provider>
                </UserContextProvider>
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}

export default MainWrapper;