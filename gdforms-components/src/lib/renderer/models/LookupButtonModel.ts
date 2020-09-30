import { FormComponentConstructor, TypedValue, VoidValue, FormComponent, IFormComponentOptions, FieldModel, IFieldModelOptions, StringValue, IFieldModelState } from '.';
import { IFormComponentState } from './FormComponent';
import { ILookupModelState } from './LookupModel';

export interface ILookupButtonOptions extends IFieldModelOptions {
  lookup: string | undefined
}

export class LookupButtonModel extends FieldModel<VoidValue, ILookupButtonOptions> {
  getState(): IFieldModelState {
    return {
      id: this.id,
      key: this.options.name, internalValue: null, valueIsDefault: true}
  }

  constructor(parent: FormComponent<IFormComponentOptions, IFormComponentState>, options: ILookupButtonOptions, state?: IFieldModelState|undefined) {
    super(VoidValue, parent, options, state);

    if (state) {
      this.value = new VoidValue();
    }
  }

  protected getDefaultValueFromText(text: StringValue): VoidValue {
    throw new Error('Method not implemented.');
  }
  protected async getDefaultValueAsync(): Promise<VoidValue> {
    return new VoidValue();
  }

  async runLookupAsync() : Promise<void> {
    if (!this.options.lookup || !this.parentForm) {
      return;
    }

    let lookup = this.parentForm.getLookup(this.options.lookup);

    if (!lookup ) {
      throw Error(`Lookup ${this.options.lookup} not found`)
    }

    await lookup.getResultsAsync(this.parentForm);
  }


  
}
