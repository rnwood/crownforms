import { observer } from "mobx-react";
import React, { ReactNode } from "react";
import { FormDesignerModel } from "../models";

@observer
export class ComponentProperties extends React.Component<{
  designer: FormDesignerModel;
}> {
  render(): ReactNode {
    return (
      <div>
        Selected
        {this.props.designer.selectedComponent?.designerLabel}
      </div>
    );
  }
}
