/* eslint-disable prettier/prettier */
import { clientId, authorityUrl } from './shared';

export const authConfig = {
    clientId: clientId, //This is your client ID
    authority: authorityUrl,
    redirectUri: `https://localhost:3000/dialog.html`,
    navigateToLoginRequestUrl: false
}