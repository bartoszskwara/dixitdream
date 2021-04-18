import React, {useContext} from 'react'
import { ThemeContext } from 'components/themes';
import UserContext from 'components/contexts/UserContext';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import ProfilePicture from "assets/images/profile.png";
import Loader from "../../Loader/Loader";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        padding: 10,
        backgroundColor: appTheme => appTheme.colors.primary100,
        border: appTheme => `1px solid ${appTheme.colors.primary700}`,
        borderRadius: 4
    },
    avatar: {
        width: 60,
        height: 60,
        border: appTheme => `3px solid ${appTheme.colors.secondary700}`
    },
    userData: {
        marginLeft: 20,
        marginTop: -5
    },
    title: {
        fontSize: 30
    },
    details: {
        fontSize: 14
    },
    divider: {
        padding: 5
    }
}));

const Profile = () => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const userContext = useContext(UserContext);
    return (
        <div className={classes.root}>
            {!userContext.id && <Loader />}
            {userContext.id && <>
                <div>
                    <Avatar alt={userContext.name} src={ProfilePicture} className={classes.avatar} />
                </div>
                <div className={classes.userData}>
                    <div className={classes.title}>
                        {userContext.username}
                    </div>
                    <div className={classes.details}>
                        <span>{userContext.followers} followers</span>
                        <span className={classes.divider}>&#8226;</span>
                        <span>{userContext.paintings} {userContext.paintings > 1 ? "paintings" : "painting"}</span>
                    </div>
                </div>
            </>}
        </div>
    );
}

export default Profile;