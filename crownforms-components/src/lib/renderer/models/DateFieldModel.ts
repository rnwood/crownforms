import { computed, observable } from "mobx";
import {FieldModel,  IFieldModelOptions, SectionModel, DateValue, ValidationErrorModel, IFieldModelState, StringValue, ValueFieldModel } from ".";
import { ValidationErrorModelSeverity } from './ValidationErrorModel';

export interface IDateFieldOptions extends IFieldModelOptions {
  type: "date"
  controlType: "datefield"
}

export class DateFieldModel extends ValueFieldModel<
  DateValue,
  IDateFieldOptions
> {
  protected getDefaultValueFromText(text: StringValue): DateValue {
    throw new Error('Method not implemented.');
  }
  constructor(section: SectionModel, options?: IDateFieldOptions, state?: IFieldModelState|undefined) {
    super(
      DateValue,
      section,
      options ?? {
        ...FieldModel.getNewFieldOptionsBase(
          "date",
          DateValue,
          "datefield",
          section
        ),
      },
      state
    );
  }

  async getDefaultValueAsync() {
    return new DateValue(null);
  }

  @computed
  get validateField(): ValidationErrorModel[] {
    return !this.value.value || isNaN(this.value.value.valueOf())
      ? [
          new ValidationErrorModel(
            this,
            `${this.options.displayName} must be a valid date`,
            ValidationErrorModelSeverity.Correctable
          ),
        ]
      : [];
  }
}
