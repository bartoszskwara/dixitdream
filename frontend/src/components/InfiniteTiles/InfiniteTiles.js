import React, {useContext, useEffect, useState, useRef} from "react";
import {ThemeContext} from "components/themes";
import {makeStyles} from "@material-ui/core/styles";
import Loader from "components/Loader/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import cn from "classnames";

const useStyles = makeStyles(theme => ({
    root: {
        flex: 1
    },
    error: {
        textAlign: "center"
    }
}));

const InfiniteTiles = ({ customClasses = {}, className, items, error, hasMore, scrollTarget, filter, filterRequired, fetchItems, loading,
    imagesLoadedCount, tilesContainerClass, tiles, noResultsLabel }) => {

    const classes = useStyles(useContext(ThemeContext).theme);
    const [page, setPage] = useState(0);
    const [fetchingCount, setFetchingCount] = useState(0);
    const prevState = useRef({
        loading: false
    });

    useEffect(() => {
        const pageContent = document.getElementById("page-content");
        const tilesContent = document.getElementById("tiles-infinite-scroll");
        if ((!imagesLoadedCount || (imagesLoadedCount && imagesLoadedCount > 0)) && hasMore && tilesContent.clientHeight <= pageContent.clientHeight) {
            fetchNext();
        }
    }, [items, imagesLoadedCount, hasMore]);

    useEffect(() => {
        if(filter) {
            fetchItems({ ...filter });
        }
    }, [filter]);

    useEffect(() => {
        prevState.current = {
            loading
        }
    }, [loading]);

    useEffect(() => {
        if(loading || (filterRequired && !filter)) {
            return;
        }

        let lastId = undefined;
        if (page > 0 && items.length) {
            lastId = items[items.length - 1].id;
        }

        if (lastId && items.length) {
            fetchItems({ ...(filter ? filter : {}), next: true, lastId });
        } else {
            fetchItems({ ...(filter ? filter : {}) });
        }
    }, [fetchingCount]);

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
        {(noResultsLabel && prevState.current.loading && !loading && !items.length) && <div className={customClasses.noResultsLabel}>{noResultsLabel}</div>}
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
            <ul className={tilesContainerClass}>{tiles}</ul>
        </InfiniteScroll>}
    </div>;
};

export default InfiniteTiles;