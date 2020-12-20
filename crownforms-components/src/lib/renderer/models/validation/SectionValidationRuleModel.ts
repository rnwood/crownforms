import { ValidationRuleModel, ExpressionFieldValidationRuleModel, IValidationRuleModelOptions, IExpressionFieldValidationRuleModelOptions, RegexFieldValidationRuleModel, IRegexFieldValidationRuleModelOptions, ExpressionSectionValidationRuleModel, IExpressionSectionValidationRuleModelOptions } from '.';
import { FieldModel, IFieldModelOptions, TypedValue } from '..';
import { SectionModel } from '../SectionModel';

export interface ISectionValidationRuleModelOptions extends IValidationRuleModelOptions {

}

export abstract class SectionValidationRuleModel<TOptions extends ISectionValidationRuleModelOptions> extends ValidationRuleModel<TOptions, SectionModel> {
  
  protected getDefaultErrorMessage(section: SectionModel): string {
    return `${section.options.displayName} is invalid`
  }

  static create<TOptions>(options: ISectionValidationRuleModelOptions) : SectionValidationRuleModel<ISectionValidationRuleModelOptions> {
    switch(options.type) {
        case "expression":
          return new ExpressionSectionValidationRuleModel(options as IExpressionSectionValidationRuleModelOptions);
      default:
        throw new Error(`Unhandled ISectionValidationRuleModelOptions type ${options.type}`);
    }
  }
}
