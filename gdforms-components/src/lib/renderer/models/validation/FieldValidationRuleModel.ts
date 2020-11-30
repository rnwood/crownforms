import { ValidationRuleModel, ExpressionFieldValidationRuleModel, IValidationRuleModelOptions, IExpressionFieldValidationRuleModelOptions, RegexFieldValidationRuleModel, IRegexFieldValidationRuleModelOptions } from '.';
import { FieldModel, FormModel, IFieldModelOptions, TypedValue } from '..';

export interface IFieldValidationRuleModelOptions extends IValidationRuleModelOptions {

}

export abstract class FieldValidationRuleModel<TOptions extends IFieldValidationRuleModelOptions> extends ValidationRuleModel<TOptions, FieldModel<TypedValue, IFieldModelOptions>> {
  
  private lastResult: string|null|undefined;
  private lastInputValue: TypedValue|undefined;

  validate(
    field: FieldModel<TypedValue, IFieldModelOptions>,
    form: FormModel
  ): string | null {
    this.lastInputValue = field.value;
    this.lastResult  = this.validateFieldValue(this.lastInputValue, {form, field});
    return this.lastResult;
  }

  protected abstract validateFieldValue(value: TypedValue, {form, field} : {form: FormModel, field:FieldModel}) : string|null;

  protected getDefaultErrorMessage(field: FieldModel<TypedValue, IFieldModelOptions>): string {
    return `${field.options.displayName} is invalid`
  }

  static create<TOptions>(options: IFieldValidationRuleModelOptions) : FieldValidationRuleModel<IFieldValidationRuleModelOptions> {
    switch(options.type) {
        case "expression":
          return new ExpressionFieldValidationRuleModel(options as IExpressionFieldValidationRuleModelOptions);
        case "regex":
          return new RegexFieldValidationRuleModel(options as IRegexFieldValidationRuleModelOptions);
      default:
        throw new Error(`Unhandled IFieldValidationRuleModelOptions type ${options.type}`);
    }
  }
}
