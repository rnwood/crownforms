import { observable } from "mobx";
import {BooleanValue, FormModel} from "..";
import { Expression } from ".";

export class ConvertToBooleanValueExpression extends Expression<
  BooleanValue
> { 
  constructor(expression: Expression<any>) {
    super();
    this.expression = expression;
  }

  @observable
  expression: Expression<any>;

  protected getResultInternal(data: FormModel): BooleanValue {
    return BooleanValue.convertFrom(this.expression.getResult(data));
  }
}
