import React, {useContext, useEffect, useState} from "react";
import {ThemeContext} from "components/themes";
import {makeStyles} from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import cn from "classnames";
import {useHistory} from "react-router";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {Menu, MenuItem} from "@material-ui/core";
import {Api, apiCall} from "../../api/Api";
import AlertContext from "components/contexts/AlertContext";
import GlobalLoadingContext from "../contexts/GlobalLoadingContext";

const useStyles = makeStyles(theme => ({
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
    author: {
        fontSize: 20
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

const PaintingTileHeader = ({ paintingId, author, avatar, avatarVariant, showOptions }) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteError, setDeleteError] = useState(undefined);
    const { setGlobalLoading } = useContext(GlobalLoadingContext);
    const { setAlert } = useContext(AlertContext);

    useEffect(() => {
        if(deleteSuccess) {
            history.push(`/profile/${author.id}`);
        }
        if(deleteError) {
            setAlert({
                message: deleteError,
                severity: "error",
                visible: true
            })
            setDeleteError(null);
        }
    }, [deleteSuccess, deleteError]);

    const openMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const deletePainting = async () => {
        setGlobalLoading(true);
        const data = await apiCall(Api.deletePainting, { pathParams: { id: paintingId }});
        if(!data.error) {
            setDeleteSuccess(true);
        } else {
            setDeleteError(data.error);
        }
        setGlobalLoading(false);
    }

    return (
        <div className={classes.header}>
            <div
                className={cn(classes.avatarContainer, {
                    [classes.avatarInsideContainer]: avatarVariant === "inside",
                    [classes.avatarOutsideContainer]: avatarVariant === "outside"
                })}
                onClick={(author && author.id) ? () => history.push(`/profile/${author.id}`) : () => {}}
            >
                <Avatar
                    alt="painting"
                    src={avatar}
                    className={cn(classes.avatar, {
                        [classes.imgInside]: avatarVariant === "inside",
                        [classes.imgOutside]: avatarVariant === "outside"
                    })}
                />
                {(author && author.username) && <p className={classes.author}>{author.username}</p>}
            </div>
            {showOptions && <div className={classes.options}>
                <MoreVertIcon
                    onClick={openMenu}
                />
                <Menu
                    id="painting-menu"
                    anchorEl={anchorEl}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={closeMenu}
                >
                    <MenuItem
                        onClick={() => {
                            deletePainting();
                            closeMenu();
                        }}
                    >
                        Delete painting
                    </MenuItem>
                </Menu>
            </div>}
        </div>
    );
};

export default PaintingTileHeader;