import React, {useContext, useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {ThemeContext} from "../themes";
import Cropper from "react-easy-crop";
import Button from "components/Input/Button";
import Card from "components/Card/Card";
import Loader from "components/Loader/Loader";

const useStyles = makeStyles(theme => ({
    root: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
    },
    cropWrapper: {
        position: "relative",
        flex: 1
    },
    button: {
        marginTop: 10
    },
    errorText: {
        color: props => props.colors.error,
        fontSize: 10
    }
}));

const Crop = ({ fileBase64, onCropComplete, loading, error }) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const [crop, setCrop] = useState({
        x: 0,
        y: 0
    });
    const [cropArea, setCropArea] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [aspect, setAspect] = useState( 7/11);
    const [cropCompleted, setCropCompleted] = useState( false);

    useEffect(() => {
        if(cropCompleted) {
            onCropComplete(cropArea);
            setCropCompleted(false);
        }
    }, [cropCompleted])


    const onCropChange = (newCrop) => setCrop(newCrop);
    const onZoomChange = (zoom) => setZoom(zoom);
    const onCropSet = async (cropArea, cropAreaPixels) => setCropArea(cropAreaPixels);

    return (
        <div className={classes.root}>
            <Card>
                {!fileBase64 && <Loader /> }
                {fileBase64 && <>
                    <div className={classes.cropWrapper}>
                        <Cropper
                            image={fileBase64}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspect}
                            onCropChange={onCropChange}
                            onCropComplete={onCropSet}
                            onZoomChange={onZoomChange}
                            zoomSpeed={0.1}
                        />
                    </div>
                    {error && <div className={classes.errorText}>{error}</div>}
                    <Button
                        className={classes.button}
                        onClick={() => setCropCompleted(true)}
                        disabled={loading}
                    >
                        {loading ? <Loader /> : "CONTINUE"}
                    </Button>
                </>}
            </Card>
        </div>
    );
}

export default Crop;