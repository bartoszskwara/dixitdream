import React, { useCallback, useContext, useEffect, useRef, useState} from "react";
import {ThemeContext} from "components/themes";
import {makeStyles} from "@material-ui/core/styles";
import PaintingTile from "./PaintingTile";
import Loader from "components/Loader/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import {useHistory} from "react-router";
import useDebounce from "../../hooks/useDebounce";

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
        listStyleType: "none",
        minWidth: 120
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

const Tiles = ({ items, error, fetchMore, hasMore, refresh, scrollTarget }) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const history = useHistory();
    const [imagesLoadedCount, setImagesLoadedCount] = useState(0);

    useEffect(() => {
        const pageContent = document.getElementById("page-content");
        const tilesContent = document.getElementById("tiles-infinite-scroll");
        console.log("czapa", imagesLoadedCount, items, hasMore);
        if (imagesLoadedCount > 0 && hasMore && tilesContent.clientHeight <= pageContent.clientHeight) {
            console.log("fetchmore");
            fetchMore();
        }
    }, [items, imagesLoadedCount, hasMore]);

    const tiles = [...items.map(p => (<li key={p.id}>
        <PaintingTile
            id={p.id}
            src={p.url}
            avatar={p.avatar}
            likes={p.likes || 0}
            visits={p.visits || 0}
            liked={p.liked || false}
            onClick={() => history.push("/painting/" + p.id)}
            onLoad={() => {
                console.log("tutaj!!!!");
                setImagesLoadedCount(i => (i+1));
            }}
        />
    </li>)), ...getPlaceholders(classes.placeholder)];

    return <div id="tiles-infinite-scroll" className={classes.root} >
        {error && <div className={classes.error}>Paintings have not been found due to unexpected error.</div>}
        {!error && <InfiniteScroll
            dataLength={tiles.length}
            next={fetchMore}
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

export default Tiles;