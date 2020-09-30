import * as React from "react";
import { observer } from "mobx-react";
import { FormField } from ".";
import { Form } from "..";
import { SubFormFieldModel } from "../../models";

@observer
export class SubFormField extends FormField<SubFormFieldModel> {
  private divRef: React.RefObject<HTMLDivElement> = React.createRef();

  focus() {
    this.divRef.current?.scrollIntoView();
  }

  render() {
    return (
      <div ref={this.divRef}>
        <Form hooks={this.props.hooks}  hideTitle form={this.props.field.value.value!} />
      </div>
    );
  }
}
