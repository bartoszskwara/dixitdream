import React, {useContext, useEffect, useState} from 'react'
import { ThemeContext } from 'components/themes'
import { makeStyles } from '@material-ui/core/styles';
import UploadContext from "../contexts/UploadContext";
import PaintingPreview from "./PaintingPreview";
import TextField from "@material-ui/core/TextField";
import Dropzone from "../Dashboard/ChallengeUpload/Dropzone";
import Button from "components/Input/Button";
import { ReactComponent as PhotoUploadIcon } from "assets/images/photo-upload.svg";
import TagsInput from "../Tags/TagsInput";
import {Api, apiCall} from "../../api/Api";
import {useHistory} from "react-router";
import UserContext from "../contexts/UserContext";
import Crop from "./Crop";
import Card from "components/Card/Card";
import {getCroppedImg} from "./cropImage";

const useStyles = makeStyles(theme => ({
    uploadForm: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: "100%"
    },
    form: {
        display: "flex",
        flexDirection: "column"
    },
    field: {
        margin: "10px 0"
    },
    icon: {
        width: 30,
        height: 30
    },
    button: {
        marginTop: 30
    }
}));

const MAX_FILE_SIZE = process.env.REACT_APP_MAX_FILE_SIZE || 5242880;

const UploadForm = () => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const { file, setFile, challengeData, setChallengeData, firstAttempt, setFirstAttempt, fileBase64, setFileBase64 } = useContext(UploadContext);
    const { refresh } = useContext(UserContext);
    const [showDropzone, setShowDropzone] = useState(false);
    const [showCrop, setShowCrop] = useState(false);
    const [saveDisabled, setSaveDisabled] = useState(true);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [cropLoading, setCropLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState([]);
    const [description, setDescription] = useState("");
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
        if(challengeData && challengeData.tags) {
            setTags(challengeData.tags.map(t => ({ label: t })));
            setError(err => ({
                ...err,
                tags: ""
            }));
        }
    }, [challengeData]);

    useEffect(() => {
        setShowDropzone(!file);
        setShowCrop(!!file);
    }, [file]);

    useEffect(() => {
        if(error.title === undefined || error.tags === undefined || error.file === undefined || error.title || error.tags || error.file) {
            setSaveDisabled(true);
        } else {
            setSaveDisabled(false);
        }
    }, [error]);


    const validate = {
        title: () => {
            setTitle(currentTitle => {
                setError(err => ({
                    ...err,
                    title: !currentTitle || !currentTitle.trim() ? "Please provide a title" : ""
                }))
                return currentTitle;
            })
        },
        tags: () => {
            setTags(currentTags => {
                setError(err => ({
                    ...err,
                    tags: !currentTags || !currentTags.length ? "Please provide at least one tag" : ""
                }))
                return currentTags;
            })
        },
        file: (file, errorCode) => {
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
    };

    const onTagAdded = (tag) => setTags(items => [...items, { label: tag.trim() }]);
    const onTagDelete = (tag) => {
        setTags(items => items.filter(i => i.label !== tag));
        validate.tags();
    }

    const uploadPainting = async () => {
        setSaveDisabled(true);
        setUploadLoading(true);

        const data = {
            ...(challengeData.challengeId ? { challengeId: challengeData.challengeId } : {}),
            title,
            tags: tags.map(t => t.label),
            description,
            file: await fetch(fileBase64).then((res) => res.blob())
        };
        await apiCall(Api.uploadPainting, { postData: data, isFormData: true })
            .then(() => refresh());
        history.push("");
        setUploadLoading(false);
        setSaveDisabled(false);
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
            setFileBase64(newImage);
            setShowCrop(false);
            setCropLoading(false);
        }
    }

    const preview = (file && fileBase64) ? <div key={file.name}>
        <PaintingPreview
            file={file}
            fileBase64={fileBase64}
            onDelete={() => {
                setFile(null);
                setFileBase64(null);
                validate.file();
            }}
            error={error.file}
        />
    </div> : [];

    return (<div className={classes.uploadForm}>
        {showCrop && <Crop
            fileBase64={fileBase64}
            onCropComplete={onCropComplete}
            loading={cropLoading}
            error={error.file}
        />}
        {!showCrop && <Card>
            <div className={classes.uploadForm}>
                {showDropzone && <Dropzone
                    error={error.file}
                    validateFile={validate.file}
                />}
                {!showDropzone && preview}
                {!firstAttempt && <form className={classes.form} noValidate autoComplete="off">
                    <TextField
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        onBlur={validate.title}
                        label="Title"
                        error={!!error.title}
                        helperText={error.title}
                        InputLabelProps={{
                            shrink: true,
                            disableAnimation: true
                        }}
                        InputProps={{
                            disableUnderline: true
                        }}
                        className={classes.field}
                    />
                    <TagsInput
                        label="Tags"
                        className={classes.field}
                        tags={tags}
                        onTagAdded={onTagAdded}
                        onTagDelete={onTagDelete}
                        onBlur={() => validate.tags()}
                        error={error.tags}
                        disabled={challengeData && challengeData.disabled}
                    />
                    <TextField
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        label="Description"
                        InputLabelProps={{
                            shrink: true,
                            disableAnimation: true
                        }}
                        InputProps={{
                            disableUnderline: true
                        }}
                        className={classes.field}
                    />
                    <Button
                        disabled={saveDisabled}
                        className={classes.button}
                        startIcon={<PhotoUploadIcon className={classes.icon} />}
                        onClick={uploadPainting}
                    >
                        {!uploadLoading && <>UPLOAD PAINTING</>}
                        {uploadLoading && <>LOADING...</>}
                    </Button>
                </form>}
            </div>
        </Card>}
    </div>);
}

export default UploadForm;