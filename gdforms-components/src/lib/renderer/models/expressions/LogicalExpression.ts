import { observable } from "mobx";
import {FormModel} from "..";
import { Expression } from ".";

export class LogicalExpression extends Expression<boolean> {
  constructor(left: Expression<any>, and: boolean, right: Expression<any>) {
    super();
    this.left = left;
    this.right = right;
    this.and = and;
  }

  @observable
  left: Expression<any>;

  @observable
  right: Expression<any>;

  @observable
  and: boolean;

  protected getResultInternal(data: FormModel): boolean {
    if (this.and) {
      return !!this.left.getResult(data) && !!this.right.getResult(data);
    }

    return !!this.left.getResult(data) || !!this.right.getResult(data);
  }
}
