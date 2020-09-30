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



  validate(
    field: FieldModel<TypedValue, IFieldModelOptions>,
    form: FormModel
  ): string | null {
    let stringValue = StringValue.convertFrom(field.value.value).value ?? "";

    if (!new RegExp(this.options.regex, "gim").test(stringValue)) {
      return this.options.errorMessage ?? this.getDefaultErrorMessage(field);
    }
    return null;
  }
}
