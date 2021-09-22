import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import cn from "classnames";

const useStyles = makeStyles({
    tags: {
        fontSize: 30,
        textAlign: "center",
        maxWidth: "100%"
    },
    divider: {
        padding: 5
    }
});

const ChallengeTags = ({ classes = {}, tags, divider }) => {
    const styles = useStyles();
    return (
        <span className={cn(classes.root, styles.tags)}>{
            tags && tags.length ?
                tags.map(word => {
                    const wordUpper = word.toUpperCase();
                    if (tags.indexOf(word) !== tags.length - 1) {
                        return (
                            <span key={word}>
                                <span>{wordUpper}</span>
                                {divider ? divider : <br/>}
                            </span>
                        )
                    } else {
                        return <span key={word}>{wordUpper}</span>
                    }
                }) : null
        }</span>
    );
}

export default ChallengeTags;