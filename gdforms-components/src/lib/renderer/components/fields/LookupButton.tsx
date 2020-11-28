import { IFormComponentOptions, LookupButtonModel, VoidValue } from '../../models';
import React,  {Component, SyntheticEvent } from 'react';
import { FormField } from '.';

export class LookupButton extends FormField<LookupButtonModel> {
  
  private buttonRef=React.createRef<HTMLButtonElement>();
  
  handleClick = (event: SyntheticEvent<HTMLButtonElement, MouseEvent>) => {
    this.field.runLookupAsync();
  }

  focus(): void {
    this.buttonRef.current?.focus();
  }

  render() {
    return           <button 
    disabled={this.props.field.readOnly}
    type="button"
    className="govuk-button govuk-button--secondary"
    data-module="govuk-button"
    ref={this.buttonRef}
    onClick={this.handleClick}
  >
    Lookup!
  </button>
  }
}
