import { observable } from "mobx";
import {FormModel} from "..";
import { Expression } from ".";

export class ContainsExpression extends Expression<any> {
  constructor(
    left: Expression<any>,
    right: Expression<any>,
    caseInsensitive: boolean
  ) {
    super();
    this.left = left;
    this.caseInsensitive = caseInsensitive;
    this.right = right;
  }

  @observable left: Expression<any>;

  @observable right: Expression<any>;

  @observable caseInsensitive: boolean;

  protected getResultInternal(form: FormModel): unknown {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const left = this.left.getResult(form) as any;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const right = this.right.getResult(form) as any;

    let list: any[];
    if (!Array.isArray(left)) {
      list = [left];
    } else {
      list = left;
    }

    return (
      (!this.caseInsensitive && list.includes(right)) ||
      (this.caseInsensitive &&
        list.some(
          (i) =>
            i?.toString().localeCompare(right?.toString(), undefined, {
              sensitivity: "accent",
            }) === 0
        ))
    );
  }
}
