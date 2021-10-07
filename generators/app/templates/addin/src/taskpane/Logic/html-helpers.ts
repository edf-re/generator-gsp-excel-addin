/* eslint-disable prettier/prettier */
import { documentWrapper } from "./document-wrapper";

export function setElementStyle(id: string, style: string) {
    documentWrapper.getElementById(id).style.display = style;
}