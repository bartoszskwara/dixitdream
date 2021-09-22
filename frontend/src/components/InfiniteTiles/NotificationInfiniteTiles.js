import React, {useContext, useEffect, useState} from "react";
import {ThemeContext} from "components/themes";
import {makeStyles} from "@material-ui/core/styles";
import InfiniteTiles from "components/InfiniteTiles/InfiniteTiles";
import cn from "classnames";
import {useHistory} from "react-router";
import Avatar from "@material-ui/core/Avatar";
import {NotificationsContext} from "../contexts";
import {Typography} from "@material-ui/core";
import {Api, apiCall} from "../../api/Api";

const useStyles = makeStyles(() => ({
    container: {
        display: "flex",
        alignItems: "center",
        fontSize: 12,
        padding: "15px 15px",
        borderBottom: appTheme => `1px solid ${appTheme.colors.secondary700}`,
        width: "100%"
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
    avatar: {
        width: 40,
        height: 40,
        border: appTheme => `1px solid ${appTheme.colors.secondary700}`
    },
    content: {
        paddingLeft: 5
    },
    noResultsLabel: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12
    },
    isNew: {
        color: appTheme => `${appTheme.colors.secondary50}`
    },
    opacity: {
        opacity: 0.5
    }
}));

const getTargetUrl = (notification) => {
    switch (notification.type) {
        case "paintingLike":
            return `/painting/${notification.contextId}`;
        default:
            return null;
    }
};

const NotificationInfiniteTiles = ({ ...InfiniteTilesProps }) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const history = useHistory();
    const {items} = InfiniteTilesProps;
    const { setNotificationsContext } = useContext(NotificationsContext);

    const openNotification = async ({ notificationId }) => await apiCall(Api.openNotification, {pathParams: { notificationId }});

    const clickNotification = ({ notificationId, url }) => {
        history.push(url);
        setNotificationsContext(prev => ({ ...prev, visible: false }))
        const response = openNotification({ notificationId });
        if(!response.error) {
            const notification = items.find(i => i.id === notificationId);
            if(notification) {
                notification.new = false;
            }
        }
    }

    const tiles = [...items.map(i => {
        const url = getTargetUrl(i);
        return (
            <li key={i.id} onClick={url ? () => clickNotification({ notificationId: i.id, url }) : () => {}}>
                <div className={classes.container}>
                    <div>
                        <Avatar alt={i.contextId} src={i.avatarUrl} className={cn(classes.avatar, {[classes.opacity]: !i.new})} />
                    </div>
                    <div className={cn(classes.content, {[classes.isNew]: !i.new})}>
                        <div>
                            <Typography>{i.content}</Typography>
                        </div>
                        <div>
                            {new Date(i.datetime * 1000).toLocaleDateString('en-gb', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                                timeZone: 'utc'
                            })}
                        </div>
                    </div>
                </div>
            </li>
    )})];

    return <InfiniteTiles
        {...InfiniteTilesProps}
        tiles={tiles}
        tilesContainerClass={classes.tiles}
        noResultsLabel="No notifications"
        customClasses={{
            noResultsLabel: classes.noResultsLabel
        }}
    />;
};

export default NotificationInfiniteTiles;