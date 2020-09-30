import * as React from "react";
import { observable } from "mobx";
import { FieldModel, TypedValue, ValidationErrorModel, IFieldModelOptions } from "../../models";
import { IFormComponentProps } from '..';

export interface IFormFieldProps<
  TField extends FieldModel<TypedValue, IFieldModelOptions>
> extends IFormComponentProps {
  field: TField;
}

export abstract class FormField<
  TField extends FieldModel<TypedValue, IFieldModelOptions>
> extends React.Component<IFormFieldProps<TField>, unknown, unknown> {
  @observable
  controlValueError: ValidationErrorModel | null = null;

  @observable
  field: TField;

  constructor(props: IFormFieldProps<TField>) {
    super(props);
    this.field = props.field;
    this.field.controls.push(this);
  }

  componentWillUnmount(): void {
    this.props.field.controls.splice(
      this.props.field.controls.indexOf(this),
      1
    );
  }

  abstract focus(): void;
}
