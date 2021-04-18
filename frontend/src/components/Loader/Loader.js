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

const Loader = () => {
    const classes = useStyles(useContext(ThemeContext).theme);
    return <div className={classes.root}>
        <p>Loading...</p>
    </div>;
};

export default Loader;