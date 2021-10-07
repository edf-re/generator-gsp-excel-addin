/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import * as Msal from "msal";
import { container } from "./container";
import { ISettings } from "./types/interfaces/settings.interface";

import { authConfig } from "../taskpane/auth-config/auth-config";

let settings = container.getType("ISettings");
const settingsObj = settings() as ISettings;
console.log('this is the base url its using', settingsObj.baseUrl);

const clientId = "3b1ce648-cb6e-4076-8448-4f1fdedbc93e";

/* global console, document, Excel, Office */
const msalConfig: Msal.Configuration = {
  auth: authConfig,
  cache: {
    cacheLocation: "localStorage", // Needed to avoid "User login is required" error.
    storeAuthStateInCookie: true, // Recommended to avoid certain IE/Edge issues.
  },
};

var requestObj = {
  scopes: ["api://3b1ce648-cb6e-4076-8448-4f1fdedbc93e/Addin.Api.Access"],
};

const userAgentApp = new Msal.UserAgentApplication(msalConfig);

export function authCallback(error, response) {
  if (error) {
    console.log('error on callback', error);
    Office.context.ui.messageParent(JSON.stringify({ status: "failure", result: error }));
  } else {
    if (response.tokenType === "id_token") {
      console.log(response.idToken.rawIdToken);
      localStorage.setItem("loggedIn", "yes");
    } else {
      console.log("token type is:" + response.tokenType);
      Office.context.ui.messageParent(JSON.stringify({ status: "success", result: response.accessToken }));
    }
  }
}

Office.initialize = function () {
  if (Office.context.ui.messageParent) {
    userAgentApp.handleRedirectCallback(authCallback);

    // The very first time the add-in runs on a developer's computer, msal.js hasn't yet
    // stored login data in localStorage. So a direct call of acquireTokenRedirect
    // causes the error "User login is required". Once the user is logged in successfully
    // the first time, msal data in localStorage will prevent this error from ever hap-
    // pening again; but the error must be blocked here, so that the user can login
    // successfully the first time. To do that, call loginRedirect first instead of
    // acquireTokenRedirect.
    if (localStorage.getItem("loggedIn") === "yes") {
      userAgentApp.acquireTokenRedirect(requestObj);
    } else {
      // This will login the user and then the (response.tokenType === "id_token")
      // path in authCallback below will run, which sets localStorage.loggedIn to "yes"
      // and then the dialog is redirected back to this script, so the
      // acquireTokenRedirect above runs.
      userAgentApp.loginRedirect(requestObj);
    }
  }
};
