import { observable } from "mobx";
import {FormModel} from "..";
import { Expression } from ".";

export class EqualsExpression extends Expression<any> {
  constructor(
    left: Expression<any>,
    notEquals: boolean,
    right: Expression<any>
  ) {
    super();
    this.left = left;
    this.notEquals = notEquals;
    this.right = right;
  }

  @observable left: Expression<any>;
  @observable right: Expression<any>;
  @observable notEquals: boolean;

  protected getResultInternal(form: FormModel): boolean {
    let leftValue = this.left.getResult(form);
    let rightValue = this.right.getResult(form);

    if (this.notEquals) {
      return leftValue != rightValue;
    } else {
      return leftValue == rightValue;
    }
  }
}
