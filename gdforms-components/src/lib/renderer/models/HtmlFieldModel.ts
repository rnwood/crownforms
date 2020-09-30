import { observable } from "mobx";
import { StringValue } from "./TypedValue";
import {FieldModel,  IFieldModelOptions, SectionModel, ValueFieldModel } from ".";
import { IFFHtmlFieldModel } from "./firmstep";
import {LiteralExpression} from "./expressions";
import { IFieldModelState } from './FieldModel';

export interface IHtmlFieldModelOptions
  extends IFieldModelOptions {
    type: "html";
    controlType: "renderhtml";
  }

export class HtmlFieldModel extends ValueFieldModel<
  StringValue,
  IHtmlFieldModelOptions
> {
  protected getDefaultValueFromText(text: StringValue): StringValue {
    throw new Error('Method not implemented.');
  }
  constructor(section: SectionModel, options: IHtmlFieldModelOptions, state?: IFieldModelState|undefined) {
    super(StringValue, section, options ?? {
      ...FieldModel.getNewFieldOptionsBase("html", StringValue, "renderhtml", section),
      defaultValueExpression: "'New HTML field'"
    }, state);
  }

  protected async getDefaultValueAsync() {
    return new StringValue(null);
  }
}
