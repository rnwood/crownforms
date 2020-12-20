import { TypedValue, FormComponent, IFieldModelOptions, IFormComponentOptions, IFormComponentState } from ".";

export type FormComponentConstructor<T, TOptions extends IFormComponentOptions> = (new (
  parent: FormComponent<IFormComponentOptions, IFormComponentState>,
  options?: TOptions
) => T) & {
  designerToolboxLabel: string;
};
