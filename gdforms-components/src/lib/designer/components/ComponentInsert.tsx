import * as React from "react";

import {
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";

import { action } from "mobx";
import { observer } from "mobx-react";
import {
  FormComponent,
  FormComponentConstructor,
  IFormComponentOptions,
  IFormComponentState,
} from "../../renderer";
import { FormDesignerModel } from "../models";

@observer
export class ComponentInsert extends React.Component<{
  designer: FormDesignerModel;
}> {
  @action
  insertAsync = async (
    type: FormComponentConstructor<FormComponent<IFormComponentOptions, IFormComponentState>, any>
  ): Promise<void> => {
    let current = this.props.designer.selectedComponent;
    while (current && !current.canInsert(type)) {
      current = current.parent;
    }

    if (!current) {
      if (this.props.designer.form.canInsert(type)) {
        current = this.props.designer.form;
      } else if (this.props.designer.form.currentSection?.canInsert(type)) {
        current = this.props.designer.form.currentSection;
      }
    }

    if (current) {
      this.props.designer.selectedComponent = await current.insertAsync(type);
      this.props.designer.selectedComponent?.focus();
    }
  };

  render(): React.ReactNode {
    return (
      <Droppable droppableId="toolbox:">
        {(provided: DroppableProvided): JSX.Element => (
          // eslint-disable-next-line @typescript-eslint/unbound-method
          <div ref={provided.innerRef}>
            {this.props.designer.fieldTypes.map((t, i) => (
              <Draggable
                key={i.toString()}
                draggableId={i.toString()}
                index={i}
              >
                {(provided: DraggableProvided): JSX.Element => (
                  <div
                    // eslint-disable-next-line @typescript-eslint/unbound-method
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{ ...provided.draggableProps.style }}
                  >
                    <div
                      style={{ padding: "12px" }}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e): void => this.handleKeyPress(e, t)}
                      onClick={(): void => {
                        this.insertAsync(t);
                      }}
                    >
                      {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        t.designerToolboxLabel
                      }
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }

  private handleKeyPress(
    e: React.KeyboardEvent<HTMLDivElement>,
    t: FormComponentConstructor<FormComponent<IFormComponentOptions, IFormComponentState>, any>
  ): void {
    if (e.key === "Enter") {
      this.insertAsync(t);
    }
  }
}
