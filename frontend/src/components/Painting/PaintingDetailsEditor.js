import React, {useContext, useEffect, useState } from 'react'
import { ThemeContext } from 'components/themes'
import { makeStyles } from '@material-ui/core/styles';
import PaintingPreview from "components/Painting/PaintingPreview";
import TextField from "@material-ui/core/TextField";
import Button from "components/Input/Button";
import { ReactComponent as PhotoUploadIcon } from "assets/images/photo-upload.svg";
import TagsInput from "components/Tags/TagsInput";

const useStyles = makeStyles(theme => ({
    paintingEditor: {
        flex: 1,
        display: "flex",
        flexDirection: "column"
    },
    form: {
        display: "flex",
        flexDirection: "column"
    },
    field: {
        margin: "10px 0"
    },
    icon: {
        width: 30,
        height: 30
    },
    button: {
        marginTop: 30
    }
}));

const PaintingDetailsEditor = ({title, setTitle, tags, setTags, description, setDescription, error, setError,
    file, fileBase64, challengeData, onAction, showPreview, onPaintingPreviewDelete, actionButtonLabel }) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const [saveDisabled, setSaveDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [tagsInputRef, setTagsInputRef] = useState(null);

    useEffect(() => {
        if(challengeData && challengeData.tags) {
            setTags(challengeData.tags.map(t => ({ label: t })));
            setError(err => ({
                ...err,
                tags: ""
            }));
        }
    }, [challengeData]);

    useEffect(() => {
        if(error.title === undefined || error.tags === undefined || error.file === undefined || error.title || error.tags || error.file ) {
            setSaveDisabled(true);
        } else {
            setSaveDisabled(false);
        }
    }, [error]);

    useEffect(() => {
        if(tagsInputRef) {
            tagsInputRef.focus();
        }
    }, [tags]);

    const validate = {
        title: () => {
            setTitle(currentTitle => {
                setError(err => ({
                    ...err,
                    title: !currentTitle || !currentTitle.trim() ? "Please provide a title" : ""
                }))
                return currentTitle;
            })
        },
        tags: () => {
            setTags(currentTags => {
                setError(err => ({
                    ...err,
                    tags: !currentTags || !currentTags.length ? "Please provide at least one tag" : ""
                }))
                return currentTags;
            })
        }
    };

    const onTagAdded = (tag) => setTags(items => [...items, { label: tag.trim() }]);
    const onTagDelete = (tag) => {
        setTags(items => items.filter(i => i.label !== tag));
        validate.tags();
    }

    const handleAction = async () => {
        setSaveDisabled(true);
        setLoading(true);
        await onAction();
        setLoading(false);
        setSaveDisabled(false);
    }

    const preview = (file && fileBase64) ? <div key={file.name}>
        <PaintingPreview
            fileBase64={fileBase64}
            onDelete={onPaintingPreviewDelete}
            error={error.file}
        />
    </div> : [];

    return (<div className={classes.paintingEditor}>
        {showPreview && preview}
        <form className={classes.form} noValidate autoComplete="off">
            <TextField
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                onBlur={validate.title}
                label="Title"
                error={!!error.title}
                helperText={error.title}
                InputLabelProps={{
                    shrink: true,
                    disableAnimation: true
                }}
                InputProps={{
                    disableUnderline: true
                }}
                className={classes.field}
            />
            <TagsInput
                label="Tags"
                className={classes.field}
                tags={tags}
                onTagAdded={onTagAdded}
                onTagDelete={onTagDelete}
                onBlur={() => validate.tags()}
                error={error.tags}
                disabled={challengeData && challengeData.disabled}
                setInputRef={(input) => setTagsInputRef(input)}
            />
            <TextField
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                label="Description"
                InputLabelProps={{
                    shrink: true,
                    disableAnimation: true
                }}
                InputProps={{
                    disableUnderline: true
                }}
                className={classes.field}
            />
            <Button
                disabled={saveDisabled}
                className={classes.button}
                startIcon={<PhotoUploadIcon className={classes.icon} />}
                onClick={handleAction}
            >
                {!loading && <>{actionButtonLabel}</>}
                {loading && <>LOADING...</>}
            </Button>
        </form>
    </div>);
}

export default PaintingDetailsEditor;