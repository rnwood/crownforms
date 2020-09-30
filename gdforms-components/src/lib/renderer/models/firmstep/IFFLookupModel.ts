import { IFFFieldModel, IFFModel } from '.';

export interface IFFLookupModel_Output_template {
  fields: string;
  method: string,
  url: string,
  path_to_values: string;
  responseType: string;
}

export interface IFFLookupModel  extends IFFModel {
  ID: string,
  Name: string,
  Type: string,
  Output_template: string;
}
