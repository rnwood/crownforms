import { computed } from "mobx";
import {
  FormComponent,
  IChoicesFieldModelOptions,
  IFormComponentOptions,
  ITypedValueConverter,
  StringValue,
  FieldModel,
  LookupResult,
  TypedValue,
  ITypedArrayValue,
  IFormComponentState,
  ValueFieldModel,
} from ".";
import { IFieldModelState } from "./FieldModel";
import { IJsonableValueConverter } from './TypedValue';

export abstract class SelectFieldModel<
  TValue extends TypedValue & (TChoices | ITypedArrayValue<TChoices>),
  TChoices extends TypedValue,
  TOptions extends IChoicesFieldModelOptions
> extends ValueFieldModel<TValue, TOptions> {
  constructor(
    type: IJsonableValueConverter<TValue>,
    choiceType: IJsonableValueConverter<TChoices>,
    parent: FormComponent<IFormComponentOptions, IFormComponentState>,
    options: TOptions,
    state: IFieldModelState | undefined
  ) {
    super(type, parent, options, state);
    this.choiceType = choiceType;
  }

  protected readonly choiceType: IJsonableValueConverter<TChoices>;

  @computed get choices(): {
    label: string;
    value: TChoices;
    lookupResult?: LookupResult;
  }[] {
    if (Array.isArray(this.options.choices)) {
      return this.options.choices.map((c) => ({
        label: c.label,
        value: this.choiceType.convertFrom(c.value),
      }));
    }

    const lookup = this.parentForm?.getLookup(this.options.choices.lookup);
    if (lookup && lookup.results) {
      return lookup.results.map((r) => {
        return {
          label: r.values["display"] ?? "",
          value: this.choiceType.convertFrom(r.values["name"]),
          lookupResult: r,
        };
      });
    }

    return [];
  }

  getFormattedValue(formatString: string) : TypedValue {
    let choice = this.choices.find((c) => c.value.value === this.value.value);  
    if (!choice) {
      return new StringValue(null);
    }  

    return new StringValue(choice.lookupResult?.values[formatString] ?? null);
  }

  protected onValueChanged() {
    if (this.parentForm && this.options.autoPopulateFields) {
      let choice = this.choices.find((c) => c.value.value === this.value.value);
      if (choice) {
        choice.lookupResult?.populate(this.parentForm);
      }
    }
  }
}
