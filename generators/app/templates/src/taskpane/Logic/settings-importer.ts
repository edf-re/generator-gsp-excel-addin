import { BuilderMethod, IFactory } from "../types/interfaces/factory.interface";
import { IInjectorInformation } from "../types/interfaces/injector-information.interface";
import { ISettings } from "../types/interfaces/settings.interface";
import { settings } from "./settings-data";

class SettingsImporter implements ISettings {

    public get baseUrl() : string {
        return settings["base-url"];
    }

    public get serviceUrl() : string {
        return settings["service-url"];
    }
    public get centralizedAssumptionsUrl() : string {
        return settings["centralized-assumptions-url"];
    }
    public get authServiceUrl() : string {
        return settings["auth-service-url"];

    }
    public get bopServiceUrl() : string {
        return settings["bop-service-url"];
    }
}

class SettingsInjector implements IInjectorInformation {
    readonly name = "ISettings";
    build(_factory: IFactory) : BuilderMethod {
        console.log('settings importer caleld');
        return function () {
            return new SettingsImporter();
        }
    }
}

export const settingsInjector = new SettingsInjector();
