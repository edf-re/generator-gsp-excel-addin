/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import { IExcelAbstraction, INamedRange } from "../interfaces/excel-interfaces";


export async function runCommandAgainstExcel(context: Excel.RequestContext, command) {
    await context.sync();
    const excepHelper = new ExcelHelper(context);
    const commandResult = command(excepHelper);
    await context.sync();
    return commandResult;
}


export class ExcelHelper implements IExcelAbstraction {

    private context: Excel.RequestContext;
    private allNamedRanges: Excel.NamedItemCollection;

    constructor(context: Excel.RequestContext) {
        this.context = context;
        this.allNamedRanges = this.context.workbook.names;
    }

    getNamedRange(namedRange: string): INamedRange {
        const range = this.allNamedRanges.getItem(namedRange).getRange();
        range.load('values');
        range.load('text');
        range.load('valueTypes');

        return new RangeAbstraction(range, namedRange);
    }
}
export class RangeAbstraction implements INamedRange {
    private range: Excel.Range;

    public readonly name: string;
    constructor(range: Excel.Range, name: string) {
        this.range = range;
        this.name = name;

        this.getValue = this.getValue.bind(this);
        this.getSingleValue = this.getSingleValue.bind(this);
        this.getValueTypes = this.getValueTypes.bind(this);
        this.getText = this.getText.bind(this);
        this.getValues = this.getValues.bind(this);
    }
    getSingleValue(): string {
        return this.range.values[0][0];
    }
    getValueTypes(): string[] {
        return this.range.valueTypes[0];
    }

    getText(): string[][] {
        return this.range.text;
    }

    getValue(): string {
        const result = this.range.text;
        return result[0][0].split(' ')[0];
    }

    getValues() {
        return this.range.values;
    }
}
