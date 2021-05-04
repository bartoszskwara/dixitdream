import React, {useContext} from 'react'
import PropTypes from "prop-types";
import {ThemeContext} from 'components/themes'
import {makeStyles} from '@material-ui/core/styles';
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import cn from "classnames";
import Tags from "components/Tags/Tags";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex"
    },
    icon: {
        color: props => props.colors.primary50,
        width: 30,
        height: 30
    },
    tagsContainer: {
        margin: "5px 0"
    }
}));

const TextFieldWithChips = ({ id, value, setValue, chips, setChips, validate = () => {}, error, label,
disabled, className, position = "top", inputAdornmentIcon }) => {
    const classes = useStyles(useContext(ThemeContext).theme);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && value && ! chips.some(c => c.label === value)) {
            setChips(items => [...items, {
                label: value.trim()
            }]);
            setValue("");
            validate();
        }
    };

    return (
        <div className={cn(classes.root, className)} >
            <FormControl
                error={!!error}
                disabled={disabled}
                onKeyDown={handleKeyDown}
            >
                {label && <InputLabel
                    id={`${id}-label`}
                    error={!!error}
                    shrink
                    htmlFor={id}
                    disableAnimation
                >
                    {label}
                </InputLabel>}
                {position === "top" && <Tags
                    tags={chips}
                    setTags={setChips}
                    validate={validate}
                    disabled={disabled}
                />}
                {!disabled && <Input
                    error={!!error}
                    disabled={disabled}
                    disableUnderline
                    id={id}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    aria-describedby={`${id}-text`}
                    onBlur={() => validate()}
                    startAdornment={
                        inputAdornmentIcon ?
                            <InputAdornment position="start">
                                {React.cloneElement(inputAdornmentIcon, { className: cn(inputAdornmentIcon.props.className, classes.icon) } )}
                            </InputAdornment> :
                            undefined
                    }
                />}
                {position === "bottom" && <Tags
                    className={classes.tagsContainer}
                    tags={chips}
                    setTags={setChips}
                    validate={validate}
                    disabled={disabled}
                />}
                {error && <FormHelperText id={`${id}-text`}>{error}</FormHelperText>}
            </FormControl>
        </div>
    );
}
TextFieldWithChips.propTypes = {
    position: PropTypes.oneOf(["top", "bottom"])
}
export default TextFieldWithChips;