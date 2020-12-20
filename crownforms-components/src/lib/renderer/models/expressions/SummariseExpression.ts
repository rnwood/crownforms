/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { observable } from "mobx";
import {FormModel} from "..";
import { Expression } from ".";

export enum SummaryType {
  Max,
  Min,
  Sum,
  Count,
}

export class SummariseExpression extends Expression<any> {
  constructor(expression: Expression<any>, type: SummaryType) {
    super();
    this.expression = expression;
    this.type = type;
  }

  @observable
  expression: Expression<any>;

  @observable
  type: SummaryType;

  protected getResultInternal(data: FormModel): any {
    const values = this.expression.getResult(data) ?? ([] as any[]);

    switch (this.type) {
      case SummaryType.Max:
        return values
          .filter((v: any) => v != null)
          .reduce((a: any, b: any) => (a > b ? a : b), undefined);
      case SummaryType.Min:
        return values
          .filter((v: any) => v != null)
          .reduce((a: any, b: any) => (a < b ? a : b), undefined);
      case SummaryType.Sum:
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        return values
          .filter((v: any) => v != null)
          .reduce((a: any, b: any) => a + b, 0);
      case SummaryType.Count:
        return values.length ?? 0;
      default:
        throw new Error(`Unhandled summary type ${this.type as SummaryType}`);
    }
  }
}
