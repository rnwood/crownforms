import { observable } from "mobx";
import { StringValue } from "./TypedValue";
import {FieldModel,  IFieldModelOptions, SectionModel } from ".";
import { IChoicesFieldModelOptions } from './IChoicesFieldModelOptions';
import { SelectFieldModel } from './SelectFieldModel';
import { IFieldModelState } from './FieldModel';

export interface ISelectOneOptions extends IChoicesFieldModelOptions {
  type: "selectone";
  nullText?: string|null;
  controlType: "selectfield" | "radiofield"
}

export class SelectOneFieldModel extends SelectFieldModel<
  StringValue,
  StringValue,
  ISelectOneOptions
> {
  protected getDefaultValueFromText(text: StringValue): StringValue {
    return this.choices.find(c => c.label === text.value)?.value ?? new StringValue(null);
  }
  protected async getDefaultValueAsync(): Promise<StringValue> {
    return this.valueType.defaultValue;
  }

  constructor(section: SectionModel, options?: ISelectOneOptions, state?: IFieldModelState) {
    super(
      StringValue,
      StringValue,
      section,
      options ?? {
        ...FieldModel.getNewFieldOptionsBase("selectone", StringValue, "selectfield", section),
        choices: [],
      },
      state
    );
  }

}
