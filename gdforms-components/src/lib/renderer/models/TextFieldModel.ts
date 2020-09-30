import {
  FieldModel,
  IFieldModelOptions,
  StringValue,
  FormComponent,
  IFormComponentOptions,
  IFormComponentState,
  ValueFieldModel,
} from ".";
import { IFieldModelState } from "./FieldModel";
import { IFFTextFieldModel } from "./firmstep";

export interface ITextFieldOptions extends IFieldModelOptions {
  type: "text";
  width?: number;
  controlType: "textfield" | "textareafield";
}

export class TextFieldModel extends ValueFieldModel<StringValue, ITextFieldOptions> {
  protected getDefaultValueFromText(text: StringValue): StringValue {
    throw new Error("Method not implemented.");
  }
  constructor(
    parent: FormComponent<IFormComponentOptions, IFormComponentState>,
    options?: ITextFieldOptions,
    state?: IFieldModelState
  ) {
    super(
      StringValue,
      parent,
      options ?? {
        ...FieldModel.getNewFieldOptionsBase(
          "text",
          StringValue,
          "textfield",
          parent
        ),
      },
      state
    );
  }

  protected async getDefaultValueAsync(): Promise<StringValue> {
    return new StringValue(null);
  }

  static readonly designerToolboxLabel = "Text Field";
}
