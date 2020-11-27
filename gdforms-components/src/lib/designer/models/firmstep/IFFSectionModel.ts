import {IFFFieldModel, IFFFieldModelProps, IFFModel } from ".";

export interface IFFSectionModel  extends IFFModel {
  name: string;
  id: string;
  fields: IFFFieldModel[];
  props: {
    displayCondition?: string;
    validation?: string;
    validationMessage?: string;
  };
}
