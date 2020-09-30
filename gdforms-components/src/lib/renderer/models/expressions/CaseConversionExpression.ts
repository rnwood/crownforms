import { observable } from "mobx";
import {FormModel} from "..";
import { Expression } from ".";

export enum CaseConversionType {
  Upper,
  Lower,
  UpperFirst,
  LowerFirst,
}

export class CaseConversionExpression extends Expression<any> {
  constructor(valueExpression: Expression<any>, type: CaseConversionType) {
    super();
    this.valueExpression = valueExpression;
    this.type = type;
  }

  protected getResultInternal(data: FormModel): any {
    let value = String(this.valueExpression.getResult(data));

    switch (this.type) {
      case CaseConversionType.Upper:
        return value.toUpperCase();
      case CaseConversionType.Lower:
        return value.toLowerCase();
      case CaseConversionType.UpperFirst:
        return value.charAt(0).toUpperCase() + value.substring(1);
      case CaseConversionType.LowerFirst:
        return value.charAt(0).toLowerCase() + value.substring(1);
    }
  }

  @observable valueExpression: Expression<any>;

  @observable type: CaseConversionType;
}
