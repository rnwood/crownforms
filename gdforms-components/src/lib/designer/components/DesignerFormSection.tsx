import { FormSection, IFormSectionProps } from "../../renderer";
import React, { Component } from "react";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import { FormDesignerModel } from '../models';
import { observer } from 'mobx-react';

interface IProps extends IFormSectionProps {
  designer: FormDesignerModel
}

@observer
export class DesignerFormSection extends Component<IProps> {
  render(): React.ReactNode {
    return (
      <Droppable droppableId={`component:${this.props.data.id}`}>
        {(provided: DroppableProvided): JSX.Element => (
          // eslint-disable-next-line @typescript-eslint/unbound-method
          <div ref={provided.innerRef}>
            <FormSection {...this.props}/>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }
}
