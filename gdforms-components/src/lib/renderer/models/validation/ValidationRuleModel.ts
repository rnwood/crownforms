import { observable } from 'mobx';
import {FieldModel, FormModel, IFieldModelOptions, TypedValue} from "..";
import { IOptions } from '../FormComponent';
import { IFormModelState } from '../FormModel';

export interface IValidationRuleModelOptions extends IOptions {
  readonly type: string;
}

export abstract class ValidationRuleModel<TOptions extends IValidationRuleModelOptions, TTarget> {

  constructor(options: TOptions) {
    this.options = options;
  }

  @observable readonly options: TOptions;

  abstract validate(
    target: TTarget,
    form: FormModel
  ): string | null;
}
