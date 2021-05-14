import React, {useContext, useEffect, useState} from "react";
import {ThemeContext} from "components/themes";
import {makeStyles} from "@material-ui/core/styles";
import {useParams} from "react-router";
import {Api, apiCall} from "api/Api";
import InfiniteTiles from "components/Painting/InfiniteTiles";
import UserSummary from "components/User/UserSummary";

const useStyles = makeStyles(theme => ({
    userRoot: {
        flex: 1,
        padding: 10,
        overflow: "auto"
    },
    tiles: {
        marginTop: 10
    }
}));
const LIMIT = Number(process.env.REACT_APP_INFINITE_SCROLL_LIMIT);

const User = () => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const [paintings, setPaintings] = useState([]);
    const [paintingsLoading, setPaintingsLoading] = useState(false);
    const [paintingsLoadingError, setPaintingsLoadingError] = useState(false);
    const [shouldFetchMore, setShouldFetchMore] = useState(true);
    const [filter, setFilter] = useState(undefined);
    const { userId } = useParams();

    useEffect(() => {
        if(userId) {
            setFilter({ userId });
        }
    }, [userId]);

    const fetchUserPaintings = async ({ userId, next, lastPaintingId }) => {
        setPaintingsLoading(true);
        const data = await apiCall(Api.getPaintings, {
            postData: {
                userId,
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
        <div id="user-root" className={classes.userRoot}>
            <UserSummary
                id={userId}
                detailed
                color="secondary"
            />
            {userId && <InfiniteTiles
                className={classes.tiles}
                items={paintings}
                fetchPaintings={fetchUserPaintings}
                filter={filter}
                filterRequired
                hasMore={shouldFetchMore && !paintingsLoadingError}
                error={paintingsLoadingError}
                scrollTarget="user-root"
                loading={paintingsLoading}
                withoutDetails
            />}
        </div>
    );
};

export default User;