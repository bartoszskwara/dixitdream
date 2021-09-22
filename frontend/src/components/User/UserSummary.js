import React, {useContext, useEffect, useState} from 'react'
import {ThemeContext} from 'components/themes';
import {UserContext} from 'components/contexts';
import {makeStyles} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import UserPicture from "assets/images/user.png";
import Loader from "components/Loader/Loader";
import cn from "classnames";
import {Api, apiCall} from "../../api/Api";
import Error from "components/Error/Error";
import {ReactComponent as SettingsIcon} from "assets/images/settings.svg";
import IconButton from "@material-ui/core/IconButton";
import {useHistory} from "react-router";

const useStyles = makeStyles(theme => ({
    userSummaryRoot: {
        padding: 10,
        border: appTheme => `1px solid ${appTheme.colors.primary700}`,
        borderRadius: 4
    },
    wrapper: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
    },
    container: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
    },
    rootPrimary: {
        backgroundColor: appTheme => appTheme.colors.primary100,
    },
    rootSecondary: {
        backgroundColor: appTheme => appTheme.colors.contrast100,
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
    stats: {
        fontSize: 14
    },
    divider: {
        padding: 5
    },
    detailed: {
        marginTop: 10
    },
    icon: {
        width: 20,
        height: 20,
        fill: props => props.colors.secondary100,
        margin: 10
    }
}));

const UserSummary = ({ id, detailed = false, color = "primary", onClick, showSettings }) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const userContext = useContext(UserContext);
    const history = useHistory();
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(false);
    const [userLoadingError, setUserLoadingError] = useState(null);

    useEffect(() => {
        if(id) {
            fetchUser({ userId: id });
        }
    }, [id]);

    const fetchUser = async ({ userId }) => {
        setUserLoading(true);
        const data = await apiCall(Api.getUser, { pathParams: { id: userId }});
        if(!data.error) {
            setUser(data);
            setUserLoading(false);
        } else {
            setUserLoadingError(data.error);
            setUserLoading(false);
        }
    }

    const userData = id ? user : userContext;

    return (
        <div
            className={cn(classes.userSummaryRoot, {
                [classes.rootPrimary]: color === "primary",
                [classes.rootSecondary]: color === "secondary"
            })}
            onClick={onClick ? onClick : () => {} }
        >
            {userLoadingError && <Error message={userLoadingError}/>}
            {(userLoading || (!id && (!userData || !userData.id))) && <Loader />}
            {userData && <>
                {userData.id && <>
                    <div className={classes.wrapper}>
                        <div className={classes.container}>
                            <div>
                                <Avatar alt={userData.name} src={UserPicture} className={classes.avatar} />
                            </div>
                            <div className={classes.userData}>
                                <div className={classes.title}>
                                    {userData.username}
                                </div>
                                <div className={classes.stats}>
                                    <span>{userData.followers} followers</span>
                                    <span className={classes.divider}>&#8226;</span>
                                    <span>{userData.paintings} {userData.paintings > 1 ? "paintings" : "painting"}</span>
                                </div>
                            </div>
                        </div>
                        {showSettings && <div>
                            <IconButton onClick={() => history.push("/settings")}>
                                <SettingsIcon className={classes.icon} />
                            </IconButton>
                        </div>}
                    </div>
                    {detailed && <div>
                        {userData.description && <p className={classes.detailed}>{userData.description}</p>}
                    </div>}
                </>}
            </>}
        </div>
    );
}

export default UserSummary;