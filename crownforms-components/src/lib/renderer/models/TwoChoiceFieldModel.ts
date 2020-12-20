import { computed } from 'mobx';
import {
  StringValue,
  TypedValue,
  ITypedValueConverter,
  FieldModel,
  IFieldModelOptions,
  FormComponent,
  IFormComponentOptions,
  IFormComponentState,
  ValueFieldModel,
} from ".";
import { IFieldModelState } from './FieldModel';
import { BooleanValue, IJsonableValueConverter } from "./TypedValue";

export interface ITwoChoiceFieldOptions
  extends IFieldModelOptions {
  type: "twochoice";
  trueLabel: string;
  trueValue: string|boolean|number|null|(string|null)[]|(number|null)[];
  falseLabel: string;
  falseValue: string|boolean|number|null|(string|null)[]|(number|null)[];
  controlType: "checkboxfield";
}

export class TwoChoiceFieldModel<T extends TypedValue> extends ValueFieldModel<
  T,
  ITwoChoiceFieldOptions
> {
  private static getNewFieldOptions<T extends TypedValue>(
    valueType: IJsonableValueConverter<T>,
    parent: FormComponent<IFormComponentOptions, IFormComponentState>,
    trueValue: T,
    falseValue: T
  ): ITwoChoiceFieldOptions {
    return {
      ...FieldModel.getNewFieldOptionsBase<"twochoice", T, "checkboxfield">(
        "twochoice",
        valueType,
        "checkboxfield",
        parent
      ),
      trueLabel: "Checkbox",
      trueValue: valueType.toJson(trueValue) ?? null,
      falseLabel: "",
      falseValue: valueType.toJson( falseValue) ?? null,
    };
  }

  constructor(
    type: IJsonableValueConverter<T>,
    parent: FormComponent<IFormComponentOptions, IFormComponentState>,
    defaultValue: T,
    options:
      | ITwoChoiceFieldOptions
      | { newFieldTrueValue: T; newFieldFalseValue: T },
    state: IFieldModelState|undefined
  ) {
    super(
      type,
      parent,
      "newFieldTrueValue" in options
        ? TwoChoiceFieldModel.getNewFieldOptions<T>(
            type,
            parent,
            options.newFieldTrueValue as T,
            options.newFieldFalseValue as T
          )
        : options,
        state
    );
    this.defaultValueInternal = defaultValue;
  }

  
  @computed get trueValue() {
    return this.valueType.convertFrom(this.options.trueValue);
  }

  @computed get falseValue() {
    return this.valueType.convertFrom(this.options.falseValue);
  }

  private defaultValueInternal: T;

  protected async getDefaultValueAsync(): Promise<T> {
    return this.defaultValueInternal;
  }

  getDefaultValueFromText(defaultValue: StringValue): T {
    return defaultValue.value?.toLowerCase() ===
      this.options.trueLabel?.toLowerCase()
      ? this.valueType.convertFrom(this.options.trueValue)
      : this.defaultValueInternal;
  }
}

export class StringTwoChoiceFieldModel extends TwoChoiceFieldModel<
  StringValue
> {
  constructor(
    parent: FormComponent<IFormComponentOptions, IFormComponentState>,
    options?: ITwoChoiceFieldOptions | undefined,
    state?: IFieldModelState | undefined,
  ) {
    super(
      StringValue,
      parent,
      new StringValue(""),
      options ?? {
        newFieldTrueValue: new StringValue("Yes"),
        newFieldFalseValue: new StringValue("No"),
      },
      state
    );
  }

  static readonly designerToolboxLabel = "Checkbox (String)";
}

export class BooleanTwoChoiceFieldModel extends TwoChoiceFieldModel<
  BooleanValue
> {
  constructor(
    parent: FormComponent<IFormComponentOptions, IFormComponentState>,
    options?: ITwoChoiceFieldOptions | undefined,
    state?: IFieldModelState| undefined
  ) {
    super(
      BooleanValue,
      parent,
      new BooleanValue(false),
      options ?? {
        newFieldTrueValue: new BooleanValue(true),
        newFieldFalseValue: new BooleanValue(false),
      },
      state
    );
  }

  static readonly designerToolboxLabel = "Checkbox (True/False)";
}
