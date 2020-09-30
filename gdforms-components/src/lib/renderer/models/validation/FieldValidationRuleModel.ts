import { ValidationRuleModel, ExpressionFieldValidationRuleModel, IValidationRuleModelOptions, IExpressionFieldValidationRuleModelOptions, RegexFieldValidationRuleModel, IRegexFieldValidationRuleModelOptions } from '.';
import { FieldModel, IFieldModelOptions, TypedValue } from '..';

export interface IFieldValidationRuleModelOptions extends IValidationRuleModelOptions {

}

export abstract class FieldValidationRuleModel<TOptions extends IFieldValidationRuleModelOptions> extends ValidationRuleModel<TOptions, FieldModel<TypedValue, IFieldModelOptions>> {
  
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
