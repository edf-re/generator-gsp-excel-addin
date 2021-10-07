/* eslint-disable no-useless-catch */
/* eslint-disable prettier/prettier */
import { IButtonDisabler } from '../types/interfaces/button-disabler.interface';
import { IDocumentWrapper } from '../types/interfaces/document-wrapper.interface';
import { BuilderMethod, IFactory } from '../types/interfaces/factory.interface.ts';
import { IInjectorInformation } from '../types/interfaces/injector-information.interface';

class ButtonDisabler implements IButtonDisabler {
    private documentWrapper: IDocumentWrapper;
    constructor(documentWrapper: IDocumentWrapper) {
        this.documentWrapper = documentWrapper;
    }

    public async disableThenExecute(ElementIdsToDisable: string[], doer: () => Promise<void>): Promise<void> {
        ElementIdsToDisable.forEach(elementId => {
            const elementToDisable = this.documentWrapper.getElementById(elementId);
            elementToDisable.classList.add('disabled');
        });

        try {
            await doer();
        } catch (e) {
            throw e;
        } finally {
            ElementIdsToDisable.forEach(elementId => {
                const elementToDisable = this.documentWrapper.getElementById(elementId);
                elementToDisable.classList.remove('disabled');
            });
        }

    }
}

class ButtonDisablerInjectorInformation implements IInjectorInformation {
    public readonly name: string = 'IButtonDisabler';
    public build(_factory: IFactory): BuilderMethod {
        return function () {
            const documentWrapper = _factory.getType('IDocumentWrapper');
            return new ButtonDisabler(documentWrapper());
        }
    }
}

export const buttonDisablerInjectorInformation = new ButtonDisablerInjectorInformation();