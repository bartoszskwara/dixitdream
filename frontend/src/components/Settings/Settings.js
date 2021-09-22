import React, {useContext} from "react";
import {ThemeContext} from "components/themes";
import {makeStyles} from "@material-ui/core/styles";
import Button from "components/Input/Button";
import {UserContext} from "components/contexts";

const useStyles = makeStyles(theme => ({
    settingsRoot: {
        padding: 10
    }
}));
const User = () => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const { logout } = useContext(UserContext);

    return (
        <div id="settings-root" className={classes.settingsRoot}>
            <Button size="small" autoFocus onClick={() => logout()} color="warning">
                Logout
            </Button>
        </div>
    );
};

export default User;