import React, {useContext} from "react";
import {ThemeContext} from "components/themes";
import {makeStyles} from "@material-ui/core/styles";
import cn from "classnames";
import {Chip} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    tags: {
        display: "flex",
        flexWrap: "wrap"
    },
    chip: {
        margin: "5px 5px 5px 0",
        border: props => `1px solid ${props.colors.primary500}`
    }
}));

const Tags = ({ tags, onTagDelete, disabled, className }) => {
    const classes = useStyles(useContext(ThemeContext).theme);

    return <div className={cn(classes.tags, className)}>
        {tags && tags.length > 0 ? tags.sort((t1, t2) => t1.label.toLowerCase().localeCompare(t2.label.toLowerCase()))
            .map(tag => <Chip
                key={tag.label}
                clickable={false}
                className={classes.chip}
                label={tag.label}
                onDelete={!disabled ? () => onTagDelete(tag.label) : undefined}
            />) : []}
    </div>;
};

export default Tags;