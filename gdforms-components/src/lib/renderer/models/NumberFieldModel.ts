import { NumberValue, StringValue } from "./TypedValue";
import {SectionModel,FieldModel, IFieldModelOptions, ValueFieldModel } from ".";
import {IFFNumberFieldModel } from "./firmstep";
import { IFieldModelState } from './FieldModel';

export interface INumberFieldOptions extends IFieldModelOptions {
  type: "number";
  width?: number;
  prefix?: string;
  suffix?: string;
  decimalPlaces?: number;
  controlType: "numberfield";
}

export class NumberFieldModel extends ValueFieldModel<
  NumberValue,
  INumberFieldOptions
> {
  protected getDefaultValueFromText(text: StringValue): NumberValue {
    throw new Error('Method not implemented.');
  }
  constructor(section: SectionModel, options?: INumberFieldOptions, state?: IFieldModelState|undefined) {
    super(
      NumberValue,
      section,
      options ?? {
        ...FieldModel.getNewFieldOptionsBase("number", NumberValue, "numberfield", section),
      },
      state
    );
  }

  protected async getDefaultValueAsync(): Promise<NumberValue> {
    return new NumberValue(null);
  }
}
