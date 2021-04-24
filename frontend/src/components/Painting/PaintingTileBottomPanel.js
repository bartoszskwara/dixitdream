import React, {useContext, useEffect} from 'react'
import {ThemeContext} from 'components/themes'
import {makeStyles} from '@material-ui/core/styles';
import FavoriteIcon from "@material-ui/icons/Favorite";
import cn from "classnames";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {Api, apiCall} from "../../api/Api";
import { AlertContext, PaintingContext } from "../contexts";

const useStyles = makeStyles(theme => ({
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
        height: 30,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4
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
    }
}));

const PaintingTileBottomPanel = ({}) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const { setAlert } = useContext(AlertContext);
    const { paintingContext: { id, likes, visits, liked }, setPaintingContext } = useContext(PaintingContext);

    const toggleLike = async () => {
        const data = await apiCall(Api.toggleLikePainting, { pathParams: { id } });
        if(!data.error) {
            setPaintingContext(context => ({
                ...context,
                likes: context.liked ? context.likes - 1 : context.likes + 1,
                liked: !context.liked
            }));
        } else {
            setAlert({
                message: "Sorry, we couldn't save your like. Please try again later.",
                severity: "error",
                visible: true
            })
        }
    }

    return (
        <div className={classes.info}>
            <div className={classes.section}>
                <FavoriteIcon
                    className={cn(classes.icon, { [classes.liked]: liked })}
                    onClick={() => toggleLike()}
                />
                <div>{likes}</div>
            </div>
            <div className={classes.section}>
                <VisibilityIcon className={classes.icon} />
                <div>{visits}</div>
            </div>
        </div>
    );
}

export default PaintingTileBottomPanel;