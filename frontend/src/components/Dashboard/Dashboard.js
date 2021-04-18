import React, {useContext, useEffect, useState} from 'react'
import { ThemeContext } from 'components/themes'
import { makeStyles } from '@material-ui/core/styles';
import ChallengeUpload from "./ChallengeUpload/ChallengeUpload";
import Tiles from "../Painting/Tiles";
import {Api, apiCall} from "../../api/Api";
import ProfileSummary from "components/Profile/ProfileSummary";
import {useHistory} from "react-router";
import UserContext from "../contexts/UserContext";

const useStyles = makeStyles(theme => ({
    dashboardRoot: {
        flex: 1,
        padding: 10,
        overflow: "auto"
    },
    tiles: {
        marginTop: 10
    }
}));
const LIMIT = 2;

const Dashboard = () => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const [paintings, setPaintings] = useState([]);
    const [paintingsLoadingError, setPaintingsLoadingError] = useState(false);
    const [challengeLoading, setChallengeLoading] = useState(false);
    const [challengeLoadingError, setChallengeLoadingError] = useState(false);
    const [challenge, setChallenge] = useState(null);
    const [page, setPage] = useState(0);
    const [shouldFetchMore, setShouldFetchMore] = useState(true);
    const history = useHistory();
    const { id: profileId } = useContext(UserContext);
    const [lastFetchedPaintingId, setLastFetchedPaintingId] = useState(undefined);

    const fetchChallengePaintings = async ({ challengeId, next, lastPaintingId}) => {
        const data = await apiCall(Api.getPaintings, {
            postData: {
                challengeId,
                limit: LIMIT,
                ...(next && lastPaintingId ? { lastPaintingId } : {} )
            }
        });
        if (data) {
            setPaintings(next ? items => ([...items, ...data.content]) : data.content);
            setShouldFetchMore(data.content.length === LIMIT);
        } else {
            setPaintingsLoadingError(true);
        }
    }

    const fetchChallengeData = async () => {
        setChallengeLoading(true);
        const data = await apiCall(Api.getCurrentChallenge);
        if(!data.error) {
            setChallenge(data);
            setChallengeLoading(false);
        } else {
            setChallengeLoading(false);
            setChallengeLoadingError(true);
        }
    }

    useEffect(() => {
        fetchChallengeData();
    }, []);

    useEffect(() => {
        if(challenge) {
            fetchChallengePaintings({ challengeId: challenge.id });
        }
    }, [challenge]);

    useEffect(() => {
        if (!challenge) {
            return;
        }
        if (lastFetchedPaintingId && paintings.length) {
            fetchChallengePaintings({  challengeId: challenge.id, next: true, lastPaintingId: lastFetchedPaintingId });
        } else {
            fetchChallengePaintings({ challengeId: challenge.id });
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
        <div id="dashboard-root" className={classes.dashboardRoot}>
            <ProfileSummary
                onClick={() => history.push(`/profile/${profileId}`)}
            />
            {challenge && <>
                <ChallengeUpload
                    challenge={challenge}
                    loading={challengeLoading}
                    error={challengeLoadingError}
                />
                <div className={classes.tiles}>
                    <Tiles
                        items={paintings}
                        fetchMore={() => setPage(p => (p + 1))}
                        refresh={() => setPage(0)}
                        hasMore={shouldFetchMore && !paintingsLoadingError}
                        error={paintingsLoadingError}
                        scrollTarget="dashboard-root"
                    />
                </div>
            </>}
        </div>
    );
}

export default Dashboard;