import React, {useState} from "react";
import {apiCall} from "api/Api";

const ItemsInfiniteList = ({ component, searchFilter, lastIdFieldName, apiData, requestParamName, LIMIT = 4, scrollTarget }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [shouldFetchMore, setShouldFetchMore] = useState(true);
    const [error, setError] = useState(null);

    const fetchItems = async ({ query, tags, next = false, lastId }) => {
        setLoading(true);
        const data = await apiCall(apiData, {
            [requestParamName]: {
                ...(query ? { query } : {} ),
                ...(tags && tags.length ? { tags: tags.map(t => t.label) } : {}),
                limit: LIMIT,
                ...(next && lastId ? { [lastIdFieldName]: lastId } : {} )
            }
        });
        if (!data.error) {
            setItems(next ? items => ([...items, ...data.content]) : data.content);
            setShouldFetchMore(data.content.length === LIMIT);
        } else {
            setError(data.error);
        }
        setLoading(false);
    };

    return React.cloneElement(component, {
        items,
        hasMore: shouldFetchMore && !error,
        error,
        scrollTarget,
        filter: searchFilter,
        fetchItems,
        loading
    });
}

export default ItemsInfiniteList;