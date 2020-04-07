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

import SecretPage from './views/SecretPage'
import Login from './views/Login'

const SENDER_EMAIL = "mail@react-architect.com";

export default (
    <IsomorphicApp
        stackName = "email-auth"
        buildPath = 'build'
        region='us-east-1'
        assetsPath = 'assets'>
        <Environment name="dev"/>
        <DataLayer id="datalayer">
            <Identity>
                <Authentication
                    id="emailauth"
                    provider={AuthenticationProvider.EMAIL}
                    loginUrl="/login"
                    callbackUrl="/authentication">
                    <WebApp id="main" path="*" method="GET">
                        <SecuredRoute path='/secret' name='Secret' render={()=><SecretPage />} />
                        {/* BUG: Only works when Route path at root '/' exists, suggest using base Route component from react-router-dom */}
                        <Route
                            path='/'
                            name='Login'
                            render={() => <Login/>}
                        />
                    </WebApp>
                </Authentication>
            </Identity>
        </DataLayer>
    </IsomorphicApp>
);