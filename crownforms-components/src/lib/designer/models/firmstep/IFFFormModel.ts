import {IFFFieldModel, IFFFieldModelProps, IFFSectionModel, IFFLookupModel, IFFModel } from ".";

export interface IFFFormModel extends IFFModel {
  formName: string;
  sections: IFFSectionModel[];
  props: { 
    id: string 
    integrationDefinition?: {
      [key: string]: IFFLookupModel
    }
  };
}
