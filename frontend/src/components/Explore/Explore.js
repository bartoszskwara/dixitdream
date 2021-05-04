import React, {useContext, useState} from "react";
import {ThemeContext} from "components/themes";
import {makeStyles} from "@material-ui/core/styles";
import SearchIcon from '@material-ui/icons/Search';
import InfiniteTiles from "components/Painting/InfiniteTiles";
import TagsInput from "components/Tags/TagsInput";
import useDebounce from "hooks/useDebounce";
import {Api, apiCall} from "api/Api";

const useStyles = makeStyles(theme => ({
    explore: {
        flex: 1,
        padding: 10,
        overflow: "auto"
    }
}));

const LIMIT = 4;

const Explore = ({}) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const [searchFilter, setSearchFilter] = useState({
        query: "",
        tags: []
    });
    const [shouldFetchMore, setShouldFetchMore] = useState(true);
    const [error, setError] = useState(null);
    const [paintings, setPaintings] = useState([]);
    const [paintingsLoading, setPaintingsLoading] = useState(false);
    const searchFilterDebounced = useDebounce(searchFilter, 300);

    const onTagAdded = (tag) => {
        setSearchFilter(filter => ({
            query: "",
            tags: [...filter.tags, { label: tag.trim() }]
        }));
    };

    const onTagDelete = (tag) => setSearchFilter(filter => ({
        ...filter,
        tags: filter.tags.filter(i => i.label !== tag)
    }));

    const fetchPaintings = async ({ query, tags, next = false, lastPaintingId }) => {
        setPaintingsLoading(true);
        const data = await apiCall(Api.getPaintings, {
            postData: {
                ...(query ? { query } : {} ),
                ...(tags && tags.length ? { tags: tags.map(t => t.label) } : {}),
                limit: LIMIT,
                ...(next && lastPaintingId ? { lastPaintingId } : {} )
            }
        });
        if (!data.error) {
            setPaintings(next ? items => ([...items, ...data.content]) : data.content);
            setShouldFetchMore(data.content.length === LIMIT);
        } else {
            setError(data.error);
        }
        setPaintingsLoading(false);
    };

    return <div id="explore-root" className={classes.explore}>
        <TagsInput
            tags={searchFilter.tags}
            onTagAdded={onTagAdded}
            onTagDelete={onTagDelete}
            position="bottom"
            onInputChange={(event) => setSearchFilter(filter => ({ ...filter, query: event.target.value }))}
            inputAdornmentIcon={<SearchIcon />}
        />
        <InfiniteTiles
            items={paintings}
            hasMore={shouldFetchMore && !error}
            error={error}
            scrollTarget="explore-root"
            filter={searchFilterDebounced}
            fetchPaintings={fetchPaintings}
            loading={paintingsLoading}
        />
    </div>;
};

export default Explore;