import { observable } from "mobx";
import { StringArrayValue, IFieldModelOptions, FieldModel, SectionModel, IChoicesFieldModelOptions, IFieldModelState } from ".";
import { SelectFieldModel } from './SelectFieldModel';
import { StringValue } from './TypedValue';

export interface ISelectSeveralFieldModelOptions
  extends IChoicesFieldModelOptions {
  type: "selectseveral";
  controlType: "multicheckboxfield"
}

export class SelectSeveralFieldModel extends SelectFieldModel<
  StringArrayValue,
  StringValue,
  ISelectSeveralFieldModelOptions
> {
  protected getDefaultValueFromText(text: StringValue): StringArrayValue {
    throw new Error('Method not implemented.');
  }
  constructor(section: SectionModel, options: ISelectSeveralFieldModelOptions,state?: IFieldModelState|undefined) {
    super(
      StringArrayValue,
      StringValue,
      section,
      options ?? {
        ...FieldModel.getNewFieldOptionsBase(
          "selectseveral",
          StringArrayValue,
          "multicheckboxfield",
          section
        ),
        choices: [{ label: "Option 1", value: "option1" }],
      },
      state
    );
  }

  protected async getDefaultValueAsync() {
    return new StringArrayValue([]);
  }
}
