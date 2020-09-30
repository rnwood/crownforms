import {IFFFieldModel, IFFFieldModelProps } from ".";
import { IFFModel } from './IFFModel';

export interface IFFSelectFieldModelProps extends IFFFieldModelProps {
  selectLabel?: string;
  listOfValues?: [{ label: string; value: string|number|boolean|null }];
  lookupButton?: string|undefined;
  lookup?: string|undefined;
}

export interface IFFSelectFieldModel extends IFFFieldModel {
  props: IFFSelectFieldModelProps;
  type: "select";
}
