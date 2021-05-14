import React, {useContext} from 'react'
import {ThemeContext} from 'components/themes'
import {makeStyles} from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import Button from "components/Input/Button";

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

const CustomForm = ({ inputsData = [], buttonData }) => {
    const classes = useStyles(useContext(ThemeContext).theme);

    return (<div className={classes.paintingEditor}>
        <form className={classes.form} noValidate autoComplete="off">
            {inputsData.map(input => {
                if(input.custom) {
                    return input.component;
                }
                return (
                    <TextField
                        id={input.id}
                        key={input.id}
                        type={input.type}
                        autoComplete={input.autoComplete}
                        value={input.value}
                        onChange={(event) => input.onChange(event.target.value)}
                        onBlur={input.onBlur}
                        label={input.label}
                        error={input.error}
                        helperText={input.helperText}
                        InputLabelProps={{
                            shrink: true,
                            disableAnimation: true
                        }}
                        InputProps={{
                            disableUnderline: true,
                            endAdornment: input.endAdornment
                        }}
                        className={classes.field}
                    />
                );
            })}
            {buttonData && <Button
                disabled={buttonData.disabled}
                className={classes.button}
                startIcon={buttonData.startIcon}
                onClick={buttonData.onClick}
            >
                {buttonData.label}
            </Button>}
        </form>
    </div>);
}

export default CustomForm;