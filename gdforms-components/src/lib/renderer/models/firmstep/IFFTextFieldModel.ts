import {IFFFieldModel, IFFFieldModelProps } from ".";

export interface IFFTextFieldModelProps extends IFFFieldModelProps {
  width?: number;
}

export interface IFFTextFieldModel extends IFFFieldModel {
  props: IFFTextFieldModelProps;
}
