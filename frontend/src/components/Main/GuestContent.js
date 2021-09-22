import React, {useContext, useState} from 'react'
import {ThemeContext} from "components/themes";
import {AlertContext} from "components/contexts";
import {makeStyles, Typography} from "@material-ui/core"
import Alert from "components/Alert/Alert";
import Login from "./Login";
import SignUp from "./SignUp";

const useStyles = makeStyles(theme => ({
    guestRoot: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        flex: 1,
        marginTop: 30,
        marginBottom: 30,
        boxSizing: "border-box"
    },
    logo: {
        fontSize: 35,
        color: props => props.colors.primary700,
        marginBottom: 40
    },
    bottomText: {
        marginTop: 30
    },
    highlightedText: {
        color: props => props.colors.primary700,
        cursor: "pointer"
    }
}));

const GuestContent = ({ }) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const { visible: alertVisible } = useContext(AlertContext);
    const [currentPage, setCurrentPage] = useState("login");

    return (
        <div className={classes.guestRoot}>
            {alertVisible && <Alert />}
            <div className={classes.logo}>
                DIXIT DREAM
            </div>
            {currentPage === "login" && <Login />}
            {currentPage === "signup" && <SignUp />}
            <div className={classes.bottomText}>
                {currentPage === "login" && <>
                    <Typography>Don't have an account?&nbsp;
                        <Typography
                            variant="subtitle1"
                            display="inline"
                            onClick={() => setCurrentPage("signup")}
                            className={classes.highlightedText}
                        >Sign up!</Typography>
                    </Typography>
                </>}
                {currentPage === "signup" && <>
                    <Typography>Already have an account?&nbsp;
                        <Typography
                            variant="subtitle1"
                            display="inline"
                            onClick={() => setCurrentPage("login")}
                            className={classes.highlightedText}
                        >Sign in!</Typography>
                    </Typography>
                </>}
            </div>
        </div>
    );
}

export default GuestContent;