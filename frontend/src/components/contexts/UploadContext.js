import React from 'react';

export default React.createContext({
    file: null,
    setFile: () => {},
    challengeData: {},
    setChallengeData: () => {},
    firstAttempt: true,
    setFirstAttempt: () => {},
    fileBase64: null,
    setFileBase64: () => {}
});