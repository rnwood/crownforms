import { observer } from "mobx-react";

import React, { Component, ReactNode, SyntheticEvent } from "react";

import {
  TextFormField,
  NumberFormField,
  TextAreaFormField,
  RadioFormField,
  HtmlFormField,
  UnsupportedFormField,
  DateFormField,
  CheckboxFormField,
  SelectFormField,
  SubFormField,
  RepeatableSubFormField,
  MultiCheckboxFormField,
  LookupButton,
  AutoLookup,
} from "./fields";

import {
  TextFieldModel,
  SubFormFieldModel,
  TypedValue,
  UnsupportedFieldModel,
  DateFieldModel,
  FieldModel,
  IFieldModelOptions,
  HtmlFieldModel,
  FormComponent,
  SelectSeveralFieldModel,
  NumberFieldModel,
  SelectOneFieldModel,
  RepeatableSubFormFieldModel,
  TwoChoiceFieldModel,
  IFormComponentOptions,
  LookupButtonModel,
  IFormComponentState,
  AutoLookupModel,
} from "../models";
import { IFormComponentProps } from '.';

export interface IFormSectionFieldProps extends IFormComponentProps
{
  index: number;
  field: FieldModel<TypedValue, IFieldModelOptions>;
}

@observer
export class FormSectionField extends Component<IFormSectionFieldProps> {


  renderField(
    f: FieldModel<TypedValue, IFieldModelOptions>
  ): ReactNode {

    if (f instanceof TextFieldModel) {
      if (f.options.controlType === "textareafield") {
        return <TextAreaFormField hooks={this.props.hooks} field={f} />;
      }
      return <TextFormField hooks={this.props.hooks} field={f} />;
    }

    if (f instanceof SelectOneFieldModel) {
      if (f.options.controlType === "radiofield") {
        return <RadioFormField hooks={this.props.hooks} field={f} />;
      }
      return <SelectFormField hooks={this.props.hooks} field={f} />;
    }
    if (f instanceof TwoChoiceFieldModel) {
      return <CheckboxFormField hooks={this.props.hooks} field={f} />;
    }
    if (f instanceof SelectSeveralFieldModel) {
      return <MultiCheckboxFormField hooks={this.props.hooks} field={f} />;
    }

    if (f instanceof SubFormFieldModel) {
      return <SubFormField hooks={this.props.hooks} field={f} />;
    }
    if (f instanceof RepeatableSubFormFieldModel) {
      return <RepeatableSubFormField hooks={this.props.hooks} field={f} />;
    }
    if (f instanceof HtmlFieldModel) {
      return <HtmlFormField hooks={this.props.hooks} field={f} />;
    }
    if (f instanceof UnsupportedFieldModel) {
      return <UnsupportedFormField hooks={this.props.hooks} field={f} />;
    }
    if (f instanceof DateFieldModel) {
      return <DateFormField hooks={this.props.hooks} field={f} />;
    }
    if (f instanceof NumberFieldModel) {
      return <NumberFormField hooks={this.props.hooks} field={f} />;
    }
    if (f instanceof LookupButtonModel) {
      return <LookupButton hooks={this.props.hooks} field={f} />
    }

    if (f instanceof AutoLookupModel) {
      return <AutoLookup hooks={this.props.hooks} field={f} />
    }

    throw `No field UI for field model ${JSON.stringify(f)}`;
  }


  render() {
    
    return (
      <div key={this.props.field.id}>
        {(this.props.field.parentForm?.getFieldValue("querystring:_showallfields")?.value || this.props.field.visible) && this.renderField(this.props.field)}
      </div>
    );
  }
}
