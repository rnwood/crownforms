import { observable } from "mobx";
import {FormModel} from "..";

export abstract class Expression<T> {
  protected abstract getResultInternal(data: FormModel): T;

  @observable
  lastResult: T | undefined;

  getResult(data: FormModel): T {
    const result = this.getResultInternal(data);
    this.lastResult = result;

    return result;
  }
}
