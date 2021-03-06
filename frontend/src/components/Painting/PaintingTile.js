import React, {useContext, useState} from "react";
import PropTypes, {oneOf, string} from "prop-types";
import {ThemeContext} from "components/themes";
import {makeStyles} from "@material-ui/core/styles";
import cn from "classnames";
import Loader from "components/Loader/Loader";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import PaintingTileBottomPanel from "./PaintingTileBottomPanel";
import PaintingTileHeader from "./PaintingTileHeader";
import {PaintingContext} from "../contexts";
import { useDoubleTap } from 'use-double-tap';

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

const PaintingTile = ({ className, avatarVariant = "inside", onClick, onLoad = () => {}, showOptions, editable, setEditMode, withoutDetails }) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const isBigScreen = useMediaQuery("(min-width:800px) and (max-width:1500px)");
    const isLargeScreen = useMediaQuery("(min-width:1500px)");
    const [loading, setLoading] = useState(true);
    const { paintingContext: { id, url: src, avatar, user: author }, toggleLike } = useContext(PaintingContext);

    const clickImageProps = useDoubleTap(!onClick ? (event) => {
        toggleLike();
    } : null);

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
                    {!withoutDetails && <PaintingTileHeader
                        paintingId={id}
                        classes={classes}
                        avatar={avatar}
                        avatarVariant={avatarVariant}
                        author={author}
                        showOptions={showOptions}
                        editable={editable}
                        setEditMode={setEditMode}
                    />}
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
                        {...clickImageProps}
                    />
                    {!withoutDetails && <PaintingTileBottomPanel />}
                </div>
            </div>
        </div>
    );
};

PaintingTile.propTypes = {
    className: PropTypes.string,
    avatarVariant: PropTypes.oneOf(["inside", "outside"]),
    onClick: PropTypes.func,
    onLoad: PropTypes.func,
    showOptions: PropTypes.bool,
    editable: PropTypes.bool,
    setEditMode: PropTypes.func,
    withoutDetails: PropTypes.bool
}
export default PaintingTile;