import {IFFFieldModel, IFFFieldModelProps } from ".";

export interface IFFHtmlFieldModelProps extends IFFFieldModelProps {
  content: string;
}

export interface IFFHtmlFieldModel extends IFFFieldModel {
  props: IFFHtmlFieldModelProps;
}
