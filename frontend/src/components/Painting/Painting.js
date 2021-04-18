import React, {useContext, useEffect, useState} from "react";
import {ThemeContext} from "components/themes";
import {makeStyles} from "@material-ui/core/styles";
import {useParams} from "react-router";
import PaintingTile from "./PaintingTile";
import {Api, apiCall} from "../../api/Api";
import Loader from "../Loader/Loader";
import NotFound from "../NotFound/NotFound";
import Tags from "../Tags/Tags";
import Card from "../Card/Card";

const useStyles = makeStyles(theme => ({
    paintingRoot: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        flex: 1,
        overflow: "auto",
    },
    paintingContainer: {
        maxWidth: "40vh",
        minWidth: "38vh"
    },
    paintingTile: {
        width: "100%"
    },
    bottomContent: {
        flex: 1
    },
    title: {
        fontSize: 20
    },
    description: {
        fontSize: 12
    }
}));

const Painting = () => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const { paintingId } = useParams();
    const [painting, setPainting]  = useState(false);
    const [loading, setLoading]  = useState(false);
    const [error, setError]  = useState(false);

    const fetchPainting = async (paintingId) => {
        setLoading(true);
        const data = await apiCall(Api.getPainting, { pathParams: { paintingId } });
        if(data.error) {
            setError(data.error);
            setLoading(false);
        } else {
            setPainting(data);
            setLoading(false);
        }
    }

    useEffect(() => {
        if(paintingId) {
            fetchPainting(paintingId);
        }
    }, [paintingId]);

    const tags = painting ? painting.tags.map(t => ({ label: t })) : [];

    return <div className={classes.paintingRoot}>
        {loading && <Loader />}
        {error && <NotFound />}
        {(!loading && painting) && <Card>
            <div className={classes.paintingContainer}>
                <PaintingTile
                    className={classes.paintingTile}
                    author={painting.profile.username}
                    id={painting.id}
                    src={painting.url}
                    avatar={painting.avatar}
                    avatarVariant="outside"
                    likes={painting.likes || 0}
                    visits={painting.visits || 0}
                    liked={painting.liked || false}
                />
            </div>
            <div className={classes.bottomContent}>
                <Tags tags={tags} disabled={true} />
                <p className={classes.title}>{painting.title}</p>
                <p className={classes.description}>{painting.description}</p>
            </div>
        </Card>}
    </div>;
};

export default Painting;