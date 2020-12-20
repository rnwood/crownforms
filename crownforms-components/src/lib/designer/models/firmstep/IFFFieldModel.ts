import { IFFModel } from './IFFModel';

export interface IFFFieldModelProps extends IFFModel {
  label: string;
  dataName?: string;
  hidden?: boolean | null;
  labelPosition?: string | null;
  mandatory?: boolean | null;
  mandatoryMessage?: string | null;
  helpText?: string | null;
  displayCondition?: string | null;
  mandatoryCondition?: string | null;
  validationMask?: string | null;
  _custom_regex_?: string | null;
  validationMaskMessageValue?: string | null;
  validationMaskMessage?: string | null;
  validationCondition?: string | null;
  validationConditionMessage?: string | null;
  defaultValue?: string | null;
  defaultValueText?: string | null;
  defaultType?: string|null;
  readOnly?: boolean|null;
  readonlyCondition?: string|null;
}

export interface IFFFieldModel extends IFFModel {
  type: string;
  props: IFFFieldModelProps;
}
