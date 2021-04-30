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

const Crop = ({ fileBase64, onCropComplete, loading, error, onCancel, entryCropData, setEntryCropData }) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const [crop, setCrop] = useState(entryCropData ? entryCropData.crop : { x: 0, y: 0 });
    const [cropArea, setCropArea] = useState(null);
    const [zoom, setZoom] = useState(entryCropData ? entryCropData.zoom : 1);
    const [cropCompleted, setCropCompleted] = useState( false);

    useEffect(() => {
        if(cropCompleted) {
            onCropComplete(cropArea);
            setEntryCropData({
                zoom,
                crop
            });
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
                            aspect={7/11}
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
                    <Button
                        color="secondary"
                        className={classes.button}
                        onClick={onCancel}
                    >
                        {"CANCEL"}
                    </Button>
                </>}
            </Card>
        </div>
    );
}

export default Crop;