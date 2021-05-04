import React, {useContext, useState} from 'react'
import {muiThemeProvider, ThemeContext, themes} from "components/themes";
import {AlertContext, DialogContext, GlobalLoadingContext, UserContext} from "components/contexts";
import {ThemeProvider} from "@material-ui/core"
import CssBaseline from "@material-ui/core/CssBaseline";
import UserContextProvider from "./UserContextProvider";
import AppContent from "./AppContent";
import GuestContent from "./GuestContent";

const MainContent = ({ }) => {
    const { id, authenticated } = useContext(UserContext);
    const { toggleTheme } = useContext(ThemeContext);

    console.log("auth", id, authenticated);

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
                                <MainContent />
                            </DialogContext.Provider>
                        </AlertContext.Provider>
                    </GlobalLoadingContext.Provider>
                </UserContextProvider>
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}

export default MainWrapper;