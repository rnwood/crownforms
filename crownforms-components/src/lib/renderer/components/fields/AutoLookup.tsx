import { AutoLookupModel, IFormComponentOptions, LookupButtonModel, VoidValue } from '../../models';
import React,  {Component, SyntheticEvent } from 'react';
import { FormField } from '.';

export class AutoLookup extends FormField<AutoLookupModel> {
  
  private divRef=React.createRef<HTMLDivElement>();
  
   focus(): void {
    this.divRef.current?.focus();
  }

  render() {
    return   <div ref={this.divRef}/>
  }
}
