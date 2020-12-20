import {FieldModel,  IFieldModelOptions, TypedValue } from ".";
import { FormComponent, IFormComponentOptions, IFormComponentState } from './FormComponent';

export enum ValidationErrorModelSeverity {
  Fatal,
  Correctable
}

export class ValidationErrorModel {
  constructor(
    component: FormComponent<IFormComponentOptions, IFormComponentState>,
    message: string,
    severity: ValidationErrorModelSeverity
  ) {
    this.component = component;
    this.message = message;
    this.severity = severity;
  }

  readonly component: FormComponent<IFormComponentOptions, IFormComponentState>;
  readonly message: string;
  readonly severity: ValidationErrorModelSeverity;
}
