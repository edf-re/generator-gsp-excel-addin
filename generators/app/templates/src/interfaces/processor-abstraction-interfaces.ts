/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { INamedRange } from "./excel-interfaces";

export interface IProcessorAbstraction {
    doUpload(data: INamedRange[]) : Promise<void>;
    alertUser(message: string): void;
    alertUserWithMissingNamed(message: string): void;
};