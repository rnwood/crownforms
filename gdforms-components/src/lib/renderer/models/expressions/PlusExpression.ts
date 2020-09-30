import { observable } from "mobx";
import {FormModel} from "..";
import { Expression } from ".";

export class PlusExpression extends Expression<any> {
  constructor(left: Expression<any>, right: Expression<any>) {
    super();
    this.left = left;
    this.right = right;
  }

  @observable left: Expression<any>;
  @observable right: Expression<any>;

  private coaleseMissingValues(value: any) {
    if (typeof value === "number") {
      return isNaN(value) ? 0 : value;
    } else if (value === undefined || value === null) {
      return "";
    }

    return value;
  }

  protected getResultInternal(data: FormModel) {
    let leftValue = this.left.getResult(data);
    let rightValue = this.right.getResult(data);

    leftValue = this.coaleseMissingValues(leftValue);
    rightValue = this.coaleseMissingValues(rightValue);

    return leftValue + rightValue;
  }
}
