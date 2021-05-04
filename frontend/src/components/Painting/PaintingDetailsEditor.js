import React, {useContext, useEffect, useState} from 'react'
import {ThemeContext} from 'components/themes'
import {makeStyles} from '@material-ui/core/styles';
import PaintingPreview from "components/Painting/PaintingPreview";
import {ReactComponent as PhotoUploadIcon} from "assets/images/photo-upload.svg";
import TagsInput from "components/Tags/TagsInput";
import CustomForm from "../Input/CustomForm";
import {GlobalLoadingContext} from "../contexts";

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
    fileBase64, paintingUrl, challengeData, onAction, showPreview, onPaintingPreviewDelete, onPaintingPreviewClick, actionButtonLabel }) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const [saveDisabled, setSaveDisabled] = useState(true);
    const [tagsInputRef, setTagsInputRef] = useState(null);
    const { setGlobalLoading } = useContext(GlobalLoadingContext);

    useEffect(() => {
        if(title) {
            validate.title();
        }
        if(tags && tags.length) {
            validate.tags();
        }
    }, []);

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

    const onTagAdded = (tag) => {
        setTags(items => [...items, { label: tag.trim() }]);
        if(tagsInputRef) {
            tagsInputRef.focus();
        }
    }
    const onTagDelete = (tag) => {
        setTags(items => items.filter(i => i.label !== tag));
        validate.tags();
        if(tagsInputRef) {
            tagsInputRef.focus();
        }
    }

    const handleAction = async () => {
        setSaveDisabled(true);
        setGlobalLoading(true);
        await onAction();
        setGlobalLoading(false);
        setSaveDisabled(false);
    }

    const preview = (fileBase64 || paintingUrl) ? <div>
        <PaintingPreview
            onClick={onPaintingPreviewClick}
            fileBase64={fileBase64}
            src={paintingUrl}
            onDelete={onPaintingPreviewDelete}
            error={error.file}
        />
    </div> : [];

    const inputsData = [{
        id: "title",
        value: title,
        label: "Title",
        onChange: (val) => setTitle(val),
        onBlur: validate.title,
        error: !!error.title,
        helperText: error.title
    }, {
        custom: true,
        component: <TagsInput
            key="tags"
            label="Tags"
            className={classes.field}
            tags={tags}
            onTagAdded={onTagAdded}
            onTagDelete={onTagDelete}
            onBlur={() => validate.tags()}
            error={error.tags}
            setInputRef={(input) => setTagsInputRef(input)}
        />
    }, {
        id: "description",
        value: description,
        label: "Description",
        onChange: (val) => setDescription(val)
    }];
    const buttonData = {
        disabled: saveDisabled,
        onClick: () => handleAction(),
        label: actionButtonLabel,
        startIcon: <PhotoUploadIcon className={classes.icon} />
};

    return (<div className={classes.paintingEditor}>
        {showPreview && preview}
        <CustomForm
            inputsData={inputsData}
            buttonData={buttonData}
        />
    </div>);
}

export default PaintingDetailsEditor;