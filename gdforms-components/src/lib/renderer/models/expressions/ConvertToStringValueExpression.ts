import { observable } from "mobx";
import {FormModel, StringValue} from "..";
import { Expression } from ".";

export class ConvertToStringValueExpression extends Expression<
  StringValue
> {
  constructor(expression: Expression<any>) {
    super();
    this.expression = expression;
  }

  @observable
  expression: Expression<any>;

  protected getResultInternal(data: FormModel): StringValue {
    return StringValue.convertFrom(this.expression.getResult(data));
  }
}
