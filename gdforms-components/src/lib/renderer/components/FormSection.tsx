import * as React from "react";

import { observer } from "mobx-react";
import { DroppableProvided, Droppable } from "react-beautiful-dnd";
import { FormSectionField, IFormSectionFieldProps } from ".";
import { SectionModel, ValidationErrorModel } from "../models";
import { computed } from 'mobx';
import { IFormComponentProps } from './IFormComponentProps';

export interface IFormSectionProps extends IFormComponentProps {
  data: SectionModel;
  hideTitle?: boolean;
}

@observer
export class FormSection extends React.Component<IFormSectionProps> {


  @computed
  private get firstValidationErrors(): ValidationErrorModel[] {
    let allValidationErrors = this.props.data.validationErrors;
    return this.props.data.validationErrors.slice(0, 10);
  }

  @computed
  private get otherValidationErrors(): ValidationErrorModel[] {
    return this.props.data.validationErrors.filter(
      (e) => !this.firstValidationErrors.includes(e)
    );
  }

  private renderValidationSummary() {
    return (
      <>
        {this.props.data.validationErrors.length > 0 && (
          <div
            className="govuk-error-summary"
            aria-labelledby="error-summary-title"
            role="alert"
            tabIndex={-1}
            data-module="govuk-error-summary"
          >
            <h2 className="govuk-error-summary__title" id="error-summary-title">
              There is a problem
            </h2>
            <div className="govuk-error-summary__body">
              <ul className="govuk-list govuk-error-summary__list">
                {this.firstValidationErrors.map((err, i) => (
                  <li key={i}>
                    <a
                      href="javascript:;"
                      onClick={() => err.component.focus()}
                    >
                      {err.message}
                    </a>
                  </li>
                ))}
              </ul>
              {this.otherValidationErrors.length > 0 && (
                <div
                  title={this.otherValidationErrors
                    .map((e) => e.message)
                    .join("\n")}
                >
                  and {this.otherValidationErrors.length} other errors.
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
    }


  render(): React.ReactNode {
    return (
      <>
        {!this.props.hideTitle && (
          <h2 className="govuk-heading-l">
            {this.props.data.options.displayName}
          </h2>
        )}
        
        {!this.props.data.parentForm?.parent && this.renderValidationSummary()}

        {this.props.data.fields.map((f, i) => {
          const fieldProps : IFormSectionFieldProps = {
            field:f, index: i,
            hooks: this.props.hooks
          };
          return this.props.hooks?.onRenderField ? this.props.hooks.onRenderField(fieldProps) : <FormSectionField key={i.toString()} {...fieldProps} />
        })}
      </>
    );
  }


}
