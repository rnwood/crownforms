import { observable } from "mobx";
import {FormModel} from "..";
import { Expression } from ".";

export class IfExpression extends Expression<any> {
  constructor(
    condition: Expression<any>,
    trueResult: Expression<any>,
    falseResult: Expression<any>
  ) {
    super();
    this.condition = condition;
    this.trueResult = trueResult;
    this.falseResult = falseResult;
  }

  protected getResultInternal(data: FormModel): any {
    if (!!this.condition.getResult(data)) {
      return this.trueResult.getResult(data);
    }

    return this.falseResult.getResult(data);
  }

  @observable condition: Expression<any>;
  @observable trueResult: Expression<any>;
  @observable falseResult: Expression<any>;
}
