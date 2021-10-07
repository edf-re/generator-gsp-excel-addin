import { BuilderMethod, FactoryMethod, IFactory } from './types/interfaces/factory.interface';


export class Factory implements IFactory {

    private registry: { [name: string]: BuilderMethod };

    constructor() {
        this.registry = {};
    }

    public getType(name: string): BuilderMethod {
        return this.registry[name];
    }

    public register(name: string, factoryMethod: FactoryMethod): void {
        this.registry[name] = factoryMethod(this);
    }

    public new():IFactory{
        const factoryClone = new Factory();
        Object.keys(this.registry).forEach(key => {
            factoryClone.register(key, this.registry[key]);
        });
        return factoryClone;
    }


    public override(name: string, factoryMethod: FactoryMethod): IFactory {
        this.register(name, factoryMethod);
        return this;
    }


}