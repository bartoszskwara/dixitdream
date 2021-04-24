import React, {useContext, useEffect, useState} from 'react'
import { ThemeContext } from 'components/themes';
import { UserContext } from 'components/contexts';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import ProfilePicture from "assets/images/profile.png";
import Loader from "components/Loader/Loader";
import {useHistory} from "react-router";
import cn from "classnames";
import {Api, apiCall} from "../../api/Api";
import NotFound from "../NotFound/NotFound";
import Error from "../Error/Error";

const useStyles = makeStyles(theme => ({
    profileSummaryRoot: {
        padding: 10,
        border: appTheme => `1px solid ${appTheme.colors.primary700}`,
        borderRadius: 4
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
    }
}));

const ProfileSummary = ({ id, detailed = false, color = "primary", onClick }) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const userContext = useContext(UserContext);
    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileLoadingError, setProfileLoadingError] = useState(null);

    useEffect(() => {
        if(id) {
            fetchProfile({ profileId: id });
        }
    }, [id]);

    const fetchProfile = async ({ profileId }) => {
        setProfileLoading(true);
        const data = await apiCall(Api.getProfile, { pathParams: { id: profileId }});
        if(!data.error) {
            setProfile(data);
            setProfileLoading(false);
        } else {
            setProfileLoadingError(data.error);
            setProfileLoading(false);
        }
    }

    const profileData = id ? profile : userContext;

    return (
        <div
            className={cn(classes.profileSummaryRoot, {
                [classes.rootPrimary]: color === "primary",
                [classes.rootSecondary]: color === "secondary"
            })}
            onClick={onClick ? onClick : () => {} }
        >
            {profileLoadingError && <Error message={profileLoadingError}/>}
            {(profileLoading || (!id && (!profileData || !profileData.id))) && <Loader />}
            {profileData && <>
                {profileData.id && <>
                    <div className={classes.container}>
                        <div>
                            <Avatar alt={profileData.name} src={ProfilePicture} className={classes.avatar} />
                        </div>
                        <div className={classes.userData}>
                            <div className={classes.title}>
                                {profileData.username}
                            </div>
                            <div className={classes.stats}>
                                <span>{profileData.followers} followers</span>
                                <span className={classes.divider}>&#8226;</span>
                                <span>{profileData.paintings} {profileData.paintings > 1 ? "paintings" : "painting"}</span>
                            </div>
                        </div>
                    </div>
                    {detailed && <div className={classes.detailed}>
                        <p>{profileData.description}</p>
                    </div>}
                </>}
            </>}
        </div>
    );
}

export default ProfileSummary;