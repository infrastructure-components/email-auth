import React, {useState} from 'react';
import { useHistory } from "react-router-dom";
import "@babel/polyfill";
import {
    AUTH_MESSAGE,
    Authentication,
    AuthenticationProvider,
    DataLayer,
    Environment,
    Identity,
    IsomorphicApp,
    Route,
    SecuredRoute,
    userLogout,
    WebApp,
    withAuthCallback,
    withIsomorphicState,
    withRequest
} from "infrastructure-components";

const SENDER_EMAIL = "mail@react-architect.com";

const LoginPage = withIsomorphicState(withRequest(withAuthCallback(({useIsomorphicState, request, authCallback, ...props}) => {

    const history = useHistory();
    const [credentials, setCredentials] = useState({email: "", password: ""});
    const [message,  setMessage] = useIsomorphicState(
        "loginmessage",
        request && request.query ? request.query.message : undefined
    );

    if (message === AUTH_MESSAGE.SUCCESS || message === AUTH_MESSAGE.MAILVERIFIED){
        history.push("/secret");
    }

    return <div>
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
    </div>
})));

const SecretPage = (props) => {
    return <div>
        I know all about Area 51! Secure me!
        <button onClick={()=> userLogout("/login")}>Logout</button>
    </div>
};

export default (
    <IsomorphicApp
        stackName = "email-auth"
        buildPath = 'build'
        region='eu-west-1'
        assetsPath = 'assets'
        iamRoleStatements={[{
            "Effect": "Allow",
            "Action": ['"ses:SendEmail"', '"ses:SendRawEmail"',],
            "Resource": `"arn:aws:ses:eu-west-1:xxxxxxxxxxxx:identity/${SENDER_EMAIL}"`,
    }]}>
        <Environment name="dev" />
        <DataLayer id="datalayer">
            <Identity >
                <Authentication
                    id="emailauth"
                    provider={AuthenticationProvider.EMAIL}
                    loginUrl="/login"
                    callbackUrl="/authentication"
                    senderEmail={SENDER_EMAIL}
                    getSubject={(recipient: string) => `Confirm Your Mail-Address`}
                    getHtmlText={(recipient: string, url: string) => {
                        return `Hello ${recipient},<br/>
Please verify your e-mail address by following <a href="${url}">this link</a></p>`
                }}>
                    <WebApp id="main" path="*" method="GET">
                        <SecuredRoute path='/secret' name='Secret' render={()=><SecretPage />} />
                        <Route path='/login' name='Login' render={()=><LoginPage />} />
                    </WebApp>
                </Authentication>
            </Identity>
        </DataLayer>
    </IsomorphicApp>
);