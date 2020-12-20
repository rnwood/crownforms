import { computed, observable } from "mobx";
import { Expression } from "../expressions";
import {FieldValidationRuleModel, ISectionValidationRuleModelOptions, IValidationRuleModelOptions, SectionValidationRuleModel} from "."
import { FieldModel, IFieldModelOptions, FormModel, BooleanValue, TypedValue, IOptions, FFConditionParser } from "..";
import { SectionModel } from '../SectionModel';

export interface IExpressionSectionValidationRuleModelOptions extends ISectionValidationRuleModelOptions {
  readonly type: "expression",
  expression: string,
  errorMessage?: string|undefined;
}

export class ExpressionSectionValidationRuleModel extends SectionValidationRuleModel<IExpressionSectionValidationRuleModelOptions> {
  constructor(options: IExpressionSectionValidationRuleModelOptions) {
    super(options);
  }

  @computed private get expression():
  | Expression<BooleanValue>
  | undefined {
  return this.options.expression
    ? FFConditionParser.parseBooleanExpression(this.options.expression)
    : undefined;
}


  validate(
    section: SectionModel,
    form: FormModel
  ): string | null {
    const error = this.options.errorMessage ?? this.getDefaultErrorMessage(section);
    return this.expression?.getResult(form).value === false ? error : null;
  }
  
}
