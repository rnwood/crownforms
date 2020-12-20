/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { observable } from "mobx";
import {FormModel} from "..";
import { Expression } from ".";

export enum ComparisonExpressionType {
  GreaterThan = ">",
  GreaterThanEquals = ">=",
  LessThan = "<",
  LessThanEquals = "<=",
}

export class ComparisonExpression extends Expression<any> {
  protected getResultInternal(data: FormModel): any {
    const leftValue = this.left.getResult(data);
    const rightValue = this.right.getResult(data);

    switch (this.type) {
      case ComparisonExpressionType.GreaterThan:
        return leftValue > rightValue;
      case ComparisonExpressionType.GreaterThanEquals:
        return leftValue >= rightValue;
      case ComparisonExpressionType.LessThan:
        return leftValue < rightValue;
      case ComparisonExpressionType.LessThanEquals:
        return leftValue <= rightValue;
      default:
        throw new Error(
          `Comparison type ${
            this.type as ComparisonExpressionType
          } not implemented`
        );
    }
  }

  constructor(
    left: Expression<any>,
    type: ComparisonExpressionType,
    right: Expression<any>
  ) {
    super();
    this.left = left;
    this.type = type;
    this.right = right;
  }

  @observable left: Expression<any>;

  @observable right: Expression<any>;

  @observable type: ComparisonExpressionType;
}
