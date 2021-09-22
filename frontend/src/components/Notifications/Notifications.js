import React, {useContext, useEffect, useState} from 'react'
import {ThemeContext} from 'components/themes'
import {makeStyles} from '@material-ui/core/styles';
import {Api, apiCall} from "../../api/Api";
import { ItemsInfiniteList, NotificationInfiniteTiles } from "../InfiniteTiles";
import {Backdrop, ClickAwayListener} from "@material-ui/core";
import {NotificationsContext} from "../contexts";

const useStyles = makeStyles(theme => ({
    root: {
        minWidth: 300,
        backgroundColor: "white",
        position: "absolute",
        left: 50,
        right: 0,
        top: 0,
        bottom: 0,
        boxShadow: theme => `0px 0px 10px 0px ${theme.colors.secondary100}`,
    },
    backdrop: {
        zIndex: 1000,
        position: "absolute"
    }
}));

const ClickAwayWrapper = ({ children, withClickAway, onClickAway }) => (
    withClickAway ?
        <ClickAwayListener onClickAway={onClickAway}>
            {children}
        </ClickAwayListener> : children
);

const Notifications = () => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [notifications, setNotifications] = useState(false);
    const { visible: notificationsVisible, setNotificationsContext } = useContext(NotificationsContext);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        const data = await apiCall(Api.getNotifications);
        if(!data.error) {
            setNotifications(data.content);
            setLoading(false);
        } else {
            setLoading(false);
            setError("Couldn't load new notifications.");
        }
    }

    const onClickAway = (e) => {
        e.preventDefault();
        setNotificationsContext(prev => ({ ...prev, visible: false }))
    }

    return (
        <Backdrop className={classes.backdrop} open={notificationsVisible}>
            <ClickAwayWrapper withClickAway={notificationsVisible} onClickAway={onClickAway}>
                <div className={classes.root}>
                    <ItemsInfiniteList
                        component={<NotificationInfiniteTiles />}
                        apiData={Api.getNotifications}
                        requestParamName="urlParams"
                        lastIdFieldName="lastNotificationId"
                        scrollTarget="notifications-root"
                    />
                </div>
            </ClickAwayWrapper>
        </Backdrop>
    );
}

export default Notifications;