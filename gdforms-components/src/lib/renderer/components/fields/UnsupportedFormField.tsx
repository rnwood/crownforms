import { observer } from "mobx-react";
import React from "react";
import {UnsupportedFieldModel} from "../../models";
import { FormField, FieldValidationErrors } from ".";

@observer
export class UnsupportedFormField extends FormField<
  UnsupportedFieldModel
> {
  focus(): void {
    this.elementRef.current?.focus();
    this.elementRef.current?.scrollIntoView();
  }

  private elementRef = React.createRef() as React.RefObject<HTMLDivElement>;

  render() {
    return (
      <div
        ref={this.elementRef}
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

        {this.props.field.validationErrors.length ? (
          <FieldValidationErrors field={this.props.field} />
        ) : (
          <div>{this.props.field.options.details}</div>
        )}
      </div>
    );
  }
}
