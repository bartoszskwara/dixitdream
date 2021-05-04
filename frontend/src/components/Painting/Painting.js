import React, {useContext, useEffect, useState} from "react";
import {ThemeContext} from "components/themes";
import {makeStyles} from "@material-ui/core/styles";
import {useParams} from "react-router";
import PaintingTile from "./PaintingTile";
import {Api, apiCall} from "../../api/Api";
import Loader from "components/Loader/Loader";
import NotFound from "components/NotFound/NotFound";
import Tags from "components/Tags/Tags";
import Card from "components/Card/Card";
import {PaintingContext} from "../contexts";
import PaintingDetailsEditor from "./PaintingDetailsEditor";

const useStyles = makeStyles(theme => ({
    paintingRoot: {
        overflow: "auto",
        flex: 1
    },
    painting: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
    },
    paintingWrapper: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        maxWidth: "40vh",
    },
    paintingEditor: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1
    },
    paintingEditorWrapper: {
        maxWidth: "60vh",
        width: "100%"
    },
    paintingContainer: {
        minWidth: "38vh"
    },
    paintingTile: {
        width: "100%",
        border: "none",
        padding: 0,
        margin: 0
    },
    bottomContent: {
        flex: 1,
        marginTop: 5,
        width: "100%",
        paddingTop: 10
    },
    title: {
        fontSize: 20
    },
    description: {
        fontSize: 12
    },
    wrapper: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        flex: 1
    },
    tags: {
        marginTop: 10
    },
    challenge: {
        marginBottom: 5
    }
}));

const Painting = () => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const { paintingId } = useParams();
    const [painting, setPainting]  = useState(null);
    const [loading, setLoading]  = useState(false);
    const [error, setError]  = useState(false);
    const [editMode, setEditMode]  = useState(false);
    const [titleEdit, setTitleEdit] = useState(null);
    const [tagsEdit, setTagsEdit] = useState(null);
    const [descriptionEdit, setDescriptionEdit] = useState(null);
    const [editError, setEditError] = useState({
        file: false
    });

    const fetchPainting = async (paintingId) => {
        setLoading(true);
        const data = await apiCall(Api.getPainting, { pathParams: { paintingId } });
        if(data.error) {
            setError(data.error);
            setLoading(false);
        } else {
            setPainting(data);
            setTitleEdit(data.title);
            setTagsEdit(data.tags.map(t => ({ label: t })));
            setDescriptionEdit(data.description);
            setLoading(false);
            markPaintingAsVisited();
        }
    }

    const markPaintingAsVisited = async () => {
        const data = await apiCall(Api.markPaintingAsVisited, { pathParams: { id: paintingId } });
        if(!data.error) {
            setPainting(p => ({
                ...p,
                visits: data.newVisit ? p.visits + 1 : p.visits
            }));
        }
    }

    const updatePainting = async () => {
        const postData = {
            title: titleEdit,
            tags: tagsEdit.map(t => t.label),
            description: descriptionEdit
        };
        const response = await apiCall(Api.updatePainting, { pathParams: { id: paintingId }, postData });
        if(!response.error) {
            setPainting(p => ({
                ...p,
                title: titleEdit,
                tags: tagsEdit.map(t => t.label),
                description: descriptionEdit
            }))
            setEditMode(false);
        }
    }

    useEffect(() => {
        if(paintingId) {
            fetchPainting(paintingId);
        }
    }, [paintingId]);

    const tags = painting ? painting.tags.map(t => ({ label: t })) : [];

    return (
        <PaintingContext.Provider value={{
            paintingContext: painting,
            setPaintingContext: setPainting
        }} >
            <div className={classes.paintingRoot}>
                {loading && <Loader />}
                {error && <NotFound />}
                {(!loading && painting) && <>
                    {!editMode && <div className={classes.painting}>
                        <Card>
                            <div className={classes.paintingWrapper}>
                                <div className={classes.paintingContainer}>
                                    <PaintingTile
                                        className={classes.paintingTile}
                                        avatarVariant="outside"
                                        showOptions
                                        editable={painting.editable}
                                        setEditMode={setEditMode}
                                    />
                                </div>
                                <div className={classes.bottomContent}>
                                    {painting.challenge && <p className={classes.challenge}>{painting.challenge.name.toUpperCase()}</p>}
                                    <p className={classes.title}>{painting.title}</p>
                                    <p className={classes.description}>{painting.description}</p>
                                    <Tags className={classes.tags} tags={tags} disabled={true} />
                                </div>
                            </div>
                        </Card>
                    </div>}
                    {editMode && <div className={classes.paintingEditor}>
                        <div className={classes.paintingEditorWrapper}>
                            <Card>
                                <PaintingDetailsEditor
                                    title={titleEdit}
                                    setTitle={setTitleEdit}
                                    tags={tagsEdit}
                                    setTags={setTagsEdit}
                                    description={descriptionEdit}
                                    setDescription={setDescriptionEdit}
                                    paintingUrl={painting.url}
                                    error={editError}
                                    setError={setEditError}
                                    onAction={updatePainting}
                                    actionButtonLabel={"SAVE"}
                                    showPreview={true}
                                />
                            </Card>
                        </div>
                    </div>}
                </>}
            </div>
        </PaintingContext.Provider>
    )
};

export default Painting;