import React, {useState} from 'react'
import {UploadContext} from "components/contexts";

const UploadContextProvider = ({ children }) => {
    const [currentUploadFile, setCurrentUploadFile] = useState(null);
    const [currentUploadChallengeData, setCurrentUploadChallengeData] = useState({});
    const [currentUploadFirstAttempt, setCurrentUploadFirstAttempt] = useState(true);
    const [currentUploadFileBase64, setCurrentUploadFileBase64] = useState(null);
    const contextData = {
        file: currentUploadFile,
        setFile: setCurrentUploadFile,
        challengeData: currentUploadChallengeData,
        setChallengeData: setCurrentUploadChallengeData,
        firstAttempt: currentUploadFirstAttempt,
        setFirstAttempt: setCurrentUploadFirstAttempt,
        fileBase64: currentUploadFileBase64,
        setFileBase64: setCurrentUploadFileBase64
    };

    return <UploadContext.Provider value={contextData}>
        {children}
    </UploadContext.Provider>;
}

export default UploadContextProvider;