/* eslint-disable prettier/prettier */
import { clientId, authorityUrl, settingsObj } from './shared';

export const authConfig = {
  clientId: clientId, //This is your client ID
  authority: authorityUrl,
  redirectUri: `${settingsObj.baseUrl}dialog.html`,
  navigateToLoginRequestUrl: false,
  response_type: "access_token"
}