import React from 'react';

export const AlertContext = React.createContext({});
export const DialogContext = React.createContext({});
export const NotificationsContext = React.createContext({
    visible: false,
    setNotificationsContext: () => {}
});
export const GlobalLoadingContext = React.createContext({
    globalLoading: false,
    setGlobalLoading: () => {}
});
export const PaintingContext = React.createContext({
    paintingContext: {},
    setPaintingContext: () => {}
});
export const SettingsContext = React.createContext({
    loading: false,
    uploadInfo: {}
});
export const UploadContext = React.createContext({
    file: null,
    setFile: () => {},
    challengeData: {},
    setChallengeData: () => {},
    firstAttempt: true,
    setFirstAttempt: () => {},
    fileBase64: null,
    setFileBase64: () => {}
});
export const UserContext = React.createContext({
    loading: false,
    authenticated: false,
    authenticate: () => {}
});