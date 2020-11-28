import { computed } from "mobx";
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
  IFieldModelState,
  IFormComponentOptions,
  IFormComponentState,
  IFormModelState,
  StringValue,

} from ".";

export interface IRepeatableSubFormFieldOptions extends IFieldModelOptions {
  type: "repeatablesubform";
  form: IFormModelOptions;
  controlType: "inline";
}

export interface IRepeatableSubFormFieldState extends IFieldModelState {
  forms: (null|IFormModelState)[];
}

export class RepeatableSubFormFieldModel extends FieldModel<
  SubFormValueArrayValue,
  IRepeatableSubFormFieldOptions,
  IRepeatableSubFormFieldState
> {
  getState(): IRepeatableSubFormFieldState {
    return {
      id: this.id,
      key: this.id,
      valueIsDefault: this.valueIsDefault,
      internalValue: null,
      forms: this.internalValue.value?.map(v => v.value?.getState() ?? null)
    }
  }
  protected getDefaultValueFromText(text: StringValue): SubFormValueArrayValue {
    throw new Error("Method not implemented.");
  }
  constructor(
    section: SectionModel,
    options?: IRepeatableSubFormFieldOptions,
    state?: IRepeatableSubFormFieldState
  ) {
    super(
      SubFormValueArrayValue,
      section,
      options ?? {
        ...FieldModel.getNewFieldOptionsBase(
          "repeatablesubform",
          SubFormValueArrayValue,
          "inline",
          section
        ),
        form: {
          type: "form",
          name: "",
          title: "",
          sections: [],
        },
      },
      state
    );

    this.formOptions = this.options.form;

    if (state) {
      this.valueIsDefault = state.valueIsDefault;
      this.value = new SubFormValueArrayValue(
        state.forms.map(
          (f) =>
            new SubFormValue(
              f ? FormModel.continueFromState(this.formOptions, this, f) : null
            )
        )
      );
    }
  }

  protected async initComponentAsync(): Promise<void> {
    await super.initComponentAsync();
    let item = await FormModel.loadAsync({options: this.formOptions, parent: this});

    this.value = new SubFormValueArrayValue([new SubFormValue(item)]);
    this.valueIsDefault = false;
  }

  private formOptions: IFormModelOptions;

  async addNewItemAsync(): Promise<SubFormValue> {
    let promise = this.addNewItemAsyncInternal();
    this.addTask({ promise: promise, description: "Adding new item" });
    return await promise;
  }

  private async addNewItemAsyncInternal(): Promise<SubFormValue> {
    const newItem = new SubFormValue(
      await FormModel.loadAsync({options: this.formOptions, parent: this})
    );
    this.value.value.push(newItem);

    return newItem;
  }

  @computed get validateField(): ValidationErrorModel[] {
    return this.value.value.flatMap((i) => i.value?.validationErrors ?? []);
  }

  protected async getDefaultValueAsync(): Promise<SubFormValueArrayValue> {
    return new SubFormValueArrayValue([]);
  }

  protected getDesignerChildren(): readonly FormComponent<
    IFormComponentOptions,
    IFormComponentState
  >[] {
    return this.children.flatMap((c) => c.children).flatMap((c) => c.children);
  }
}
