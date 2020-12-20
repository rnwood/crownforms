import * as React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import {
  FormComponentConstructor,
  FormModel,
  Form,
  FormComponent,
  IFieldModelOptions,
  TypedValue,
  IFormComponentOptions,
  IFormComponentState,
  IFormSectionFieldProps,
  IFormSectionProps,
  FieldModel,
  IFormModelOptions,
  SectionModel,
} from "../../renderer";
import {
  ComponentTree,
  ComponentProperties,
  ComponentInsert,
  DesignerFormSectionField,
  DesignerFormSection,
} from ".";
import { FormDesignerModel } from "../models";

interface IProps {
  designer: FormDesignerModel;
}

@observer
export class FormDesigner extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.designer = this.props.designer;
  }

  @observable
  readonly designer: FormDesignerModel;

  private onDragEndAsync = async (result: DropResult): Promise<void> => {
    if (
      result.source.droppableId === "toolbox:" &&
      result.destination &&
      result.destination.droppableId.startsWith("component:")
    ) {
      const targetComponentName = result.destination.droppableId.substring(
        result.destination.droppableId.lastIndexOf(":") + 1
      );
      const target = this.designer.form.getComponentById(targetComponentName);
      const newComponentType: FormComponentConstructor<
        FormComponent<IFormComponentOptions, IFormComponentState>,
        IFormComponentOptions
      > = this.designer.fieldTypes[result.source.index];
      if (target?.canInsert(newComponentType)) {
        this.designer.selectedComponent = await target.insertAsync(
          newComponentType,
          result.destination.index
        );
      }
    } else if (
      result.source.droppableId.startsWith("component:") &&
      result.destination &&
      (result.destination.droppableId.startsWith("component:") ||
        result.destination.droppableId.startsWith("component:"))
    ) {
      const sourceComponentId = result.source.droppableId.substring(
        result.source.droppableId.lastIndexOf(":") + 1
      );
      const source = this.designer.form.getComponentById(sourceComponentId);
      const targetComponentId = result.destination.droppableId.substring(
        result.destination.droppableId.lastIndexOf(":") + 1
      );
      const target = this.designer.form.getComponentById(targetComponentId);

      if (source && target) {
        const item = source.allChildren[result.source.index];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        const itemConstructor = (item as any)
          .constructor as FormComponentConstructor<
          FormComponent<IFormComponentOptions, IFormComponentState>,
          IFormComponentOptions
        >;

        if (item && target.canInsert(itemConstructor)) {
          //source.allChildren(item);
          this.designer.selectedComponent = await target.insertAsync(
            itemConstructor,
            result.destination.index,
            item.options
          );
        }
      }
    }
  };

  render(): React.ReactNode {
    const hooks = {
      onRenderField: (p: IFormSectionFieldProps) => (
        <DesignerFormSectionField designer={this.designer} {...p} />
      ),
      onRenderSection: (p: IFormSectionProps) => (
        <DesignerFormSection designer={this.designer} {...p} />
      ),
      onGetFieldVisibility: (f: FieldModel<TypedValue, IFieldModelOptions>) =>
        true,
      onGetSectionVisibilty: (s: SectionModel) => true
    };

    return (
      <div style={{ minHeight: "600px", height: "100%", width: "100%" }}>
        <DragDropContext onDragEnd={this.onDragEndAsync}>
          <div style={{ height: "100%", width: "100%" }}>
            <div
              style={{ borderBottom: "1px solid lightgray" } }
            >
            </div>
            <div>
              <div
                style={{ height: "100%" }}
              >
                <div
                  style={{ borderRight: "1px solid lightgray" } }
                >
                  <div
                    style={{ width: 300, height: "100%", position: "relative" }}
                  >
                      <div>

                            <ComponentTree designer={this.designer} />
                       
                            <ComponentInsert designer={this.designer} />
                         
                      </div>
                  </div>
                </div>
                <div>
                  <div style={{ height: "100%", position: "relative" }}>
  
                      <div style={{ padding: "12px" }}>
                        <div className="govuk-width-container">
                          <main className="govuk-main-wrapper">
                            <div className="govuk-grid-row">
                              <div className="govuk-grid-column-full">
                                <Form
                                  hideTitle
                                  form={this.props.designer.form}
                                  hooks={hooks}
                                />
                              </div>
                            </div>
                          </main>
                        </div>
                      </div>
                  </div>
                </div>
                <div
                  style={ { borderLeft: "1px solid lightgray" } }
                >
                  <div
                    style={{ width: 300, height: "100%", position: "relative" }}
                  >
                      <div style={{ padding: "12px" }}>
                        <ComponentProperties designer={this.designer} />
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DragDropContext>
      </div>
    );
  }
}
