import React, {useContext, useEffect, useState} from 'react'
import { ThemeContext } from 'components/themes'
import { makeStyles } from '@material-ui/core/styles';
import AlertContext from "components/contexts/AlertContext";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles(theme => ({
    alertRoot: {
        position: "absolute",
        zIndex: 1000,
        top: 10,
        left: 10,
        right: 10
    }
}));

const AlertWrapper = ({ className }) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const { severity, message, onClose, setAlert } = useContext(AlertContext);
    return (
        <Alert
            severity={severity}
            variant="filled"
            onClose={() => {
                if(onClose) {
                    onClose();
                }
                setAlert({
                    visible: false
                });
            }}
            classes={{
                root: classes.alertRoot
            }}
        >
            {message}
        </Alert>
    );
}

export default AlertWrapper;