import React, {useContext, useEffect, useState} from "react";
import {ThemeContext} from "components/themes";
import {makeStyles} from "@material-ui/core/styles";
import {useParams} from "react-router";
import {Api, apiCall} from "api/Api";
import InfiniteTiles from "components/Painting/InfiniteTiles";
import ProfileSummary from "./ProfileSummary";

const useStyles = makeStyles(theme => ({
    profileRoot: {
        flex: 1,
        padding: 10,
        overflow: "auto"
    },
    tiles: {
        marginTop: 10
    }
}));
const LIMIT = Number(process.env.REACT_APP_INFINITE_SCROLL_LIMIT);

const Profile = () => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const [paintings, setPaintings] = useState([]);
    const [paintingsLoading, setPaintingsLoading] = useState(false);
    const [paintingsLoadingError, setPaintingsLoadingError] = useState(false);
    const [shouldFetchMore, setShouldFetchMore] = useState(true);
    const [filter, setFilter] = useState(undefined);
    const { profileId } = useParams();

    useEffect(() => {
        if(profileId) {
            setFilter({ profileId });
        }
    }, [profileId]);

    const fetchProfilePaintings = async ({ profileId, next, lastPaintingId }) => {
        setPaintingsLoading(true);
        const data = await apiCall(Api.getPaintings, {
            postData: {
                profileId,
                limit: LIMIT,
                ...(next && lastPaintingId ? { lastPaintingId } : {} )
            }
        });
        if (!data.error) {
            setPaintings(next ? items => ([...items, ...data.content]) : data.content);
            setShouldFetchMore(data.content.length === LIMIT);
        } else {
            setPaintingsLoadingError(true);
        }
        setPaintingsLoading(false);
    }

    return (
        <div id="profile-root" className={classes.profileRoot}>
            <ProfileSummary
                id={profileId}
                detailed
                color="secondary"
            />
            {profileId && <InfiniteTiles
                className={classes.tiles}
                items={paintings}
                fetchPaintings={fetchProfilePaintings}
                filter={filter}
                filterRequired
                hasMore={shouldFetchMore && !paintingsLoadingError}
                error={paintingsLoadingError}
                scrollTarget="profile-root"
                loading={paintingsLoading}
            />}
        </div>
    );
};

export default Profile;