import { computed, observable } from "mobx";
import {
  FormComponent,
  FieldModel,
  IFieldModelOptions,
  FormModel,
  IFormModelOptions,
  SectionModel,
  ValidationErrorModel,
  SubFormValueArrayValue,
  SubFormValue,
  IFormComponentOptions,
  IFormComponentState,
} from ".";
import { IFieldModelState } from "./FieldModel";
import { IFormModelState } from "./FormModel";
import { StringValue } from "./TypedValue";

export interface ISubFormFieldOptions extends IFieldModelOptions {
  form: IFormModelOptions;
  type: "subform";
  controlType: "inline";
}

export interface ISubFormFieldState extends IFieldModelState {
  form: IFormModelState | null;
}

export class SubFormFieldModel extends FieldModel<
  SubFormValue,
  ISubFormFieldOptions,
  ISubFormFieldState
> {
  getState(): ISubFormFieldState {
    return {
      id: this.id,
      key: this.options.name,
      valueIsDefault: this.valueIsDefault,
      internalValue: null,
      form: this.internalValue?.value?.getState() ?? null,
    };
  }

  protected getDefaultValueFromText(text: StringValue): SubFormValue {
    throw new Error("Method not implemented.");
  }
  constructor(
    section: SectionModel,
    options?: ISubFormFieldOptions,
    state?: ISubFormFieldState | undefined
  ) {
    super(
      SubFormValue,
      section,
      options ?? {
        ...FieldModel.getNewFieldOptionsBase(
          "subform",
          SubFormValue,
          "inline",
          section
        ),
        form: {
          type: "form",
          name: "subform1",
          sections: [],
          title: "Subform 1",
        },
      },
      state
    );

    if (state) {
      this.valueIsDefault = state.valueIsDefault;
      this.internalValue = new SubFormValue(
        FormModel.continueFromState(this.options.form, this, state.form!)
      );
    }
  }

  protected async postInitComponentAsync(): Promise<void> {
    await super.postInitComponentAsync();
    this.appendChildren(this.value.value!);
    this.valueIsDefault = false;
  }

  protected getDesignerChildren(): readonly FormComponent<
    IFormComponentOptions,
    IFormComponentState
  >[] {
    return this.children.flatMap((c) => c.children).flatMap((c) => c.children);
  }

  protected async getDefaultValueAsync(): Promise<SubFormValue> {
    let item = await FormModel.loadAsync({
      options: this.options.form,
      parent: this
    });
    return new SubFormValue(item);
  }

  @computed get validateField(): ValidationErrorModel[] {
    return this.value.value?.validationErrors ?? [];
  }
}
