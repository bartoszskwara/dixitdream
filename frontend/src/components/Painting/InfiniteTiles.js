import React, { useCallback, useContext, useEffect, useRef, useState} from "react";
import {ThemeContext} from "components/themes";
import {makeStyles} from "@material-ui/core/styles";
import PaintingTile from "./PaintingTile";
import Loader from "components/Loader/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import {useHistory} from "react-router";
import cn from "classnames";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { PaintingContext } from "../contexts";

const useStyles = makeStyles(theme => ({
    root: {
        flex: 1
    },
    tiles: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        margin: 0,
        padding: 0,
        "& li": {
            flex: 1,
            display: "flex",
            padding: 0,
            margin: 0,
            listStyleType: "none"
        }
    },
    placeholder: {
        flex: 1,
        padding: 0,
        margin: 0,
        listStyleType: "none"
    },
    placeholderDefault: {
        minWidth: 120
    },
    placeholderBig: {
        minWidth: 250
    },
    placeholderLarge: {
        minWidth: 350
    },
    error: {
        textAlign: "center"
    }
}));

const getPlaceholders = (className) => ([
    <li key="placeholder1"><div className={className}></div></li>,
    <li key="placeholder2"><div className={className}></div></li>,
    <li key="placeholder3"><div className={className}></div></li>,
    <li key="placeholder4"><div className={className}></div></li>,
    <li key="placeholder5"><div className={className}></div></li>,
    <li key="placeholder6"><div className={className}></div></li>,
    <li key="placeholder7"><div className={className}></div></li>,
    <li key="placeholder8"><div className={className}></div></li>]);

const TileWithContext = ({ painting, setImagesLoadedCount }) => {
    const [paintingContext, setPaintingContext] = useState({ ...painting });
    const history = useHistory();
    return <PaintingContext.Provider value={{ paintingContext, setPaintingContext }}>
        <PaintingTile
            onClick={() => history.push("/painting/" + painting.id)}
            onLoad={() => setImagesLoadedCount(i => (i+1))}
        />
    </PaintingContext.Provider>
};

const InfiniteTiles = ({ className, items, error, hasMore, scrollTarget, filter, filterRequired, fetchPaintings, loading }) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const [imagesLoadedCount, setImagesLoadedCount] = useState(0);
    const [page, setPage] = useState(0);
    const [fetchingCount, setFetchingCount] = useState(0);
    const isBigScreen = useMediaQuery("(min-width:800px) and (max-width:1500px)");
    const isLargeScreen = useMediaQuery("(min-width:1500px)");
    const placeholderClass = isBigScreen ? classes.placeholderBig : (isLargeScreen ? classes.placeholderLarge : classes.placeholderDefault);

    useEffect(() => {
        const pageContent = document.getElementById("page-content");
        const tilesContent = document.getElementById("tiles-infinite-scroll");
        if (imagesLoadedCount > 0 && hasMore && tilesContent.clientHeight <= pageContent.clientHeight) {
            fetchNext();
        }
    }, [items, imagesLoadedCount, hasMore]);

    useEffect(() => {
        if(filter) {
            fetchPaintings({ ...filter });
        }
    }, [filter]);

    useEffect(() => {
        if(loading || (filterRequired && !filter)) {
            return;
        }

        let lastFetchedPaintingId = undefined;
        if (page > 0 && items.length) {
            lastFetchedPaintingId = items[items.length - 1].id;
        }

        if (lastFetchedPaintingId && items.length) {
            fetchPaintings({ ...(filter ? filter : {}), next: true, lastPaintingId: lastFetchedPaintingId });
        } else {
            fetchPaintings({ ...(filter ? filter : {}) });
        }
    }, [fetchingCount]);

    const tiles = [...items.map(p => (<li key={p.id}>
        <TileWithContext painting={p} setImagesLoadedCount={setImagesLoadedCount} />
    </li>)), ...getPlaceholders(placeholderClass)];

    const fetchNext = () => {
        setPage(p => (p + 1));
        setFetchingCount(i => (i + 1));
    }

    const refresh = () => {
        setPage(0);
        setFetchingCount(i => (i + 1));
    }

    return <div id="tiles-infinite-scroll" className={cn(classes.root, className)} >
        {error && <div className={classes.error}>{error}</div>}
        {!error && <InfiniteScroll
            dataLength={tiles.length}
            next={fetchNext}
            hasMore={hasMore}
            loader={<Loader />}
            pullDownToRefresh
            refreshFunction={refresh}
            pullDownToRefreshThreshold={50}
            pullDownToRefreshContent={<Loader />}
            releaseToRefreshContent={<Loader />}
            scrollableTarget={scrollTarget}
        >
            <ul className={classes.tiles}>{tiles}</ul>
        </InfiniteScroll>}
    </div>;
};

export default InfiniteTiles;