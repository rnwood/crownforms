import * as React from "react";

import { observer } from "mobx-react";
import { observable } from "mobx";
import {FormField, IFormFieldProps, FieldValidationErrors } from ".";
import { DateValue, DateFieldModel, ValidationErrorModel, ValidationErrorModelSeverity } from "../../models";

@observer
export class DateFormField extends FormField<DateFieldModel> {
  constructor(props: IFormFieldProps<DateFieldModel>) {
    super(props);

    this.updateFromValue();
  }

  @observable
  private day: string | null = null;

  @observable
  private month: string | null = null;

  @observable
  private year: string | null = null;

  private updateFromValue = (): void => {
    this.day = this.props.field.value.value?.getDate()?.toString() ?? "";
    this.month = this.props.field.value.value
      ? (this.props.field.value.value.getMonth() + 1).toString()
      : "";
    this.year = this.props.field.value.value?.getFullYear()?.toString() ?? "";
  };

  focus(): void {
    this.divRef.current?.scrollIntoView();
  }

  private divRef = React.createRef<HTMLDivElement>();

  private handleDayChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    this.day = event.target.value;
    this.tryUpdateValue();
  };

  private handleMonthChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    this.month = event.target.value;
    this.tryUpdateValue();
  };

  private handleYearChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    this.year = event.target.value;
    this.tryUpdateValue();
  };

  private tryUpdateValue(): void {
    this.controlValueError = null;
    if (this.day && this.month && this.year) {
      const day = Number.parseInt(this.day);
      const month = Number.parseInt(this.month);
      const year = Number.parseInt(this.year);

      const newValue = new Date(year, month, day);
      this.props.field.value = new DateValue(newValue);
    } else {
      if (this.day || this.month || this.year) {
        this.controlValueError = new ValidationErrorModel(this.props.field,"Invalid date", ValidationErrorModelSeverity.Correctable);
      } 
      this.props.field.value = new DateValue(null);
    }
  }

  render(): React.ReactNode {
    return (
      <div
        ref={this.divRef}
        className={`govuk-form-group ${
          this.props.field.validationErrors.length
            ? "govuk-form-group--error"
            : ""
        }`}
      >
        <fieldset
          className="govuk-fieldset"
          role="group"
          aria-describedby={`${
            this.props.field.options.hintText
              ? `${this.props.field.id}-hint`
              : ""
          } ${
            this.props.field.validationErrors.length
              ? `${this.props.field.id}-error`
              : ""
          }`}
        >
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--2">
            <h1 className="govuk-fieldset__heading">
              {this.props.field.displayNameWithOptionalSuffix}
            </h1>
          </legend>
          {this.props.field.options.hintText && (
            <div id="event-name-hint" className="govuk-hint">
              {this.props.field.options.hintText}
            </div>
          )}
          <FieldValidationErrors field={this.props.field} />

          <div className="govuk-date-input" id={this.props.field.id}>
            <div className="govuk-date-input__item">
              <div className="govuk-form-group">
                <label
                  className="govuk-label govuk-date-input__label"
                  htmlFor={`${this.props.field.id}-day`}
                >
                  Day
                </label>
                <input
                  className={`govuk-input govuk-date-input__input govuk-input--width-2 ${
                    this.props.field.validationErrors.length
                      ? "govuk-input--error"
                      : ""
                  }`}
                  id={`${this.props.field.id}-day`}
                  value={this.day ?? ""}
                  name={`${this.props.field.id}-day`}
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  onChange={this.handleDayChange}
                />
              </div>
            </div>
            <div className="govuk-date-input__item">
              <div className="govuk-form-group">
                <label
                  className="govuk-label govuk-date-input__label"
                  htmlFor={`${this.props.field.id}-month`}
                >
                  Month
                </label>
                <input
                  className={`govuk-input govuk-date-input__input govuk-input--width-2 ${
                    this.props.field.validationErrors.length
                      ? "govuk-input--error"
                      : ""
                  }`}
                  id={`${this.props.field.id}-month`}
                  value={this.month ?? ""}
                  name={`${this.props.field.id}-month`}
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  onChange={this.handleMonthChange}
                />
              </div>
            </div>
            <div className="govuk-date-input__item">
              <div className="govuk-form-group">
                <label
                  className="govuk-label govuk-date-input__label"
                  htmlFor={`${this.props.field.id}-year`}
                >
                  Year
                </label>
                <input
                  className={`govuk-input govuk-date-input__input govuk-input--width-4 ${
                    this.props.field.validationErrors.length
                      ? "govuk-input--error"
                      : ""
                  }`}
                  id={`${this.props.field.id}-year`}
                  value={this.year ?? ""}
                  name={`${this.props.field.id}-year`}
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  onChange={this.handleYearChange}
                />
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    );
  }
}
