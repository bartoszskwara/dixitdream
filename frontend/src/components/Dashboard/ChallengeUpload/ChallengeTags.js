import React from "react";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles({
    tags: {
        fontSize: 30
    },
    divider: {
        padding: 5
    }
});

const ChallengeTags = ({ tags }) => {
    const classes = useStyles();
    return (
        <div className={classes.tags}>{
            tags && tags.length ?
                tags.map(word => {
                    const wordUpper = word.toUpperCase();
                    if (tags.indexOf(word) !== tags.length - 1) {
                        return (
                            <span key={word}>
                            <span>{wordUpper}</span>
                            <span className={classes.divider}>&#8226;</span>
                        </span>
                        )
                    } else {
                        return <span key={word}>{wordUpper}</span>
                    }
                }) : null
        }</div>
    );
}

export default ChallengeTags;