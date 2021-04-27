import React, {useContext, useEffect, useState} from "react";
import Loader from "../Loader/Loader";
import {makeStyles} from "@material-ui/core/styles";
import {ThemeContext} from "../themes";
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from "@material-ui/core/IconButton";
import cn from "classnames";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center"
    },
    name: {
        fontSize: 16,
        marginTop: 10
    },
    preview: {
        width: 70,
        height: 110,
    },
    container: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        padding: 10,
        border: props => `1px solid ${props.colors.primary500}`,
        borderRadius: 4
    },
    error: {
        border: props => `1px solid ${props.colors.error}`
    },
    box: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        padding: 10,
        flex: 1
    }
}));

const PaintingPreview = ({ fileBase64, src, onDelete, error }) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (fileBase64) {
            setPreview(fileBase64);
        } else if (src) {
            setPreview(src)
        }
    }, [fileBase64, src]);

    return (
        <div className={classes.root}>
            {!preview && <Loader />}
            {preview &&
                <>
                    <div className={classes.box}>
                    </div>
                    <div className={cn(classes.container, { [classes.error]: error } )} >
                        <img alt="preview" src={preview} className={classes.preview} />
                    </div>
                    <div className={classes.box}>
                        {onDelete && <IconButton onClick={onDelete}>
                            <DeleteIcon />
                        </IconButton>}
                    </div>
                </>
            }
        </div>
    );
};

export default PaintingPreview;