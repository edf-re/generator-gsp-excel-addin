/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */

import axios, { AxiosResponse } from "axios";
import jwtDecode, { JwtPayload } from "jwt-decode";
import moment from "moment";
import { container } from "../container";
import { ISettings } from "../types/interfaces/settings.interface";
import { documentWrapper } from "./document-wrapper";
import { setElementStyle } from "./html-helpers";


let loginDialog;


function showLogin() {
    setElementStyle('loginPanel', 'block');
    setElementStyle('ButtonPanel', 'none');
}

 function hideLogin() {
    setElementStyle('loginPanel', 'none');
    setElementStyle('ButtonPanel', 'flex');
}


function ssoDialogOpen() {
    const url = "/dialog.html";

    setElementStyle('loginPanel', 'none');
    setElementStyle('isSSOLoading', 'block');

    showLoginPopup(url);
}


// Use the Office dialog API to open a pop-up and display the sign-in page for the identity provider.
function showLoginPopup(url) {
    const fullUrl = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + url;
    Office.context.ui.displayDialogAsync(fullUrl,
        { height: 60, width: 30 }, function (result) {
            loginDialog = result.value;
            loginDialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
        });
}



export function loginInitialize() {
    // show log in page
    console.log('login initialize');
    console.log(getAccessToken());
    showLogin();

    if (!isAuthenticated()) {
        ssoDialogOpen();
    }
    else {
        hideLogin();
    }
}

function getAccessToken() {
    return window.localStorage.getItem('access_token');
}

function isAuthenticated(): boolean {
    const access_token = getAccessToken();
    if (access_token === null) {
        console.log('token doesn\'t exist');
        return false;
    }
    const decoded = jwtDecode<JwtPayload>(access_token);

    const parsedFromExp = moment.unix(decoded.exp);
    if (moment().isAfter(parsedFromExp)) {

        console.log('expired token');
        return false;
    }

    console.log('token authenticated')
    return true;
}

// global console, document, Excel, Office
function ViewLogic() {
    if (!isAuthenticated()) {
        showLogin();
    } else {
        hideLogin();
    }
}

// This handler responds to the success or failure message that the pop-up dialog receives from the identity provider
// and access token provider.
function processMessage(arg) {
    const messageFromDialog = JSON.parse(arg.message);
    if (messageFromDialog.status === 'success') {
        window.localStorage.setItem('access_token', messageFromDialog.result);
        loginDialog.close();
    }
    else {
        // Something went wrong with authentication or the authorization of the web application.
        loginDialog.close();
    }

    setElementStyle('isSSOLoading', 'none');
    ViewLogic();
}

export async function tryLogin(event:any){
    //clearMessages();
    event.preventDefault();
    const username = documentWrapper.getElementById('username');
    const password: any = documentWrapper.getElementById('password');

    const settings = container.getType('ISettings');
    const settingsObj = settings() as ISettings;
    // todo have a different url for auth
    await axios.post(`https://${settingsObj.authServiceUrl}/`, { username: username['value'], password: password.value })
      .then((res:any) => {
        window.localStorage.setItem('access_token', res.data.access_token)
        ViewLogic();
      })
      .catch((err) => {
        ViewLogic();
      });
}
