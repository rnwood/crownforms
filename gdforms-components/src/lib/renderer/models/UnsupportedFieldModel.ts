import { computed, observable } from "mobx";
import {
  ValidationErrorModel,
  SectionModel,
  VoidValue,
  FieldModel,
  IFieldModelOptions,
} from ".";
import { IFieldModelState } from "./FieldModel";
import { IOptions } from "./FormComponent";
import { StringValue } from "./TypedValue";

export interface IUnsupportedFieldModelOptions extends IFieldModelOptions {
  type: "unsupported";
  source: IOptions;
  details: string;
  controlType: "unsupported";
}

export class UnsupportedFieldModel extends FieldModel<
  VoidValue,
  IUnsupportedFieldModelOptions
> {
  protected getChildContainers() {
    return[];
  }

  getState(): IFieldModelState {
    return {
      id: this.id,
      key: this.options.name,
      valueIsDefault: true,
      internalValue: null,
    };
  }
  protected getDefaultValueFromText(text: StringValue): VoidValue {
    throw new Error("Method not implemented.");
  }
  constructor(
    section: SectionModel,
    options?: IUnsupportedFieldModelOptions,
    state?: IFieldModelState | undefined
  ) {
    super(
      VoidValue,
      section,
      options ?? {
        ...FieldModel.getNewFieldOptionsBase(
          "unsupported",
          VoidValue,
          "unsupported",
          section
        ),
        source: {},
        details: "",
      },
      state
    );
  }

  protected async getDefaultValueAsync(): Promise<VoidValue> {
    return new VoidValue();
  }

  @computed get validationErrors(): ValidationErrorModel[] {
    if (!this.parentSection?.validationEnabled) {
      return [];
    }

    return [];

    //return [new ValidationErrorModel(this, this.options.details)];
  }
}
