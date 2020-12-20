import { IFieldModelOptions } from './FieldModel';
import { IOptions } from '.';

export interface IChoicesFieldModelOptions extends IFieldModelOptions {
  choices: ({ label: string; value: string|number|boolean|null }[]) | {lookup: string};
  autoPopulateFields?: boolean
}
