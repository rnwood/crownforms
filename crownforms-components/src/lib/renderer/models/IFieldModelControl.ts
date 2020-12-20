import {ValidationErrorModel} from '.';

export interface IFieldModelControl {
  focus(): void;
  controlValueError: ValidationErrorModel | null;
}
