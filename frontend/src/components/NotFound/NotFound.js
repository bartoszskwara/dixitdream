import React, {useContext} from "react";
import {ThemeContext} from "components/themes";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
}));

const NotFound = () => {
    const classes = useStyles(useContext(ThemeContext).theme);
    return <div className={classes.root}>
        <p>Not found.</p>
    </div>;
};

export default NotFound;