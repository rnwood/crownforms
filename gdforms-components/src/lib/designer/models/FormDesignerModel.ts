import { observable, computed } from "mobx";
import {FormComponentConstructor, FormComponent, FormModel, TextFieldModel, BooleanTwoChoiceFieldModel, StringTwoChoiceFieldModel, IFormComponentOptions, IFormComponentState, IFormModelOptions, IFormModelState} from "../../renderer";

export interface IFormDesignerModelState {
  form: IFormModelState
}

export class FormDesignerModel {
  private constructor(form: FormModel, state: IFormDesignerModelState|undefined) {
    this.form = form;
  }

  static async loadAsync(options: IFormModelOptions) : Promise<FormDesignerModel> {
    const form = await FormModel.loadAsync({options, readOnly: true});
    return new FormDesignerModel(form, undefined);
  }

  getState() : IFormDesignerModelState {
    return {
      form: this.form.getState()
    };
  }

  static continueFromState(
    options: IFormModelOptions,
    state: IFormDesignerModelState
  ) {
    const form = FormModel.continueFromState(options, undefined, state.form);
    return new FormDesignerModel(form, state);
  }

  readonly form: FormModel;

  @observable selectedComponentInternal: FormComponent<IFormComponentOptions, IFormComponentState> | undefined = undefined;

  @computed get selectedComponent(): FormComponent<IFormComponentOptions, IFormComponentState> | undefined {
    return this.selectedComponentInternal;
  }

  set selectedComponent(value: FormComponent<IFormComponentOptions, IFormComponentState> | undefined) {
    this.selectedComponentInternal = value;
  }

  readonly fieldTypes: FormComponentConstructor<FormComponent<IFormComponentOptions, IFormComponentState>, any>[] = [
    TextFieldModel,
    StringTwoChoiceFieldModel,
    BooleanTwoChoiceFieldModel,
  ];
}
