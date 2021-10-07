import { Factory } from "./factory";
import { settingsInjector } from "./Logic/settings-importer";
import { buttonDisablerInjectorInformation } from './Logic/button-disabler';
import { documentWrapperInjectorInformation } from "./Logic/document-wrapper";

export const container = new Factory();

container.register(settingsInjector.name, settingsInjector.build);
container.register(documentWrapperInjectorInformation.name, documentWrapperInjectorInformation.build);
container.register(buttonDisablerInjectorInformation.name, buttonDisablerInjectorInformation.build);
