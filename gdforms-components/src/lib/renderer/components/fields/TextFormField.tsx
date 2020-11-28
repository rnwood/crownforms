import * as React from "react";

import { observer } from "mobx-react";
import { FormField, FieldValidationErrors } from ".";
import { StringValue, TextFieldModel } from "../../models";

@observer
export class TextFormField extends FormField<TextFieldModel> {
  focus(): void {
    this.divRef.current?.scrollIntoView();
  }

  private divRef = React.createRef() as React.RefObject<HTMLDivElement>;

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.field.value = new StringValue(event.target.value);
  };

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

        <input
          disabled={this.props.field.readOnly}
          className={`govuk-input ${
            this.props.field.validationErrors.length ? "govuk-input--error" : ""
          } ${
            this.props.field.options.width
              ? "govuk-input--width-" + this.props.field.options.width
              : ""
          }`}
          id={this.props.field.id}
          name={this.props.field.id}
          type="text"
          value={this.props.field.value.value ?? ""}
          onChange={this.handleChange}
          aria-describedby={`${
            this.props.field.options.hintText
              ? this.props.field.id + "-hint"
              : ""
          } ${
            this.props.field.validationErrors.length
              ? this.props.field.id + "-error"
              : ""
          }`}
        />
      </div>
    );
  }
}
