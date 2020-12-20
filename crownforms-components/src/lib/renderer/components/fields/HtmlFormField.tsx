import * as React from "react";

import { observer } from "mobx-react";
import { FormField } from ".";

import { HtmlFieldModel } from "../../models";

@observer
export class HtmlFormField extends FormField<HtmlFieldModel> {
  private divRef = React.createRef<HTMLDivElement>();

  focus(): void {
    this.divRef.current?.focus();
  }

  render(): React.ReactNode {
    if ((this.props.field.value.value?.indexOf("$") ?? -1) === -1) {
      return (
        <div className="govuk-body"
          ref={this.divRef}
          dangerouslySetInnerHTML={{
            __html: this.props.field.value?.value ?? "",
          }}
        />
      );
    }

    return "";
  }
}
