import React, {useContext, useEffect, useState } from 'react'
import { ThemeContext } from 'components/themes'
import { makeStyles } from '@material-ui/core/styles';
import { UploadContext, UserContext, AlertContext } from "components/contexts";
import Dropzone from "components/Dashboard/ChallengeUpload/Dropzone";
import {Api, apiCall} from "../../api/Api";
import {useHistory} from "react-router";
import Crop from "./Crop";
import Card from "components/Card/Card";
import {getCroppedImg} from "./cropImage";
import PaintingDetailsEditor from "components/Painting/PaintingDetailsEditor";

const useStyles = makeStyles(theme => ({
    flexContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
        maxWidth: "60vh"
    }
}));

const MAX_FILE_SIZE = process.env.REACT_APP_MAX_FILE_SIZE || 5242880;

const UploadForm = () => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const { file, setFile, challengeData, setChallengeData, firstAttempt, setFirstAttempt, fileBase64, setFileBase64 } = useContext(UploadContext);
    const { refresh } = useContext(UserContext);
    const { setAlert } = useContext(AlertContext);
    const [entryCropData, setEntryCropData] = useState(undefined);
    const [croppedFileBase64, setCroppedFileBase64] = useState(null);
    const [showDropzone, setShowDropzone] = useState(false);
    const [showCrop, setShowCrop] = useState(false);
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState([]);
    const [description, setDescription] = useState("");
    const [cropLoading, setCropLoading] = useState(false);
    const [error, setError] = useState({
        file: file ? "" : undefined
    });
    const history = useHistory();

    useEffect(() => {
        return () => {
            setFile(null)
            setChallengeData({});
            setFirstAttempt(true);
            setFileBase64(null);
        }
    }, [setFile, setFirstAttempt])

    useEffect(() => {
        setShowDropzone(!file);
        setShowCrop(!!file);
    }, [file]);

    const uploadPainting = async () => {
        const data = {
            ...(challengeData.challengeId ? { challengeId: challengeData.challengeId } : {}),
            title,
            tags: tags.map(t => t.label),
            description,
            file: await fetch(croppedFileBase64).then((res) => res.blob())
        };
        const response = await apiCall(Api.uploadPainting, { postData: data, isFormData: true });
        if(!response.error) {
            refresh();
            history.push(`/painting/${response.id}`);
            setAlert({
                message: "Painting added successfully!",
                severity: "success",
                visible: true
            })
        } else {
            setAlert({
                message: response.error,
                severity: "error",
                visible: true
            })
        }
    }

    const onCropComplete = async (crop) => {
        setCropLoading(true);
        const newImage = await getCroppedImg(fileBase64, crop);
        const y = newImage.endsWith("==") ? 2 : 1;
        const cropFileSize = (newImage.length * (3/4)) - y;
        if(cropFileSize > MAX_FILE_SIZE) {
            setError(err => ({
                ...err,
                file: `Cropped file size is too big: ${Math.round((cropFileSize / 1024 / 1024) * 100) / 100} MB`
            }));
            setCropLoading(false);
        } else {
            setError(err => ({
                ...err,
                file: ""
            }));
            setCroppedFileBase64(newImage);
            setShowCrop(false);
            setCropLoading(false);
        }
    }

    const validateFile = (file, errorCode) => {
        let errorText = "";
        if (errorCode === "file-too-large") {
            errorText = `File size is too big: ${Math.round((file.size / 1024 / 1024) * 100) / 100} MB`;
        } else if (!file) {
            errorText = "Please upload a file";
        }
        setError(err => ({
            ...err,
            file: errorText
        }));
    }

    const onPaintingPreviewDelete = () => {
        setFile(null);
        setFileBase64(null);
        setEntryCropData(undefined);
        setCroppedFileBase64(null);
        validateFile();
    };

    const handleCropCancel = () => {
        setShowCrop(false);
        setFile(file && !croppedFileBase64 ? null : file);
        validateFile(file && !croppedFileBase64 ? null : file);
    };

    return (<div className={classes.flexContainer}>
        {showCrop && <Crop
            fileBase64={fileBase64}
            onCropComplete={onCropComplete}
            loading={cropLoading}
            error={error.file}
            onCancel={handleCropCancel}
            entryCropData={entryCropData}
            setEntryCropData={setEntryCropData}
        />}
        {!showCrop && <Card>
            <div className={classes.flexContainer}>
                {showDropzone && <Dropzone
                    error={error.file}
                    validateFile={validateFile}
                />}
                {!firstAttempt && <PaintingDetailsEditor
                    title={title}
                    setTitle={setTitle}
                    tags={tags}
                    setTags={setTags}
                    description={description}
                    setDescription={setDescription}
                    fileBase64={croppedFileBase64}
                    error={error}
                    setError={setError}
                    onAction={uploadPainting}
                    onPaintingPreviewDelete={onPaintingPreviewDelete}
                    onPaintingPreviewClick={() => setShowCrop(true)}
                    actionButtonLabel={"UPLOAD PAINTING"}
                    challengeData={challengeData}
                    showPreview={!showDropzone}
                />}
            </div>
        </Card>}
    </div>);
}

export default UploadForm;