/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { BuilderMethod, IFactory } from "./factory.interface.ts";

export interface IInjectorInformation {
    readonly name: string;
    build(factory: IFactory) : BuilderMethod;
}