import React, {useContext, useEffect, useState} from "react";
import {ThemeContext} from "components/themes";
import {makeStyles} from "@material-ui/core/styles";
import cn from "classnames";
import {Chip} from "@material-ui/core";
import AutocompleteWithChips from "../Input/AutocompleteWithChips";
import {Api, apiCall} from "../../api/Api";
import useDebounce from "../../hooks/useDebounce";
import {Autocomplete} from "@material-ui/lab";

const useStyles = makeStyles(theme => ({
    suggestion: {
        display: "flex",
        width: "100%",
        justifyContent: "space-between"
    },
    suggestionCount: {
        color: props => props.colors.primary100,
        marginRight: 10
    }
}));
const LIMIT = 6;

const TagsInput = ({ className, label, tags, onTagAdded, onTagDelete, onBlur, error, disabled, position, onInputChange, inputAdornmentIcon, setInputRef }) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const [tagsInputValue, setTagsInputValue] = useState("");
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [shouldFetchMore, setShouldFetchMore] = useState(true);
    const query = useDebounce(tagsInputValue, 300);

    useEffect(() => {
        if(query) {
            fetchTags({ query });
        } else {
            setOptions([]);
        }
    }, [query]);

    useEffect(() => {
        if (page) {
            const lastTag = options.length ? options[options.length - 1] : undefined;
            const lastCount = lastTag ? lastTag.count : undefined;
            const lastName = lastTag ? lastTag.name : undefined;
            fetchTags({ query, next: true, lastCount, lastName });
        }
    }, [page]);

    const onTagInputChange = (event) => {
        setTagsInputValue(event.target.value);
        if(onInputChange) {
            onInputChange(event);
        }
    };

    const fetchTags = async ({ query, next = false, lastCount, lastName }) => {
        setLoading(true);
        const data = await apiCall(Api.getTags, {
            urlParams: {
                ...(query ? { query } : {} ),
                limit: LIMIT,
                ...(next ? { lastCount, lastName } : {} ),
            }
        });
        if (!data.error) {
            setOptions(next ? items => ([...items, ...data.content]) : data.content);
            setShouldFetchMore(data.content.length === LIMIT);
        }
        setLoading(false);
    };

    return <div className={cn(classes.tags, className)}>
        <AutocompleteWithChips
            id="tags"
            label={label}
            inputValue={tagsInputValue}
            options={options}
            selectedOption={selectedOption}
            tags={tags}
            loading={loading}
            error={error}
            disabled={disabled}
            onTagAdded={(label) => {
                if (!label || tags.some(c => c.label === label)) {
                    return;
                }
                setTagsInputValue("");
                setSelectedOption(null);
                if(onTagAdded) {
                    onTagAdded(label);
                }
            }}
            onTagDelete={onTagDelete}
            onInputChange={onTagInputChange}
            onBlur={() => {
                setLoading(false);
                if(onBlur) {
                    onBlur();
                }
            }}
            position={position}
            inputAdornmentIcon={inputAdornmentIcon}
            loadMore={() => setPage(p => (p + 1))}
            shouldFetchMore={shouldFetchMore}
            renderOption={(option) =>
                (<div className={classes.suggestion}>
                    <div>{option.name}</div>
                    <div className={classes.suggestionCount}>{option.count}</div>
                </div>)
            }
            setInputRef={setInputRef}
        />
    </div>;
};

export default TagsInput;