import {IFFFieldModel, IFFFieldModelProps } from ".";

export interface IFFNumberFieldModelProps extends IFFFieldModelProps {
  prefix?: string;
  suffix?: string;
  decimalPlaces?: number;
  width?: number;
}

export interface IFFNumberFieldModel extends IFFFieldModel {
  props: IFFNumberFieldModelProps;
}
