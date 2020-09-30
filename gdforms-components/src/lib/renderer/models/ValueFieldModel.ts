import {FieldModel, FormComponent, IFieldModelOptions, IFieldModelState, IFormComponentOptions, IFormComponentState, IJsonableValueConverter, TypedValue } from "."
export abstract class ValueFieldModel<T extends TypedValue, TOptions extends IFieldModelOptions> extends FieldModel<T, TOptions, IFieldModelState> {

  constructor(
    valueType: IJsonableValueConverter<T>,
    parent: FormComponent<IFormComponentOptions, IFormComponentState>,
    options: TOptions,
    state: IFieldModelState|undefined
  ) {
    super(valueType, parent, options, state);
    this.valueType = valueType;
  
    this.initialState = state;
    if (state) {
      this.internalValue = valueType.convertFrom(state.internalValue);
      this.valueIsDefault = state.valueIsDefault;
    }
  }

  readonly initialState : IFieldModelState|undefined;

  readonly valueType: IJsonableValueConverter<T>;

  getState() : IFieldModelState {
    return {
      id: this.id,
      key: this.options.name,
      internalValue: this.valueType.toJson(this.internalValue) ?? null,
      valueIsDefault: this.valueIsDefault
    }
  }
}
