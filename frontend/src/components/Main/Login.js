import React, {useContext, useEffect, useState} from 'react'
import {AlertContext, UserContext} from "components/contexts";
import {ThemeContext} from "../themes";
import {makeStyles} from "@material-ui/core";
import CustomForm from "components/Input/CustomForm";
import Card from "components/Card/Card";
import Loader from "components/Loader/Loader";

const useStyles = makeStyles({
    loginRoot: {
        width: "50vh",
        minWidth: "50vw"
    }
});

const Login = ({ }) => {
    const classes = useStyles(useContext(ThemeContext).theme);

    const { authenticate, authLoading, authError, setAuthError } = useContext(UserContext);
    const { setAlert } = useContext(AlertContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        setAuthError(false);
    }, []);

    useEffect(() => {
        if(authError) {
            setAlert({
                message: "Incorrect credentials!",
                severity: "error",
                visible: true
            });
        } else {
            setAlert({
                visible: false
            });
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
        label: authLoading ? <Loader /> : "Sign in"
    };

    return (
        <div className={classes.loginRoot}>
            <Card>
                <CustomForm
                    inputsData={inputsData}
                    buttonData={buttonData}
                />
                <div onClick={() => { 
                    console.log('click event');
                    window.gtag("event", "view_item", {
                      currency: "USD",
                      value: 7.77,
                      items: [
                        {
                          item_id: "SKU_12345",
                          item_name: "Stan and Friends Tee"
                        }
                      ]
                    });
                }}>Test event</div>
            </Card>
        </div>
    );
}

export default Login;
