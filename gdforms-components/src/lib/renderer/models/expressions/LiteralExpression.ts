import { observable } from "mobx";
import {FormModel} from "..";
import { Expression } from ".";

export class LiteralExpression extends Expression<any> {
  constructor(value: any) {
    super();
    this.value = value;
  }

  @observable
  value: any;

  protected getResultInternal(data: FormModel): any {
    return this.value;
  }
}
