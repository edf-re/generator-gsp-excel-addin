export type BuilderMethod = (...parameters: any) => any;
export type FactoryMethod = (factory: IFactory) => BuilderMethod;

export interface IFactory {
    getType(name: string): BuilderMethod;
    register(name: string, factoryMethod: FactoryMethod): void;
    override(name:string, factoryMethod: FactoryMethod): IFactory;
}