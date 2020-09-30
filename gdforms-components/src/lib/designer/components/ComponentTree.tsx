import * as React from "react";

import { reaction, observable, action } from "mobx";
import { observer } from "mobx-react";
import { INavLink, Nav } from "@fluentui/react";
import { ReactNode, SyntheticEvent } from "react";
import { FormDesignerModel } from "../models";
import { FormComponent, NumberFieldModel, TextFieldModel, TwoChoiceFieldModel, DateFieldModel, SelectOneFieldModel, SelectSeveralFieldModel, HtmlFieldModel, RepeatableSubFormFieldModel, SubFormFieldModel, IFormComponentOptions, IFormComponentState } from "../../renderer";

interface IProps {
  designer: FormDesignerModel;
}

@observer
export class ComponentTree extends React.Component<IProps> {
  updateSelectedKey = (): void => {
    this.selectedKey = this.componentToItem.find(
      (i) => i.component === this.props.designer.selectedComponent
    )?.item.key;
  };

  @action
  private handleLinkClick = (
    ev?: SyntheticEvent<HTMLElement, MouseEvent> | undefined,
    item?: INavLink | undefined
  ): void => {
    if (item) {
      const newSelection = this.componentToItem.find(
        (i) => i.item.key === item.key
      )?.component;
      this.props.designer.selectedComponent = newSelection;

      if (this.props.designer) {
        newSelection?.focus();
      }
    }
  };

  renderGroupHeader = (): JSX.Element => <></>;

  constructor(props: IProps) {
    super(props);
    reaction(() => this.props.designer.form.designerChildren, this.updateItems);
    reaction(
      () => this.props.designer.selectedComponent,
      this.updateSelectedKey
    );
    this.updateItems();
  }

  @observable
  private items: INavLink[] = [];

  @observable
  private componentToItem: {
    item: INavLink;
    component: FormComponent<IFormComponentOptions, IFormComponentState>;
  }[] = [];

  updateItems = (): void => {
    this.componentToItem = [];
    this.items = this.props.designer.form.designerChildren.map((c) => this.getItem(c));
    this.updateSelectedKey();
  };

  getItem(component: FormComponent<IFormComponentOptions, IFormComponentState>): INavLink {
    let icon: string | undefined;
    if (component instanceof TextFieldModel) {
      icon = "TextField";
    } else if (component instanceof NumberFieldModel)
    {
      icon = "NumberField";
    } else if (component instanceof TwoChoiceFieldModel) {
      icon = "CheckboxField";
    } else if (component instanceof DateFieldModel) {
      icon = "DateField"
    } else if (component instanceof SelectOneFieldModel) {
      icon = "RadioField"
    } else if (component instanceof SelectSeveralFieldModel) {
      icon = "selectseveralField";
    } else if (component instanceof HtmlFieldModel) {
      icon = "HtmlField"
    } else if (component instanceof RepeatableSubFormFieldModel) {
      icon = "RepeatableSubFormField"
    } else if (component instanceof SubFormFieldModel) {
      icon = "SubFormField"
    }

    const key = component.id;

    const item: INavLink = {
      name: component.designerLabel,
      links: component.designerChildren.map((c) => this.getItem(c)),
      icon,
      url: "",
      key,
      isExpanded: true,
    };
    this.componentToItem.push({
      item,
      component,
    });

    return item;
  }

  @observable
  private selectedKey: string | undefined;

  render(): ReactNode {
    return (
      <Nav
        onLinkClick={this.handleLinkClick}
        selectedKey={this.selectedKey}
        initialSelectedKey={this.selectedKey}
        onRenderGroupHeader={this.renderGroupHeader}
        groups={[{ name: "Components", links: this.items }]}
      />
    );
  }
}
