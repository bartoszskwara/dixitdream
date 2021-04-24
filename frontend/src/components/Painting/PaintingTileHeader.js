import React, {useContext, useEffect, useState} from "react";
import {ThemeContext} from "components/themes";
import {makeStyles} from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import cn from "classnames";
import {useHistory} from "react-router";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {Divider, ListItemIcon, ListItemText, Menu, MenuItem} from "@material-ui/core";
import {Api, apiCall} from "../../api/Api";
import { AlertContext, GlobalLoadingContext, DialogContext } from "components/contexts";
import ShareIcon from '@material-ui/icons/Share';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

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
    },
    optionIcon: {
        cursor: "pointer"
    }
}));

const PaintingTileHeader = ({ paintingId, author, avatar, avatarVariant, showOptions, editable }) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteError, setDeleteError] = useState(undefined);
    const { setGlobalLoading } = useContext(GlobalLoadingContext);
    const { setAlert } = useContext(AlertContext);
    const { setDialog } = useContext(DialogContext);

    useEffect(() => {
        if(deleteSuccess) {
            history.push(`/profile/${author.id}`);
        }
        if(deleteError) {
            setAlert({
                message: deleteError,
                severity: "error",
                visible: true
            });
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
    };

    const confirmDeletePainting = () => {
        setDialog({
            open: true,
            title: "ARE YOU SURE?",
            message: "After confirmation, the image will be deleted permanently.",
            onConfirm: () => deletePainting()
        });
    };

    const menuItemsConfig = [{
        label: "Share",
        icon: <ShareIcon />,
        onClick: () => console.log("Sharing...")
    }, ...(editable ? [{
        divider: true
    },{
        label: "Edit",
        icon: <EditIcon />,
        onClick: () => console.log("Editing...")
    }, {
        label: "Delete",
        icon: <DeleteIcon />,
        onClick: () => confirmDeletePainting()
    }] : [] )
    ];

    const menuItems = menuItemsConfig.map(item => {
       if(item.divider) {
           return <Divider />;
       } else {
           return <MenuItem
               onClick={() => {
                   if (item.onClick) {
                       item.onClick();
                   }
                   closeMenu();
               }}
           >
               {item.icon && <ListItemIcon>
                   {React.cloneElement(item.icon, { fontSize: "small" }) }
               </ListItemIcon>}
               <ListItemText primary={item.label} />
           </MenuItem>;
       }
    });

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
                    className={classes.optionIcon}
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
                    autoFocus={false}
                >
                    {menuItems}
                </Menu>
            </div>}
        </div>
    );
};

export default PaintingTileHeader;