import React, {useState} from 'react';
import { useHistory } from "react-router-dom";
import { compose } from 'recompose';

import "@babel/polyfill";
import {
    AUTH_MESSAGE,
    withAuthCallback,
    withIsomorphicState,
    withRequest
} from "infrastructure-components";


const Login = ({useIsomorphicState, request, authCallback, ...props}:any) => {

    const history = useHistory();
    const [credentials, setCredentials] = useState({email: "", password: ""});
    const [message,  setMessage] = useIsomorphicState(
        "loginmessage",
        request && request.query ? request.query.message : undefined
    );

    if (message === AUTH_MESSAGE.SUCCESS || message === AUTH_MESSAGE.MAILVERIFIED){
        history.push("/secret");
    }

    return (
    <React.Fragment>
        <input
            value={credentials.email}
            type="text"
            placeholder='Please enter your e-mail address'
            onChange={event => setCredentials({email: event.target.value, password: credentials.password})}
        />
        <input
            value={credentials.password}
            type="password"
            placeholder='enter your password'
            onChange={event => setCredentials({email: credentials.email, password: event.target.value})}
        />
        <button
            disabled={ !(/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/.test(credentials.email)) }
            onClick={()=> authCallback(
                credentials.email, credentials.password, "/secret", err => console.log("error: ", err)
        )}>Login</button>
    </React.Fragment>
    )
};


const enhance = compose(
    withIsomorphicState,
    withRequest,
    withAuthCallback
  )(Login);
  
  export default enhance;