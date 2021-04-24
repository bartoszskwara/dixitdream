import React, {useContext, useEffect, useState} from 'react'
import PropTypes from "prop-types";
import { ThemeContext } from 'components/themes'
import { makeStyles } from '@material-ui/core/styles';
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import cn from "classnames";
import Tags from "../Tags/Tags";
import {TextField} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
import Loader from "../Loader/Loader";

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
    },
    loader: {
        color: props => props.colors.primary500
    }
}));

const AutocompleteWithChips = ({ id, inputValue, tags, onTagDelete, onTagAdded, error, label, selectedOption,
disabled, className, position = "top", inputAdornmentIcon, options, loading, onInputChange, onBlur, loadMore, shouldFetchMore,
renderOption, setInputRef }) => {
    const classes = useStyles(useContext(ThemeContext).theme);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (options && options.length) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [options]);

    useEffect(() => {
        if (loading) {
            setOpen(false);
        }
    }, [loading]);

    return (
        <div className={cn(classes.root, className)} >
            <FormControl
                error={!!error}
                disabled={disabled}
            >
                {label && <InputLabel
                    id={`${id}-label`}
                    error={!!error}
                    shrink
                    htmlFor={`${id}-autocomplete`}
                    disableAnimation
                >
                    {label}
                </InputLabel>}
                {position === "top" && <Tags
                    tags={tags}
                    onTagDelete={onTagDelete}
                    disabled={disabled}
                />}
                {!disabled && <Autocomplete
                    id={`${id}-autocomplete`}
                    freeSolo
                    disableClearable
                    open={loading ? false : open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    value={selectedOption}
                    inputValue={inputValue}
                    renderOption={renderOption}
                    getOptionLabel={(option) => option.name ? option.name : option}
                    options={options}
                    loading={loading}
                    loadingText={<Loader />}
                    onChange={(data, newValue) => onTagAdded(newValue.name || newValue)}
                    onBlur={onBlur}
                    blurOnSelect={true}
                    ListboxProps={{
                        onScroll: (event) => {
                            const listboxNode = event.currentTarget;
                            if (shouldFetchMore && listboxNode.scrollTop + listboxNode.clientHeight === listboxNode.scrollHeight) {
                                loadMore();
                            }
                        }
                    }}
                    renderInput={(params) => {
                        return (
                            <TextField
                                {...params}
                                id={`${id}-input`}
                                inputRef={setInputRef}
                                error={!!error}
                                disabled={disabled}
                                onChange={onInputChange}
                                onFocus={() => setOpen(true)}
                                InputProps={{
                                    ...params.InputProps,
                                    disableUnderline: true,
                                    startAdornment:
                                        inputAdornmentIcon ?
                                            <InputAdornment position="start">
                                                {React.cloneElement(inputAdornmentIcon, { className: cn(inputAdornmentIcon.props.className, classes.icon) } )}
                                            </InputAdornment>
                                        : undefined,
                                    endAdornment: (
                                        <>
                                            {loading ? <Loader /> : null}
                                        </>
                                    ),
                                }}
                            />
                        )
                    }}
                />}
                {position === "bottom" && <Tags
                    className={classes.tagsContainer}
                    tags={tags}
                    onTagDelete={onTagDelete}
                    disabled={disabled}
                />}
                {error && <FormHelperText id={`${id}-text`}>{error}</FormHelperText>}
            </FormControl>
        </div>
    );
}
AutocompleteWithChips.propTypes = {
    position: PropTypes.oneOf(["top", "bottom"])
}
export default AutocompleteWithChips;