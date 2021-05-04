import React, {useContext} from 'react'
import {ThemeContext} from 'components/themes'
import {makeStyles} from '@material-ui/core/styles';
import NotificationsIcon from '@material-ui/icons/Notifications';
import {useHistory} from "react-router";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles(theme => ({
    topBarRoot: {
        display: "flex",
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        padding: "5px 10px"
    },
    title: {
        fontSize: 30,
        color: props => props.colors.contrast100,
        cursor: "pointer"
    },
    icon: {
        width: 50,
        height: 50,
        fill: props => props.colors.contrast100
    }
}));

const TopBar = () => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const history = useHistory();
    const goHome = () => history.push("/");

    return (
        <div className={classes.topBarRoot}>
            <p className={classes.title} onClick={goHome}>DIXIT DREAM</p>
            <IconButton onClick={() => history.push("")}>
                <NotificationsIcon classes={{
                    root: classes.icon
                }}/>
            </IconButton>
        </div>
    );
}

export default TopBar;