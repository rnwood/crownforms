import * as React from "react";

import { observer } from "mobx-react";
import { FormField, FieldValidationErrors } from ".";
import { StringValue, TwoChoiceFieldModel } from "../../../renderer";
import { computed } from 'mobx';

@observer
export class CheckboxFormField extends FormField<
  TwoChoiceFieldModel<StringValue>
> {
  private handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.props.field.value = event.target.checked
      ? this.props.field.trueValue
      : this.props.field.falseValue;
  };


  private readonly divRef = React.createRef<HTMLDivElement>();

  focus(): void {
    this.divRef.current?.scrollIntoView();
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
         disabled={this.props.field.readOnly}
          className="govuk-fieldset"
          aria-describedby={`${
            this.props.field.options.hintText
              ? `${this.props.field.id}-hint`
              : ""
          }`}
        >
          {!this.props.field.options.hideLabel && (
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--2">
              <h1 className="govuk-fieldset__heading">
                {this.props.field.displayNameWithOptionalSuffix}
              </h1>
            </legend>
          )}

          {this.props.field.options.hintText && (
            <div id="event-name-hint" className="govuk-hint">
              {this.props.field.options.hintText}
            </div>
          )}

          <FieldValidationErrors field={this.props.field} />

          <div className="govuk-checkboxes">
            <div className="govuk-checkboxes__item">
              <input
                className="govuk-checkboxes__input"
                id={this.props.field.id}
                name={this.props.field.id}
                type="checkbox"
                value={this.props.field.trueValue.value ?? ""}
                checked={
                  this.props.field.value.value ===
                  this.props.field.trueValue.value
                }
                onChange={this.handleChange}
              />
              <label
                className="govuk-label govuk-checkboxes__label"
                htmlFor={this.props.field.id}
              >
                {this.props.field.options.trueLabel}
              </label>
            </div>
          </div>
        </fieldset>
      </div>
    );
  }
}
