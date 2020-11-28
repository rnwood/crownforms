import * as React from "react";

import { observer } from "mobx-react";
import { FormField, FieldValidationErrors } from ".";
import { StringValue, TextFieldModel } from "../../models";

@observer
export class TextAreaFormField extends FormField<TextFieldModel> {
  handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    this.props.field.value = new StringValue(event.target.value);
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

        <textarea
          disabled={this.props.field.readOnly}
          className={`govuk-textarea ${
            this.props.field.validationErrors.length
              ? "govuk-textarea--error"
              : ""
          }`}
          id={this.props.field.id}
          name={this.props.field.id}
          rows={5}
          value={this.props.field.value.value ?? ""}
          onChange={this.handleChange}
          aria-describedby={`${
            this.props.field.options.hintText
              ? `${this.props.field.id}-hint`
              : ""
          }`}
        />
      </div>
    );
  }
}
