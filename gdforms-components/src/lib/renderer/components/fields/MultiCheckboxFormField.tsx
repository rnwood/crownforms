import * as React from "react";

import { observer } from "mobx-react";
import { FormField, FieldValidationErrors } from ".";

import {
  SelectSeveralFieldModel,
  StringValue,
  StringArrayValue,
} from "../../models";

@observer
export class MultiCheckboxFormField extends FormField<SelectSeveralFieldModel> {
  private handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = this.props.field.value.value.filter(
      (v) => v.value !== event.target.value
    );

    if (event.target.checked) {
      newValue.push(new StringValue(event.target.value));
    }

    this.field.value = new StringArrayValue(newValue);
  };

  private divRef = React.createRef<HTMLDivElement>();

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
            {this.props.field.choices.map((v, i) => {
              return (
                <div key={v.value.value} className="govuk-checkboxes__item">
                  <input
                    className="govuk-checkboxes__input"
                    id={`${this.props.field.id}/${i}`}
                    name={this.props.field.id}
                    type="checkbox"
                    value={i}
                    checked={this.props.field.value.value.some(
                      (a) => a.value === v.value.value
                    )}
                    onChange={this.handleChange}
                  />
                  <label
                    className="govuk-label govuk-checkboxes__label"
                    htmlFor={`${this.props.field.id}/${i}`}
                  >
                    {v.label}
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>
      </div>
    );
  }
}
