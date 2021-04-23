import React, {useContext, useState} from "react";
import {ThemeContext} from "components/themes";
import {makeStyles} from "@material-ui/core/styles";
import cn from "classnames";
import Loader from "../Loader/Loader";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import PaintingTileBottomPanel from "./PaintingTileBottomPanel";
import PaintingTileHeader from "./PaintingTileHeader";
import PaintingContext from "../contexts/PaintingContext";

const useStyles = makeStyles(theme => ({
    paintingTileContainer: {
        padding: 5,
        margin: 3,
        border: appTheme => `1px solid ${appTheme.colors.primary100}`,
        borderRadius: 4,
        display: "flex",
        flex: 1,
        flexDirection: "column",
        marginBottom: 5
    },
    paintingTile: {
        position: "relative",
        display: "flex",
        flex: 1
    },
    paintingTileDefault: {
        minWidth: 120
    },
    paintingTileBig: {
        minWidth: 250
    },
    paintingTileLarge: {
        minWidth: 350
    },
    preview: {
        flex: 100,
        width: "100%",
        display: "block",
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4
    },
    avatarContainer: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row"
    },
    avatarInsideContainer: {
        position: "absolute",
        top: 0,
        left: 0
    },
    avatarOutsideContainer: {
        marginBottom: 10
    },
    avatar: {
        width: 30,
        height: 30
    },
    imgInside: {
        margin: 5,
        border: appTheme => `1px solid ${appTheme.colors.contrast100}`,
    },
    imgOutside: {
        border: appTheme => `2px solid ${appTheme.colors.secondary700}`,
        marginRight: 10
    },
    hidden: {
        display: "none"
    },
    author: {
        fontSize: 20
    },
    clickable: {
        cursor: "pointer"
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    options: {
        marginBottom: 10
    }
}));

const PaintingTile = ({ className, avatarVariant = "inside", onClick, onLoad = () => {}, showOptions, editable }) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const isBigScreen = useMediaQuery("(min-width:800px) and (max-width:1500px)");
    const isLargeScreen = useMediaQuery("(min-width:1500px)");
    const [loading, setLoading] = useState(true);
    const { paintingContext: { id, url: src, avatar, profile: author } } = useContext(PaintingContext);

    return (
        <div className={cn(classes.paintingTileContainer, className)}>
            <div
                className={cn(
                    classes.paintingTile, {
                        [classes.paintingTileDefault]: !isBigScreen && !isLargeScreen,
                        [classes.paintingTileBig]: isBigScreen,
                        [classes.paintingTileLarge]: isLargeScreen
                    }
                )}
            >
                {loading && <Loader />}
                <div style={ { display: loading ? "none" : "block" } }>
                    <PaintingTileHeader
                        paintingId={id}
                        classes={classes}
                        avatar={avatar}
                        avatarVariant={avatarVariant}
                        author={author}
                        showOptions={showOptions}
                        editable={editable}
                    />
                    <img
                        alt="preview"
                        src={src}
                        className={cn(classes.preview, {
                            [classes.hidden]: loading,
                            [classes.clickable]: !!onClick
                        })}
                        onLoad={() => {
                            setLoading(false);
                            onLoad();
                        }}
                        onClick={onClick || (() => {})}
                    />
                    <PaintingTileBottomPanel />
                </div>
            </div>
        </div>
    );
};

export default PaintingTile;