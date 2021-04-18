import React, {useCallback, useContext, useEffect, useState} from "react";
import {ThemeContext} from "components/themes";
import {makeStyles} from "@material-ui/core/styles";
import SearchIcon from '@material-ui/icons/Search';
import Tiles from "components/Painting/Tiles";
import TagsInput from "../Tags/TagsInput";
import useDebounce from "../../hooks/useDebounce";
import {Api, apiCall} from "../../api/Api";

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
    const [page, setPage] = useState(0);
    const [shouldFetchMore, setShouldFetchMore] = useState(true);
    const [error, setError] = useState(false);
    const [paintings, setPaintings] = useState([]);
    const [lastFetchedPaintingId, setLastFetchedPaintingId] = useState(undefined);
    const searchFilterDebounced = useDebounce(searchFilter, 300);

    useEffect(() => {
        fetchPaintings({ query: searchFilterDebounced.query, tags: searchFilterDebounced.tags });
    }, [searchFilterDebounced]);

    useEffect(() => {
        if (lastFetchedPaintingId > 0 && paintings.length) {
            const lastPaintingId = paintings.length ? paintings[paintings.length - 1].id : undefined;
            fetchPaintings({ query: searchFilterDebounced.query, tags: searchFilterDebounced.tags, next: true, lastPaintingId });
        } else {
            fetchPaintings({ query: searchFilterDebounced.query, tags: searchFilterDebounced.tags });
        }
    }, [lastFetchedPaintingId]);

    useEffect(() => {
        if (page > 0 && paintings.length) {
            setLastFetchedPaintingId(paintings[paintings.length - 1].id);
        } else {
            setLastFetchedPaintingId(undefined);
        }
    }, [page]);

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
        const data = await apiCall(Api.getPaintings, {
            postData: {
                ...(query ? { query } : {} ),
                ...(tags && tags.length ? { tags: tags.map(t => t.label) } : {}),
                limit: LIMIT,
                ...(next && lastPaintingId ? { lastPaintingId } : {} )
            }
        });
        if (data) {
            setPaintings(next ? items => ([...items, ...data.content]) : data.content);
            setShouldFetchMore(data.content.length === LIMIT);
        } else {
            setError(true);
        }
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
        <Tiles
            items={paintings}
            fetchMore={() => setPage(p => (p + 1))}
            refresh={() => setPage(0)}
            hasMore={shouldFetchMore && !error}
            error={error}
            scrollTarget="explore-root"
        />
    </div>;
};

export default Explore;