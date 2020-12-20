import { observer } from "mobx-react";
import * as React from "react";
import { TypedValue, FieldModel, IFieldModelOptions } from "../../models";

@observer
export class FieldValidationErrors extends React.Component<{
  field: FieldModel<TypedValue, IFieldModelOptions>;
}> {
  render() {
    return (
      <React.Fragment>
        {this.props.field.validationErrors.length > 0 && (
          <span
            id={this.props.field.id + "-error"}
            className="govuk-error-message"
          >
            <span className="govuk-visually-hidden">Error:</span>{" "}
            {this.props.field.validationErrors.map((e) => e.message).join("\n")}
          </span>
        )}
      </React.Fragment>
    );
  }
}
