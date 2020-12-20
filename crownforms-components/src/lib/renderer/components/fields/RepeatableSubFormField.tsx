import * as React from "react";
import { observer } from "mobx-react";
import { FormField } from ".";
import { Form } from "..";
import { SubFormValue, RepeatableSubFormFieldModel } from "../../models";

@observer
export class RepeatableSubFormField extends FormField<
  RepeatableSubFormFieldModel
> {
  handleAddNewClickAsync = async (
    event: React.SyntheticEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    let newItem = await this.props.field.addNewItemAsync();
    newItem.value?.focus();
  };

  focus(): void {
    this.divRef.current?.scrollIntoView();
  }

  private divRef: React.RefObject<HTMLDivElement> = React.createRef();

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
              className="govuk-label govuk-label--1"
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

        {this.props.field.value.value.map((v, i) => (
          <React.Fragment key={i.toString()}>
            <button
              disabled={this.props.field.readOnly}
              aria-disabled={this.props.field.readOnly}
              className={`govuk-button govuk-button--secondary ${
                this.props.field.readOnly ? "govuk-button--disabled" : ""
              }`}
              type="button"
              data-module="govuk-button"
              style={{ float: "right" }}
              onClick={(event): void => {
                event.preventDefault();
                this.handleDeleteClick(v);
              }}
            >
              Delete
            </button>
            {v.value && (
              <Form hooks={this.props.hooks} hideTitle form={v.value} />
            )}
          </React.Fragment>
        ))}

        <button
          disabled={this.props.field.readOnly}
          aria-disabled={this.props.field.readOnly}
          className={`govuk-button govuk-button--secondary ${
            this.props.field.readOnly ? "govuk-button--disabled" : ""
          }`}
          type="button"
          data-module="govuk-button"
          onClick={this.handleAddNewClickAsync}
        >
          Add New
        </button>
      </div>
    );
  }

  handleDeleteClick(v: SubFormValue): void {
    this.props.field.value.value.splice(
      this.props.field.value.value.indexOf(v),
      1
    );
  }
}
