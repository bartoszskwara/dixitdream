import React, {useContext} from 'react'
import {ThemeContext} from 'components/themes'
import {makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import {ReactComponent as HomeIcon} from "assets/images/house.svg";
import {ReactComponent as SearchIcon} from "assets/images/search3.svg";
import {ReactComponent as UserIcon} from "assets/images/user.svg";
import {ReactComponent as AddIcon} from "assets/images/add2.svg";
import {useHistory} from "react-router";
import {UserContext} from "../contexts";

const useStyles = makeStyles(theme => ({
    navBarRoot: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: "0 15px"
    },
    icon: {
        width: 40,
        height: 40,
        fill: props => props.colors.contrast100,
        margin: 10
    }
}));

const NavBar = () => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const history = useHistory();
    const { id } = useContext(UserContext);
    return (
        <div className={classes.navBarRoot}>
            <IconButton onClick={() => history.push("")}>
                <HomeIcon className={classes.icon}/>
            </IconButton>
            <IconButton onClick={() => history.push("/explore")}>
                <SearchIcon className={classes.icon}/>
            </IconButton>
            <IconButton onClick={() => history.push("/upload")}>
                <AddIcon className={classes.icon}/>
            </IconButton>
            <IconButton onClick={() => history.push(`/user/${id}`)}>
                <UserIcon className={classes.icon}/>
            </IconButton>
        </div>
    );
}

export default NavBar;