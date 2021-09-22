import React, {useContext} from 'react'
import {ThemeContext} from 'components/themes';
import {makeStyles} from '@material-ui/core/styles';
import {useDropzone} from 'react-dropzone'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {SettingsContext, UploadContext} from "components/contexts";
import Loader from "components/Loader/Loader";
import cn from "classnames";

const useStyles = makeStyles(theme => ({
    root: {
        background: props => props.colors.contrast500,
        flex: 1,
        display: "flex",
        flexDirection: "column"
    },
    info: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%"
    },
    dropArea: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        width: "100%",
        border: props => `1px dashed ${props.colors.secondary100}`,
        "&:focus": {
            outline: props => `${props.colors.contrast500} solid 1px !important`,
        }
    },
    error: {
        border: props => `2px dashed ${props.colors.error}`,
        padding: 19
    },
    errorText: {
        color: props => props.colors.error,
        fontSize: 10
    },
    uploadIcon: {
        width: 40,
        height: 40,
        margin: "10px 0"
    },
    uploadInfo: {
        marginTop: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    uploadInfoDragText: {
        fontSize: 14,
        marginBottom: 20
    },
    uploadInfoText: {
        fontSize: 10
    }
}));

const convertFileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        resolve(event.target.result)
    };
    reader.readAsDataURL(file);
})

const UploadInfo = ({ classes, extensions, ratio, maxSize }) => (
    <div className={classes.uploadInfo} >
        {extensions && <div className={classes.uploadInfoText}>Allowed extensions: {extensions.join(", ")}</div>}
        {ratio && <div className={classes.uploadInfoText}>Max painting ratio: {ratio}</div>}
        {maxSize && <div className={classes.uploadInfoText}>Max file size: {maxSize.size}{maxSize.unit}</div>}
    </div>
);

const Dropzone = ({ children, disabled = false, error = false, onFilesUpload = () => {}, validateFile = () => {} }) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const { loading, uploadInfo } = useContext(SettingsContext);
    const { setFile, setFirstAttempt, setFileBase64 } = useContext(UploadContext);

    const {getRootProps, getInputProps } = useDropzone({
        accept: ["image/jpeg", "image/png"],
        maxFiles: 1,
        onDropAccepted: (acceptedFiles) => {
            setFile(acceptedFiles[0]);
            setFirstAttempt(false);
            convertFileToBase64(acceptedFiles[0])
                .then(base64 => setFileBase64(base64));
            onFilesUpload();
        },
        onDropRejected: (fileRejections) => {
            validateFile(fileRejections[0].file, fileRejections[0].errors[0].code);
        },
        disabled,
        validator: validateFile,
        onFileDialogCancel: () => {}
    });

    return (
        <div className={classes.root}>
            <div className={cn(classes.dropArea, { [classes.error]: !!error })} {...getRootProps({})}>
                <input {...getInputProps()} />
                <div className={classes.info}>
                    {children}
                    {!disabled && <>
                        <CloudUploadIcon className={classes.uploadIcon}/>
                        <div  className={classes.uploadInfoDragText}>
                            Choose a file or drag it here
                        </div>
                        {loading && <Loader />}
                        {(!loading && uploadInfo) && <UploadInfo
                            classes={classes}
                            extensions={uploadInfo.extensions}
                            ratio={uploadInfo.ratio}
                            maxSize={uploadInfo.maxSize}
                        />}
                    </>}
                </div>
            </div>
            {error && <div className={classes.errorText}>{error}</div>}
        </div>
    );
}

export default Dropzone;