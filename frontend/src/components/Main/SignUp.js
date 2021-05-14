import React, {useContext, useEffect, useState} from 'react'
import {AlertContext, UserContext} from "components/contexts";
import {ThemeContext} from "../themes";
import {makeStyles} from "@material-ui/core";
import CustomForm from "components/Input/CustomForm";
import Card from "components/Card/Card";
import Loader from "components/Loader/Loader";
import {Api, apiCall} from "../../api/Api";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";

const useStyles = makeStyles({
    loginRoot: {
        width: "50vh",
        minWidth: "50vw"
    }
});
const passwordRules = {
    TOO_SHORT: /(?=.{8,})/,
    TOO_LONG: /^.{0,30}$/,
    INSUFFICIENT_LOWERCASE: /(?=.*[a-z])/,
    INSUFFICIENT_UPPERCASE: /(?=.*[A-Z])/,
    INSUFFICIENT_DIGIT: /(?=.*[0-9])/,
    INSUFFICIENT_SPECIAL: /(?=.*[!@#$%^&*])/
};

const findPasswordErrors = (password) => (
    Object.keys(passwordRules).reduce((result, currentRule) => (
        [...result, ...(!passwordRules[currentRule].test(password) ? [currentRule] : [])]
    ), [])
);

const getPasswordErrorMessage = (passwordErrors) => {
    return <span>{"Please follow the password rules:"}<br/>
        {passwordErrors.includes("TOO_SHORT") && <span>&bull; At least 8 characters long<br/></span>}
        {passwordErrors.includes("TOO_LONG") && <span>&bull; Maximum 30 characters long<br/></span>}
        {passwordErrors.includes("INSUFFICIENT_LOWERCASE") && <span>&bull; At least 1 lowercase letter<br/></span>}
        {passwordErrors.includes("INSUFFICIENT_UPPERCASE") && <span>&bull; At least 1 capital letter<br/></span>}
        {passwordErrors.includes("INSUFFICIENT_DIGIT") && <span>&bull; At least 1 digit<br/></span>}
        {passwordErrors.includes("INSUFFICIENT_SPECIAL") && <span>&bull; At least 1 special character<br/></span>}
    </span>;
}

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const isUsernameValid = (name) => (name && name.length >= 3);
const isEmailValid = (mail) => (emailRegex.test(String(mail).toLowerCase()));

const SignUp = ({ }) => {
    const classes = useStyles(useContext(ThemeContext).theme);

    const { authenticate, authLoading, authError, setAuthError } = useContext(UserContext);
    const { setAlert } = useContext(AlertContext);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [registered, setRegistered] = useState(false);
    const [error, setError] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false);

    useEffect(() => {
        setAuthError(false);
    }, []);

    useEffect(() => {
        if(registered && authError) {
            setAlert({
                message: "Incorrect credentials!",
                severity: "error",
                visible: true
            })
        } else {
            setAlert({
                visible: false
            });
        }
    }, [authError]);

    const signUp = async ({ username, email, password }) => {
        setLoading(true);
        const response = await apiCall(Api.signUp, { postData: { username, email, password }});
        if(!response.fieldErrors) {
            setRegistered(true);
            authenticate({ email, password });
        } else {
            setError({
                password: response.fieldErrors.password ? JSON.parse(response.fieldErrors.password) : [],
                username: response.fieldErrors.username,
                email: !!response.fieldErrors.email
            });
        }
        setLoading(false);
    }

    const checkIfUserExists = async ({ username, email }) => {
        const response = await apiCall(Api.checkIfUserExists, { postData: { username, email }});
        if(!response.error) {
            setError(err => ({
                ...err,
                username: response.username ? "Given username already exists." : err.username,
                email: response.email ? "Given email already exists." : err.email
            }));
        }
    }

    const passwordVisibilityIcon = <InputAdornment position="end">
        <IconButton
            aria-label="toggle password visibility"
            onClick={() => setPasswordVisible(visible => !visible)}
        >
            {passwordVisible ? <Visibility /> : <VisibilityOff />}
        </IconButton>
    </InputAdornment>;

    const validateUsername = (name) => {
        let errorText = null;
        if(isUsernameValid(name)) {
            checkIfUserExists({ username: name });
        } else {
            errorText = "Username should be at least 3 characters long.";
        }
        setError(e => ({
            ...e,
            username: errorText
        }));
    }
    const validateEmail = (mail) => {
        let errorText = null;
        if(isEmailValid(mail)) {
            checkIfUserExists({ email: mail });
        } else {
            errorText = "Email is incorrect.";
        }
        setError(e => ({
            ...e,
            email: errorText
        }));
    }
    const validatePassword = (pass) => {
        setError(e => ({
            ...e,
            password: findPasswordErrors(pass)
        }));
    }

    const inputsData = [{
        id: "username",
        value: username,
        label: "Username",
        onChange: (val) => setUsername(val),
        onBlur: () => validateUsername(username),
        error: !!error.username,
        helperText: error.username
    }, {
        id: "email",
        value: email,
        label: "Email",
        onChange: (val) => setEmail(val),
        onBlur: () => validateEmail(email),
        error: !!error.email,
        helperText: error.email
    }, {
        id: "password",
        type: passwordVisible ? "text" : "password",
        autoComplete: "current-password",
        value: password,
        label: "Password",
        onChange: (val) => setPassword(val),
        onBlur: () => validatePassword(password),
        error: error.password && error.password.length > 0,
        helperText: error.password && error.password.length ? getPasswordErrorMessage(error.password) : null,
        endAdornment: passwordVisibilityIcon
    }];

    const buttonData = {
        disabled: loading || authLoading || !!error.username || (error.password && error.password.length > 0) || !!error.email,
        onClick: () => signUp({ username, email, password }),
        label: (loading || authLoading) ? <Loader /> : "Sign up"
    };

    return (
        <div className={classes.loginRoot}>
            <Card>
                <CustomForm
                    inputsData={inputsData}
                    buttonData={buttonData}
                />
            </Card>
        </div>
    );
}

export default SignUp;