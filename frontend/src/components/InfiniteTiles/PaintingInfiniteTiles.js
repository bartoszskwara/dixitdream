import React, {useContext, useEffect, useState} from "react";
import {ThemeContext} from "components/themes";
import {makeStyles} from "@material-ui/core/styles";
import PaintingTile from "components/Painting/PaintingTile";
import {useHistory} from "react-router";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {PaintingContext} from "../contexts";
import InfiniteTiles from "./InfiniteTiles";

const useStyles = makeStyles(theme => ({
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

const TileWithContext = ({ painting, setImagesLoadedCount, withoutDetails }) => {
    const [paintingContext, setPaintingContext] = useState({ ...painting });
    const history = useHistory();
    return <PaintingContext.Provider value={{ paintingContext, setPaintingContext }}>
        <PaintingTile
            onClick={() => history.push("/painting/" + painting.id)}
            onLoad={() => setImagesLoadedCount(i => (i+1))}
            withoutDetails={withoutDetails}
        />
    </PaintingContext.Provider>
};

const PaintingInfiniteTiles = ({ ...InfiniteTilesProps }) => {
    const classes = useStyles(useContext(ThemeContext).theme);

    const [imagesLoadedCount, setImagesLoadedCount] = useState(0);
    const isBigScreen = useMediaQuery("(min-width:800px) and (max-width:1500px)");
    const isLargeScreen = useMediaQuery("(min-width:1500px)");
    const placeholderClass = isBigScreen ? classes.placeholderBig : (isLargeScreen ? classes.placeholderLarge : classes.placeholderDefault);

    const {items, withoutDetails} = InfiniteTilesProps;

    const tiles = [...items.map(p => (<li key={p.id}>
        <TileWithContext
            painting={p}
            setImagesLoadedCount={setImagesLoadedCount}
            withoutDetails={withoutDetails}
        />
    </li>)), ...getPlaceholders(placeholderClass)];

    return <InfiniteTiles
        {...InfiniteTilesProps}
        imagesLoadedCount={imagesLoadedCount}
        tiles={tiles}
        tilesContainerClass={classes.tiles}
    />
};

export default PaintingInfiniteTiles;