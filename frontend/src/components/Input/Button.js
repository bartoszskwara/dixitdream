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
    },
    containedSecondary: {
        backgroundColor: props => props.colors.secondary50,
        "&:hover": {
            backgroundColor: props => props.colors.secondary50
        }
    },
    smallRoot: {
        fontSize: 15
    },
    largeRoot: {
        fontSize: 25
    },
    defaultRoot: {
        fontSize: 20
    }
}));

const ButtonWrapper = ({ children, className, variant = "contained", color = "primary", onClick, disabled, startIcon, size }) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const rootClass = size === "small" ? classes.smallRoot : size === "large" ? classes.largeRoot : classes.defaultRoot;
    return (
        <Button
            className={className}
            variant={variant}
            color={color}
            onClick={onClick}
            disabled={disabled}
            classes={{
                root: rootClass,
                containedPrimary: classes.containedPrimary,
                containedSecondary: classes.containedSecondary
            }}
            startIcon={startIcon}
        >
           {children}
        </Button>
    )
};

export default ButtonWrapper;