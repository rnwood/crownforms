import { observable } from "mobx";
import {FormModel} from "..";
import { Expression } from ".";

export class ArrayAccessExpression extends Expression<any> {
  constructor(expression: Expression<any>, indexExpression: Expression<any>) {
    super();
    this.expression = expression;
    this.indexExpression = indexExpression;
  }

  @observable
  expression: Expression<any>;

  @observable
  indexExpression: Expression<any>;

  protected getResultInternal(data: FormModel): unknown {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const expressionValue = this.expression.getResult(data) as any;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const indexValue = this.indexExpression.getResult(data) as any;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return Array.isArray(expressionValue)
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expressionValue[indexValue]
      : undefined;
  }
}
