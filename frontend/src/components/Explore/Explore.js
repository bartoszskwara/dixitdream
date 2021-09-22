import React, {useContext, useState} from "react";
import {ThemeContext} from "components/themes";
import {makeStyles} from "@material-ui/core/styles";
import SearchIcon from '@material-ui/icons/Search';
import { ItemsInfiniteList, PaintingInfiniteTiles, ChallengeInfiniteTiles } from "components/InfiniteTiles";
import TagsInput from "components/Tags/TagsInput";
import useDebounce from "hooks/useDebounce";
import {Api} from "api/Api";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import ImageIcon from '@material-ui/icons/Image';

const useStyles = makeStyles(theme => ({
    explore: {
        flex: 1,
        padding: 10,
        overflow: "auto"
    },
    tabs: {
        marginBottom: 10
    }
}));

const Explore = ({}) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const [searchFilter, setSearchFilter] = useState({
        query: "",
        tags: []
    });
    const [currentTab, setCurrentTab] = useState("paintings");
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

    return <div id="explore-root" className={classes.explore}>
        <TagsInput
            tags={searchFilter.tags}
            onTagAdded={onTagAdded}
            onTagDelete={onTagDelete}
            position="bottom"
            onInputChange={(event) => setSearchFilter(filter => ({ ...filter, query: event.target.value }))}
            inputAdornmentIcon={<SearchIcon />}
        />
        <Tabs
            className={classes.tabs}
            value={currentTab}
            onChange={(event, tab) => setCurrentTab(tab)}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            aria-label="tabs"
        >
            <Tab value="paintings" icon={<ImageIcon />} />
            <Tab value="challenges" icon={<TrackChangesIcon />} />
        </Tabs>
        {currentTab === "paintings" && <ItemsInfiniteList
            component={<PaintingInfiniteTiles />}
            searchFilter={searchFilterDebounced}
            apiData={Api.getPaintings}
            requestParamName="postData"
            lastIdFieldName="lastPaintingId"
            scrollTarget="explore-root"
        />}
        {currentTab === "challenges" && <ItemsInfiniteList
            component={<ChallengeInfiniteTiles />}
            searchFilter={searchFilterDebounced}
            apiData={Api.getChallenges}
            requestParamName="urlParams"
            lastIdFieldName="lastChallengeId"
            scrollTarget="explore-root"
        />}

    </div>;
};

export default Explore;