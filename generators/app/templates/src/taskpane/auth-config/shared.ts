/* eslint-disable prettier/prettier */
import { container } from "../container";
import { ISettings } from "../types/interfaces/settings.interface";

let settings = container.getType("ISettings");
export const settingsObj = settings() as ISettings;

export const clientId = "3b1ce648-cb6e-4076-8448-4f1fdedbc93e";
export const authorityUrl = "https://login.microsoftonline.com/34c5e68e-b374-47fe-91da-0e3d638792fb";