import React, {useContext, useState, useEffect} from 'react'
import { ThemeContext } from 'components/themes';
import { makeStyles } from '@material-ui/core/styles';
import Dropzone from "./Dropzone";
import Loader from "components/Loader/Loader";
import Countdown from "./Countdown";
import ChallengeTags from "./ChallengeTags";
import {useHistory} from "react-router";
import { UploadContext } from "../../contexts";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: appTheme => appTheme.colors.contrast500,
        border: appTheme => `1px solid ${appTheme.colors.primary700}`,
        borderRadius: 4,
        padding: "10px 20px",
        marginTop: 10
    },
    button: {
        marginTop: 10,
        fontSize: 20
    },
    buttonIcon: {
        width: 30,
        height: 30,
        fill: props => props.colors.contrast100
    },
    challengeName: {
        fontSize: 14,
        margin: "10px 0"
    },
    error: {
        textAlign: "center",
        color: props => props.colors.error
    }
}));

const ChallengeUpload = ({ loading, error, challenge }) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const [challengeEnded, setChallengeEnded] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const { setChallengeData } = useContext(UploadContext);
    const history = useHistory();

    const validateUpload = (file, errorCode) => {
        let errorText = "";
        if (errorCode === "file-too-large") {
            errorText = `File size is too big: ${Math.round((file.size / 1024 / 1024) * 100) / 100} MB`;
        } else {
            errorText = "Please upload a file";
        }
        setUploadError(errorText);
    };

    return (
        <div className={classes.root}>
            {loading && <Loader />}
            {error && <div className={classes.error}>{error}</div>}
            {(!loading && !error) && <>
                <Dropzone
                    disabled={challengeEnded}
                    onFilesUpload={() => {
                        setChallengeData({
                            challengeId: challenge.id,
                            disabled: true,
                            tags: [...challenge.tags]
                        });
                        history.push("/upload");
                    }}
                    error={uploadError}
                    validateFile={validateUpload}
                >
                    {challenge && <>
                        <ChallengeTags classes={classes} tags={challenge.tags} />
                        {challenge.name && <div className={classes.challengeName}>{challenge.name.toUpperCase()}</div>}
                        {!challengeEnded && <Countdown
                            endDate={challenge.endDate}
                            setChallengeEnded={setChallengeEnded}
                        />}
                        {challengeEnded && <div>Challenge ended</div>}
                    </>}
                </Dropzone>
            </>}
        </div>
    );
};

export default ChallengeUpload;