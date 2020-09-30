import * as React from "react";

import { ChangeEvent } from "react";
import { observer } from "mobx-react";
import { FieldValidationErrors, FormField } from ".";
import { StringValue, SelectOneFieldModel } from "../../models";

@observer
export class RadioFormField extends FormField<SelectOneFieldModel> {
  private handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      this.props.field.value = new StringValue(event.target.value);
    }
  };

  private divRef = React.createRef<HTMLDivElement>();

  focus() {
    this.divRef.current?.scrollIntoView();
  }

  render() {
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
              ? this.props.field.id + "-hint"
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

          <div
            ref={this.divRef}
            className={`govuk-radios ${
              this.props.field.choices.length <= 2
                ? "govuk-radios--inline"
                : ""
            }`}
          >
            {this.props.field.choices.map((v, i) => (
              <div key={v.value.value ?? ""} className="govuk-radios__item">
                <input
                  className="govuk-radios__input"
                  id={this.props.field.id + "/" + i}
                  name={this.props.field.id}
                  type="radio"
                  value={v.value.value ?? ""}
                  checked={this.props.field.value.value === v.value.value ?? ""}
                  onChange={this.handleChange}
                />
                <label
                  className="govuk-label govuk-radios__label"
                  htmlFor={this.props.field.id + "/" + i}
                >
                  {v.label}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
    );
  }
}
