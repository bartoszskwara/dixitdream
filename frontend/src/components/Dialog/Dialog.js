import React, {useContext} from 'react'
import {ThemeContext} from 'components/themes'
import {makeStyles} from '@material-ui/core/styles';
import {DialogContext} from "components/contexts";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";
import Button from "components/Input/Button";

const useStyles = makeStyles(theme => ({
    dialogRoot: {

    },
    actions: {
        padding: "0 20px 10px 0"
    }
}));

const AlertWrapper = ({}) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const { open, title, message, onCancel, onConfirm, setDialog } = useContext(DialogContext);

    const close = () => {
        setDialog({ open: false });
    }

    const handleCancel = () => {
        close();
        if(onCancel) {
            onCancel();
        }
    }

    const handleConfirm = () => {
        close();
        if(onConfirm) {
            onConfirm();
        }
    }

    return (
        <Dialog
            open={open}
            onClose={close}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            {message && <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>}
            <DialogActions className={classes.actions}>
                <Button size="small" autoFocus onClick={handleCancel} color="warning">
                    Cancel
                </Button>
                <Button size="small" onClick={handleConfirm} color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AlertWrapper;