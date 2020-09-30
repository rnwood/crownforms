import { IFFFieldModel, IFFFieldModelProps } from '.';

export interface IFFAutoLookupFieldModelProps extends IFFFieldModelProps {
  lookup: string;
  lookupCondition: "once"
}

export interface IFFAutoLookupFieldModel extends IFFFieldModel {
  type: "autoLookup";
  props: IFFAutoLookupFieldModelProps;
}
