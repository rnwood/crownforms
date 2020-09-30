import { observable } from "mobx";
import {FormModel} from "..";
import { Expression } from ".";

export class FieldValueExpression extends Expression<any> {
  constructor(fieldName: string) {
    super();
    this.fieldName = fieldName;
  }

  @observable
  fieldName: string;

  protected getResultInternal(data: FormModel): any {
    let result = data.getFieldValueIncludingRepeatedSubForms(this.fieldName);
    if (Array.isArray(result)) {
      return result.map((r) => r?.value);
    }

    if (result?.value && Array.isArray(result.value)) {
      return (result.value as any[]).map((r) => r?.value);
    }
    return result?.value;
  }
}
