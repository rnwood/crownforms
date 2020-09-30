import * as React from "react";

import { ChangeEvent } from "react";
import { observer } from "mobx-react";
import { FieldValidationErrors, FormField } from ".";
import { StringValue, SelectOneFieldModel } from "../../models";

@observer
export class SelectFormField extends FormField<SelectOneFieldModel> {
  private handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    this.props.field.value = new StringValue(
      event.target.dataset.isnull ? null : event.target.value
    );
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
        {!this.props.field.options.hideLabel && (
          <label
            className="govuk-label"
            htmlFor={this.props.field.id}
          >
            {this.props.field.displayNameWithOptionalSuffix}
          </label>
        )}

        {this.props.field.options.hintText && (
          <div id="event-name-hint" className="govuk-hint">
            {this.props.field.options.hintText}
          </div>
        )}

        <FieldValidationErrors field={this.props.field} />

        <select
          className={`govuk-select ${
            this.props.field.validationErrors.length
              ? "govuk-select--error"
              : ""
          }`}
          id={this.props.field.id}
          name={this.props.field.id}
          value={this.props.field.value.value ?? ""}
          onChange={this.handleChange}
          aria-describedby={`${
            this.props.field.options.hintText
              ? this.props.field.id + "-hint"
              : ""
          }`}
        >
          <option value="" data-isnull>
            {this.props.field.options.nullText ?? ""}
          </option>
          {this.props.field.choices.map((v) => {
            return (
              <option key={v.value.value ?? ""} value={v.value.value ?? ""}>
                {v.label}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
}
