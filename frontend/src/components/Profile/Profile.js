import React, {useContext, useEffect, useState} from "react";
import {ThemeContext} from "components/themes";
import {makeStyles} from "@material-ui/core/styles";
import {useParams} from "react-router";
import {Api, apiCall} from "../../api/Api";
import Tiles from "../Painting/Tiles";
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
    const [page, setPage] = useState(0);
    const [shouldFetchMore, setShouldFetchMore] = useState(true);
    const [lastFetchedPaintingId, setLastFetchedPaintingId] = useState(undefined);
    const { profileId } = useParams();

    const fetchProfilePaintings = async ({ profileId, next, lastPaintingId }) => {
        setPaintingsLoading(true);
        const data = await apiCall(Api.getPaintings, {
            postData: {
                profileId,
                limit: LIMIT,
                ...(next && lastPaintingId ? { lastPaintingId } : {} )
            }
        });
        setPaintingsLoading(false);
        if (!data.error) {
            setPaintings(next ? items => ([...items, ...data.content]) : data.content);
            setShouldFetchMore(data.content.length === LIMIT);
        } else {
            setPaintingsLoadingError(true);
        }
    }

    useEffect(() => {
        if (!profileId) {
            return;
        }
        if (lastFetchedPaintingId && paintings.length) {
            fetchProfilePaintings({  profileId, next: true, lastPaintingId: lastFetchedPaintingId });
        } else {
            fetchProfilePaintings({ profileId });
        }
    }, [lastFetchedPaintingId]);

    useEffect(() => {
        if (page > 0 && paintings.length) {
            setLastFetchedPaintingId(paintings[paintings.length - 1].id);
        } else {
            setLastFetchedPaintingId(undefined);
        }
    }, [page]);

    return (
        <div id="profile-root" className={classes.profileRoot}>
            <ProfileSummary
                id={profileId}
                detailed
                color="secondary"
            />
            <div className={classes.tiles}>
                <Tiles
                    items={paintings}
                    fetchMore={() => setPage(p => (p + 1))}
                    refresh={() => setPage(0)}
                    hasMore={shouldFetchMore && !paintingsLoadingError}
                    error={paintingsLoadingError}
                    scrollTarget="profile-root"
                />
            </div>
        </div>
    );
};

export default Profile;