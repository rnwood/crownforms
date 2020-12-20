import { observable } from "mobx";
import { FieldValidationRuleModel, IFieldValidationRuleModelOptions, IValidationRuleModelOptions } from ".";
import { StringValue, TypedValue, FormModel, FieldModel, IFieldModelOptions } from "..";

export interface IRegexFieldValidationRuleModelOptions extends IFieldValidationRuleModelOptions {
  readonly type: "regex";
  regex: string;
  errorMessage?: string|undefined;
}

export class RegexFieldValidationRuleModel extends FieldValidationRuleModel<
  IRegexFieldValidationRuleModelOptions
> {
  constructor(options: IRegexFieldValidationRuleModelOptions) {
    super(options);
  }



  validateFieldValue(
    value: TypedValue,
    {form, field} : {form: FormModel, field: FieldModel}
  ): string | null {
    let stringValue = StringValue.convertFrom(value.value).value ?? "";

    if (!new RegExp(this.options.regex, "gim").test(stringValue)) {
      console.log(`${stringValue} does not match ${this.options.regex}`)
      return this.options.errorMessage ?? this.getDefaultErrorMessage(field);
    }
    console.log(`${stringValue} matches ${this.options.regex}`)
    return null;
  }
}
