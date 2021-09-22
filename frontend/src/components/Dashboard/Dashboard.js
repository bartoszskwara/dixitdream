import React, {useContext, useEffect, useMemo, useState} from 'react'
import {ThemeContext} from 'components/themes'
import {makeStyles} from '@material-ui/core/styles';
import ChallengeUpload from "./ChallengeUpload/ChallengeUpload";
import PaintingInfiniteTiles from "components/InfiniteTiles/PaintingInfiniteTiles";
import {Api, apiCall} from "api/Api";
import {useHistory} from "react-router";
import {UserContext} from "components/contexts";
import UserSummary from "components/User/UserSummary";

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
    const [challenge, setChallenge] = useState(null);
    const [challengeLoading, setChallengeLoading] = useState(false);
    const [challengeLoadingError, setChallengeLoadingError] = useState(null);
    const [paintingsLoading, setPaintingsLoading] = useState(false);
    const [paintingsLoadingError, setPaintingsLoadingError] = useState(false);
    const [shouldFetchMore, setShouldFetchMore] = useState(true);
    const [challengeEnded, setChallengeEnded] = useState(false);
    const history = useHistory();
    const { id: userId } = useContext(UserContext);

    useEffect(() => {
        fetchChallengeData();
    }, []);

    const fetchChallengePaintings = async ({ challengeId, next, lastId }) => {
        setPaintingsLoading(true);
        const data = await apiCall(Api.getPaintings, {
            postData: {
                challengeId,
                limit: LIMIT,
                ...(next && lastId ? { lastPaintingId: lastId } : {} )
            }
        });
        if (!data.error && data.content) {
            setPaintings(next ? items => ([...items, ...data.content]) : data.content);
            setShouldFetchMore(data.content.length === LIMIT);
        } else {
            setPaintingsLoadingError(true);
        }
        setPaintingsLoading(false);
    }

    const fetchChallengeData = async () => {
        setChallengeLoading(true);
        const data = await apiCall(Api.getCurrentChallenge);
        if(!data.error) {
            setChallenge(data);
            setChallengeLoading(false);
            setChallengeEnded(false);
        } else {
            setChallengeLoading(false);
            setChallengeLoadingError(data.error);
        }
    }

    const filter = useMemo(() => (challenge ? { challengeId: challenge.id } : undefined), [challenge]);

    return (
        <div id="dashboard-root" className={classes.dashboardRoot}>
            <UserSummary
                onClick={() => history.push(`/user/${userId}`)}
            />
            <ChallengeUpload
                challenge={challenge}
                challengeEnded={challengeEnded}
                setChallengeEnded={setChallengeEnded}
                refreshChallenge={fetchChallengeData}
                loading={challengeLoading}
                error={challengeLoadingError}
            />
            {(challenge && !challengeLoading) &&
                <PaintingInfiniteTiles
                    className={classes.tiles}
                    items={paintings}
                    fetchItems={fetchChallengePaintings}
                    filter={filter}
                    filterRequired={true}
                    hasMore={shouldFetchMore && !paintingsLoadingError}
                    error={paintingsLoadingError}
                    scrollTarget="dashboard-root"
                    loading={paintingsLoading}
                />}
        </div>
    );
}

export default Dashboard;