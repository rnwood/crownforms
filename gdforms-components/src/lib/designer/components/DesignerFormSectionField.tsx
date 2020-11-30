import { FieldModel, FormComponent, FormSectionField, IFieldModelOptions, IFormComponentOptions, IFormComponentState, IFormSectionFieldProps, TypedValue } from '../../renderer';
import React, { Component, SyntheticEvent } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Icon } from '@fluentui/react';
import { FormDesignerModel } from '../models';
import { observer } from 'mobx-react';

interface IProps extends IFormSectionFieldProps {
  designer: FormDesignerModel
}

@observer
export class DesignerFormSectionField extends Component<IProps> {

  private handleClick = (
    event: React.SyntheticEvent<HTMLDivElement, MouseEvent>,
    field: FormComponent<IFormComponentOptions, IFormComponentState>
  ): void => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    
      this.props.designer.selectedComponent = field;
  };

  private designerOverlayStyle : React.CSSProperties = {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    msTextOverflow: "ellipsis",
    overflow: "hidden",
    fontFamily: "monospace"
  }

  renderDesignerOverlay() {
    return (
      <div>
        <div style={{ float: "right", textAlign: "right" }}>
          <div style={this.designerOverlayStyle} title={String(this.props.field.value?.value)}>
              {"{"}
              {this.props.field.qualifiedName}
              {"}"}
          </div>
          {this.props.field.options.hide && <div style={this.designerOverlayStyle}>Hidden</div>}
          {this.props.field.options.displayCondition && <div style={this.designerOverlayStyle} title={this.props.field.options.displayCondition}><Icon  iconName="Visibility"/> {this.props.field.options.displayCondition}</div>}
        </div>
        <div style={{ clear: "both" }} />
      </div>
    );
  }

  onCaptureInput = (event: SyntheticEvent<HTMLDivElement, any>): void => {
      event.preventDefault();
  };

  handleFocus(
    e: React.FocusEvent<HTMLDivElement>,
    field: FieldModel<TypedValue, IFieldModelOptions>
  ): void {
      this.props.designer.selectedComponent = field;
  
  }

  render() {
    const isSelectedInDesignMode =
    this.props.designer.selectedComponent ===
    this.props.field;

  return (
    <div key={this.props.field.id}>
      <Draggable
        key={this.props.field.id}
        draggableId={`${this.props.field.id}`}
        index={this.props.index}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={provided.draggableProps.style}
          >
            <div
              style={{
                margin: "12px 0",
                minHeight: "2em",
                border: "1px solid lightblue",
                padding: "6px",
                background: isSelectedInDesignMode
                  ? "lightblue"
                  : "white",
              }}
              tabIndex={0}
              role="listitem"
              onKeyPressCapture={this.onCaptureInput}
              onKeyDownCapture={this.onCaptureInput}
              onKeyUpCapture={this.onCaptureInput}
              onClickCapture={this.onCaptureInput}
              onFocusCapture={this.onCaptureInput}
              onFocus={(e) => this.handleFocus(e, this.props.field)}
              onClick={(e) => this.handleClick(e, this.props.field)}
            >
              {this.renderDesignerOverlay()}
              <FormSectionField {...this.props} />
            </div>
          </div>
        )}
      </Draggable>
    </div>
  );
  }

}
