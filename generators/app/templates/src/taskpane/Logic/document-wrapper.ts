/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { IDocumentWrapper } from '../types/interfaces/document-wrapper.interface';
import { BuilderMethod, IFactory } from '../types/interfaces/factory.interface.ts';
import { IInjectorInformation } from '../types/interfaces/injector-information.interface';
/* global document */

class DocumentWrapper implements IDocumentWrapper {
    public getElementById(elementId: string) : HTMLElement {
        return document.getElementById(elementId);
    }
}

export class DocumentWrapperInjectorInformation implements IInjectorInformation {
    public readonly name: string = 'IDocumentWrapper';
    public build(_factory: IFactory) : BuilderMethod {
        return function() {
            return new DocumentWrapper();
        };
    }
}

export const documentWrapper = new DocumentWrapper();

export const documentWrapperInjectorInformation = new DocumentWrapperInjectorInformation();