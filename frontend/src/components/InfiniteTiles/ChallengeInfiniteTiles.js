import React, {useContext, useEffect, useState} from "react";
import {ThemeContext} from "components/themes";
import {makeStyles} from "@material-ui/core/styles";
import ChallengeTags from "../Challenge/ChallengeTags";
import InfiniteTiles from "components/InfiniteTiles/InfiniteTiles";
import cn from "classnames";

const useStyles = makeStyles(() => ({
    container: {
        border: theme => `1px solid ${theme.colors.primary100}`,
        padding: 5,
        margin: "3px 3px 5px 3px",
        borderRadius: 4,
        flex: 1,
    },
    root: {
        borderRadius: 4,
        color: theme => theme.colors.contrast100,
        backgroundColor: theme => theme.colors.primary500,
        padding: 10,
        fontSize: 16,
    },
    row: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 12
    },
    tiles: {
        display: "flex",
        flexDirection: "column",
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
    tags: {
        fontSize: 16
    },
    inactive: {
        backgroundColor: theme => theme.colors.primary400,
    }
}));

const ChallengeInfiniteTiles = ({ ...InfiniteTilesProps }) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const {items} = InfiniteTilesProps;
    const tiles = [...items.map(i => (<li key={i.id}>
        <div className={classes.container}>
            <div className={cn(classes.root, { [classes.inactive]: !i.active })}>
                <div className={classes.row}>
                    <ChallengeTags classes={{ root: classes.tags }} tags={i.tags} divider={<span> &#8226; </span>} />
                </div>
                <div className={classes.row}>
                    <span>{i.name.toUpperCase()}</span>
                </div>
                <div className={classes.row}>
                    <span>{i.numberOfPaintings} {i.numberOfPaintings === 1 ? "painting" : "paintings"} &#8226; {i.numberOfUsers} {i.numberOfUsers === 1 ? "user" : "users"}</span>
                    {!i.active && <span>ended: {new Date(i.endDate * 1000).toLocaleDateString()}</span>}
                </div>
            </div>
        </div>
    </li>))];

    return <InfiniteTiles
        {...InfiniteTilesProps}
        tiles={tiles}
        tilesContainerClass={classes.tiles}
    />
};

export default ChallengeInfiniteTiles;