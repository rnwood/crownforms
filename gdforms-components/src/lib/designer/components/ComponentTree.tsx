import * as React from "react";

import { reaction, observable, action } from "mobx";
import { observer } from "mobx-react";
import { ReactNode, SyntheticEvent } from "react";
import { FormDesignerModel } from "../models";
import { FormComponent, NumberFieldModel, TextFieldModel, TwoChoiceFieldModel, DateFieldModel, SelectOneFieldModel, SelectSeveralFieldModel, HtmlFieldModel, RepeatableSubFormFieldModel, SubFormFieldModel, IFormComponentOptions, IFormComponentState } from "../../renderer";

interface IProps {
  designer: FormDesignerModel;
}

@observer
export class ComponentTree extends React.Component<IProps> {


  renderComponent(component: FormComponent) {
    return <>
      <li>
        <a href="" onClick={() => this.props.designer.selectedComponent = component}>{component.options.name}</a>
        <ul>
          {component.designerChildren.map(c => this.renderComponent(component))}
        </ul>
      </li>
    </>
  }

  render() {
    return <ul>
      {this.renderComponent(this.props.designer.form)}
    </ul>
  }
}
