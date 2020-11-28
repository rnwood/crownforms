import * as React from "react";

import { observer } from "mobx-react";
import { FormField, FieldValidationErrors } from ".";
import { NumberValue, NumberFieldModel } from "../../models";

@observer
export class NumberFormField extends FormField<NumberFieldModel> {
  focus(): void {
    this.inputRef.current?.scrollIntoView();
  }

  private inputRef = React.createRef<HTMLInputElement>();

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.props.field.value = new NumberValue(parseFloat(event.target.value));
  };

  render(): React.ReactNode {
    return (
      <div
        className={`govuk-form-group ${
          this.props.field.validationErrors.length
            ? "govuk-form-group--error"
            : ""
        }`}
      >
        {!this.props.field.options.hideLabel && (
          <h1 className="govuk-label-wrapper">
            <label
              className="govuk-label govuk-label--2"
              htmlFor={this.props.field.id}
            >
              {this.props.field.displayNameWithOptionalSuffix}
            </label>
          </h1>
        )}

        {this.props.field.options.hintText && (
          <div id="event-name-hint" className="govuk-hint">
            {this.props.field.options.hintText}
          </div>
        )}

        <FieldValidationErrors field={this.props.field} />

        <div className="govuk-input__wrapper">
          {this.props.field.options.prefix && (
            <div className="govuk-input__prefix" aria-hidden="true">
              {this.props.field.options.prefix}
            </div>
          )}
          <input
            disabled={this.props.field.readOnly}
            className={`govuk-input ${
              this.props.field.validationErrors.length
                ? "govuk-input--error"
                : ""
            } ${
              this.props.field.options.width
                ? `govuk-input--width-${this.props.field.options.width}`
                : ""
            }`}
            ref={this.inputRef}
            id={this.props.field.id}
            name={this.props.field.id}
            type="text"
            value={
              this.props.field.value.value === null ||
              isNaN(this.props.field.value.value)
                ? ""
                : this.props.field.value.value
            }
            onChange={this.handleChange}
            aria-describedby={`${
              this.props.field.options.hintText
                ? `${this.props.field.id}-hint`
                : ""
            } ${
              this.props.field.validationErrors.length
                ? `${this.props.field.id}-error`
                : ""
            }`}
            spellCheck={false}
            pattern={
              this.props.field.options.decimalPlaces === 0
                ? "[0-9]*}"
                : undefined
            }
            inputMode={
              this.props.field.options.decimalPlaces === 0
                ? "numeric"
                : undefined
            }
          />
          {this.props.field.options.suffix && (
            <div className="govuk-input__suffix" aria-hidden="true">
              {this.props.field.options.suffix}
            </div>
          )}
        </div>
      </div>
    );
  }
}
