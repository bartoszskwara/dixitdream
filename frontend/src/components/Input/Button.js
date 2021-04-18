import React, {useContext} from "react";
import {ThemeContext} from "components/themes";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
    root: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    containedPrimary: {
        backgroundColor: props => props.colors.accent,
        "&:hover": {
            backgroundColor: props => props.colors.accent
        }
    }
}));

const ButtonWrapper = ({ children, className, variant = "contained", color = "primary", onClick, disabled, startIcon }) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    return (
        <Button
            className={className}
            variant={variant}
            color={color}
            onClick={onClick}
            disabled={disabled}
            classes={{
                containedPrimary: classes.containedPrimary
            }}
            startIcon={startIcon}
        >
           {children}
        </Button>
    )
};

export default ButtonWrapper;