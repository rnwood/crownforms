import { observable, computed } from "mobx";
import {FormComponentConstructor, FormComponent, FormModel, TextFieldModel, BooleanTwoChoiceFieldModel, StringTwoChoiceFieldModel, IFormComponentOptions, IFormComponentState} from "../../renderer";

export class FormDesignerModel {
  constructor(form: FormModel) {
    this.form = form;
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
