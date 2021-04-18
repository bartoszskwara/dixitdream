import React, {useContext, useEffect, useState} from "react";
import {ThemeContext} from "components/themes";
import {makeStyles} from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import FavoriteIcon from '@material-ui/icons/Favorite';
import VisibilityIcon from '@material-ui/icons/Visibility';
import cn from "classnames";
import Loader from "../Loader/Loader";
import {useHistory} from "react-router";

const useStyles = makeStyles(theme => ({
    paintingTile: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        position: "relative",
        marginBottom: 5,
        minWidth: 120
    },
    preview: {
        flex: 100,
        width: "100%"
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
    info: {
        backgroundColor: props => props.colors.primary400,
        color: props => props.colors.contrast100,
        fontSize: 16,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
        padding: 4,
        height: 30
    },
    section: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 2px 0 2px"
    },
    icon: {
        width: 15,
        height: 15,
        fill: props => props.colors.contrast100,
        marginRight: 5
    },
    liked: {
        fill: props => props.colors.like,
    },
    hidden: {
        display: "none"
    },
    author: {
        fontSize: 20
    },
    clickable: {
        cursor: "pointer"
    }
}));

const PaintingTile = ({ className, id, src, avatar, avatarVariant = "inside", likes, visits, liked, author, onClick, onLoad = () => {} }) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const [loading, setLoading] = useState(true);

    return <div className={cn(classes.paintingTile, className)}>
        <div className={cn(classes.avatarContainer, {
            [classes.avatarInsideContainer]: avatarVariant === "inside",
            [classes.avatarOutsideContainer]: avatarVariant === "outside"
        })}>
            <Avatar
                alt={`painting-${id}`}
                src={avatar}
                className={cn(classes.avatar, {
                    [classes.imgInside]: avatarVariant === "inside",
                    [classes.imgOutside]: avatarVariant === "outside"
                })}
            />
            {author && <p className={classes.author}>{author}</p>}
        </div>
        {loading && <Loader />}
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
        <div className={classes.info}>
            <div className={classes.section}>
                <FavoriteIcon className={cn(classes.icon, { [classes.liked]: liked })} />
                <div>{likes}</div>
            </div>
            <div className={classes.section}>
                <VisibilityIcon className={classes.icon} />
                <div>{visits}</div>
            </div>
        </div>
    </div>;
};

export default PaintingTile;