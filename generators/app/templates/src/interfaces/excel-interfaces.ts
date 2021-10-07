/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */

export interface INamedRange {
    readonly name: string;
    getText(): string[][];
    getSingleValue(): string;
    getValues(): string[][];
    getValueTypes(): string[]
}

export interface IExcelAbstraction {
    getNamedRange(name: string, sheetName: string): INamedRange;
}


