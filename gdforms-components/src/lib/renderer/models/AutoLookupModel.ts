import {
  FormComponentConstructor,
  TypedValue,
  VoidValue,
  FormComponent,
  IFormComponentOptions,
  FieldModel,
  IFieldModelOptions,
  StringValue,
  IFieldModelState,
  ValidationErrorModel,
  ValidationErrorModelSeverity,
} from ".";
import { IFormComponentState } from "./FormComponent";
import { ILookupModelState } from "./LookupModel";
import { computed, observable } from "mobx";

export interface IAutoLookupOptions extends IFieldModelOptions {
  lookup: string | undefined;
}

export interface IAutoLookupState extends IFieldModelState {
  lookupError: string|null
}

export class AutoLookupModel extends FieldModel<VoidValue, IAutoLookupOptions, IAutoLookupState> {
  getState(): IAutoLookupState {
    return {
      id: this.id,
      key: this.options.name,
      internalValue: null,
      valueIsDefault: true,
      lookupError: this.lookupError
    };
  }

  constructor(
    parent: FormComponent<IFormComponentOptions, IFormComponentState>,
    options: IAutoLookupOptions,
    state?: IAutoLookupState | undefined
  ) {
    super(VoidValue, parent, options, state);

    if (state) {
      this.value = new VoidValue();
      this.lookupError = state.lookupError;
    }
  }

  @computed
  protected get validateFieldAlways(): ValidationErrorModel[] {
    if (this.lookupError) {
      return [new ValidationErrorModel(this, this.lookupError, ValidationErrorModelSeverity.Fatal)]
    }
    return [];
  }

  @observable private lookupError: string|null = null;

  protected getDefaultValueFromText(text: StringValue): VoidValue {
    throw new Error("Method not implemented.");
  }
  protected async getDefaultValueAsync(): Promise<VoidValue> {
    return new VoidValue();
  }

  protected async postInitComponentAsync(): Promise<void> {
    await super.postInitComponentAsync();

    const promise = this.runLookupAsync();
    this.addTask({
      description: "Running auto lookup",
      promise,
    });
    await promise;
  }
  
  

  async runLookupAsync(): Promise<void> {
    this.lookupError = null;

    if (!this.options.lookup || !this.parentForm) {
      return;
    }
    

    let lookup = this.parentForm.getLookup(this.options.lookup);

    if (!lookup) {
      throw Error(`Lookup ${this.options.lookup} not found`);
    }

    try {
    let result = await lookup.getResultsAsync(this.parentForm);
    result[0]?.populate(this.parentForm);
    } catch (e) {
      console.error(e);
      this.lookupError = "Failed to load required data.";
    }
  }
}
