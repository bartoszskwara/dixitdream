import React, {useContext} from 'react'
import {ThemeContext} from "components/themes";
import {AlertContext} from "components/contexts";
import {makeStyles} from "@material-ui/core"
import Alert from "../Alert/Alert";
import Login from "./Login";

const useStyles = makeStyles({
    guestRoot: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1
    }
});

const GuestContent = ({ }) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const { visible: alertVisible } = useContext(AlertContext);

    return (
        <div className={classes.guestRoot}>
            {alertVisible && <Alert />}
            <Login />
        </div>
    );
}

export default GuestContent;