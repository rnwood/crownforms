import * as React from "react";
import { observer } from "mobx-react";
import { action, computed, observable } from "mobx";
import { FormEvent } from "react";
import {
  Droppable,
  DroppableProvided,
  Draggable,
  DraggableProvided,
} from "react-beautiful-dnd";
import { FormSection, IFormComponentProps as IFormComponentProps, IFormSectionProps } from ".";
import {
  FieldModel,
  IFieldModelOptions,
  FormModel,
  SectionModel,
  TypedValue,
  ValidationErrorModel,
  ValidationErrorModelSeverity,
} from "../models";
import { IFormSectionFieldProps } from './FormSectionField';

interface IProps extends IFormComponentProps{
  form: FormModel;
  hideTitle?: boolean;

}

@observer
export class Form extends React.Component<IProps> {
  @action
  tryShowSection(newSection: SectionModel): boolean {
    if (
      this.form.currentSection &&
      this.form.sections.indexOf(this.form.currentSection) <
        this.form.sections.indexOf(newSection)
    ) {
      this.form.currentSection.validationEnabled = true;
    } else if (this.form.currentSection) {
      this.form.currentSection.validationEnabled = false;
    }

    if (!this.form.currentSection?.validationErrors.length) {
      this.form.currentSection = newSection;
      newSection.validationEnabled = false;

      return true;
    }
    this.showFirstValidationError();

    return false;
  }

  private showFirstValidationError(): void {
    this.form.currentSection?.validationErrors[0]?.component.focus();
  }

  private handleNextSectionClick = (): void => {
    const newIndex =
      this.form.visibleSections.indexOf(this.form.currentSection!) + 1;

    if (this.form.visibleSections.length > newIndex) {
      this.tryShowSection(this.form.visibleSections[newIndex]);
    }
  };

  private handleSubmitClick = (): void => {
    this.form.currentSection!.validationEnabled = true;
    if (this.form.currentSection?.validationErrors.length == 0) {
      alert("Submit");
    } else {
      this.showFirstValidationError();
    }
  };

  private handlePrevSectionClick = () => {
    const newIndex =
      this.form.visibleSections.indexOf(this.form.currentSection!) - 1;

    if (newIndex >= 0) {
      this.tryShowSection(this.form.visibleSections[newIndex]);
    }
  };

  constructor(props: IProps) {
    super(props);
    this.form = props.form;
  }

  @observable
  private form: FormModel;

  @computed
  private get fatalValidationErrors(): ValidationErrorModel[] {
    let allValidationErrors = this.form.validationErrors;
    return allValidationErrors.filter(
      (e) => e.severity === ValidationErrorModelSeverity.Fatal
    );
  }

  private renderFatalErrors() {
    return (
      <div
        className="govuk-error-summary"
        aria-labelledby="error-fatal-summary-title"
        role="alert"
        tabIndex={-1}
        data-module="govuk-error-summary"
      >
        <h2
          className="govuk-error-summary__title"
          id="error-fatal-summary-title"
        >
          There is a problem
        </h2>
        <div className="govuk-error-summary__body">
          <ul className="govuk-list govuk-error-summary__list">
            {this.fatalValidationErrors.map((err, i) => (
              <li key={i}>{err.message}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  @computed
  private get visibleSections() {
    if (
      this.props.form.parent &&
      this.props.form.getFieldValue("querystring:_showallfields")?.value
    ) {
      return this.props.form.sections;
    }

    return this.props.form.visibleSections;
  }

  private renderForm() {
    return (
      <>
        {!this.props.hideTitle && (
          <h1 className="govuk-heading-xl">{this.form.options.title}</h1>
        )}

        {this.fatalValidationErrors.length > 0
          ? this.renderFatalErrors()
          : this.renderFormBody()}
      </>
    );
  }

  private renderFormSection(s: SectionModel) {
    const sectionProps: IFormSectionProps = {
      hideTitle: !!this.form.parent,
      data: s,
      hooks: this.props.hooks
    };
    return this.props.hooks.onRenderSection ? (
      this.props.hooks.onRenderSection(sectionProps)
    ) : (
      <FormSection {...sectionProps} />
    );
  }

  private renderFormBody() {
    return (
      <>
        {this.visibleSections
          .filter((s) => this.form.currentSection === s)
          .map((s) => (
            <div key={s.options.name} id={s.options.name}>
              {this.renderFormSection(s)}
            </div>
          ))}
        {this.form.currentSection &&
          this.form.visibleSections.indexOf(this.form.currentSection) > 0 && (
            <a
              href="#"
              role="button"
              draggable="false"
              className="govuk-button govuk-button--secondary"
              data-module="govuk-button"
              onClick={this.handlePrevSectionClick}
            >
              Back
            </a>
          )}
        &nbsp;&nbsp;
        {this.form.currentSection &&
          this.form.visibleSections.length >
            this.form.visibleSections.indexOf(this.form.currentSection) + 1 && (
            <a
              href="#"
              role="button"
              draggable="false"
              className="govuk-button"
              data-module="govuk-button"
              onClick={this.handleNextSectionClick}
            >
              Next
            </a>
          )}
        {this.form.parent == null &&
          this.form.currentSection &&
          this.form.visibleSections.length ===
            this.form.visibleSections.indexOf(this.form.currentSection) + 1 && (
            <a
              href="#"
              role="button"
              draggable="false"
              className="govuk-button"
              data-module="govuk-button"
              onClick={this.handleSubmitClick}
            >
              Submit
            </a>
          )}
      </>
    );
  }

  render(): React.ReactNode {
    if (this.form.parent) {
      return this.renderForm();
    }

    return <form noValidate>{this.renderForm()}</form>;
  }
}
