import React, {useContext, useEffect, useState} from 'react'
import {AlertContext, UserContext} from "components/contexts";
import {ThemeContext} from "../themes";
import {makeStyles} from "@material-ui/core";
import CustomForm from "components/Input/CustomForm";
import Card from "components/Card/Card";

const useStyles = makeStyles({
    loginRoot: {
        width: "50vh",
        minWidth: "50vw"
    }
});

const Login = ({ }) => {
    const classes = useStyles(useContext(ThemeContext).theme);

    const { authenticate, authLoading, authError } = useContext(UserContext);
    const { setAlert } = useContext(AlertContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        console.log("ttt1", authError);
        if(authError) {
            console.log("ttt2");
            setAlert({
                message: "Incorrect credentials!",
                severity: "error",
                visible: true
            })
        }
    }, [authError]);

    const inputsData = [{
        id: "email",
        value: email,
        label: "Email",
        onChange: (val) => setEmail(val)
    }, {
        id: "password",
        type: "password",
        autoComplete: "current-password",
        value: password,
        label: "Password",
        onChange: (val) => setPassword(val)
    }];
    const buttonData = {
        disabled: authLoading,
        onClick: () => authenticate({ email, password }),
        label: authLoading ? "Loading..." : "Sign in"
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

export default Login;