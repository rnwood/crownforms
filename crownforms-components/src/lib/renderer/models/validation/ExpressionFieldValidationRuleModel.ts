import { computed, observable } from "mobx";
import { Expression } from "../expressions";
import {
  FieldValidationRuleModel,
  IFieldValidationRuleModelOptions,
  IValidationRuleModelOptions,
} from ".";
import {
  FieldModel,
  IFieldModelOptions,
  FormModel,
  BooleanValue,
  TypedValue,
  IOptions,
  FFConditionParser,
} from "..";

export interface IExpressionFieldValidationRuleModelOptions
  extends IFieldValidationRuleModelOptions {
  readonly type: "expression";
  expression: string;
  errorMessage?: string | undefined;
}

export class ExpressionFieldValidationRuleModel extends FieldValidationRuleModel<
  IExpressionFieldValidationRuleModelOptions
> {
  constructor(options: IExpressionFieldValidationRuleModelOptions) {
    super(options);
  }

  @computed private get expression(): Expression<BooleanValue> | undefined {
    return this.options.expression
      ? FFConditionParser.parseBooleanExpression(this.options.expression)
      : undefined;
  }

  validateFieldValue(
    value: TypedValue,
    { form, field }: { form: FormModel; field: FieldModel }
  ): string | null {
    const error =
      this.options.errorMessage ?? this.getDefaultErrorMessage(field);
    return this.expression?.getResult(form).value === false ? error : null;
  }
}
