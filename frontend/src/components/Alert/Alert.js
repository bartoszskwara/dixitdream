import React, {useContext, useEffect} from 'react'
import { ThemeContext } from 'components/themes'
import { makeStyles } from '@material-ui/core/styles';
import { AlertContext } from "components/contexts";
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

const AlertWrapper = ({}) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const { severity, message, onClose, setAlert } = useContext(AlertContext);

    useEffect(() => {
        const timout = severity === "success" ? setTimeout(() => {
            closeAlert();
        }, 3000) : undefined;
        return severity === "success" ? () => clearTimeout(timout) : () => {};
    }, []);

    const closeAlert = () => {
        if(onClose) {
            onClose();
        }
        setAlert({
            visible: false
        });
    };

    return (
        <Alert
            severity={severity}
            variant="filled"
            onClose={closeAlert}
            classes={{
                root: classes.alertRoot
            }}
        >
            {message}
        </Alert>
    );
}

export default AlertWrapper;