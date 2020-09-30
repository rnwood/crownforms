import {IFFFieldModel, IFFFieldModelProps, IFFFormModel } from ".";

export interface IFFSubFormFieldModelProps extends IFFFieldModelProps {
  subformDefinition: IFFFormModel;
  displayStyle: "summary";
  repeatable?: boolean;
}

export interface IFFSubFormFieldModel extends IFFFieldModel {
  props: IFFSubFormFieldModelProps;
}
