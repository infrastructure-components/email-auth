import React, {useState} from 'react';

import "@babel/polyfill";
import {
    userLogout
} from "infrastructure-components";


const SecretPage = ({...props}) => {
    return (
    <React.Fragment>
        I know all about Area 51! Secure me!
        <button onClick={()=> userLogout("/login")}>Logout</button>
    </React.Fragment>
    )
};

export default SecretPage;