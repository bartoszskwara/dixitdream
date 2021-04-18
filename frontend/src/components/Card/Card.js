import React, {useContext, useEffect, useState} from 'react'
import { ThemeContext } from 'components/themes'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    cardWrapper: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: 10
    },
    cardRoot: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        justifyContent: "center",
        backgroundColor: appTheme => appTheme.colors.contrast500,
        border: appTheme => `1px solid ${appTheme.colors.primary700}`,
        borderRadius: 4,
        padding: 20,
    }
}));

const Card = ({ children }) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    return (
        <div className={classes.cardWrapper}>
            <div className={classes.cardRoot}>
                {children}
            </div>
        </div>
    );
}

export default Card;