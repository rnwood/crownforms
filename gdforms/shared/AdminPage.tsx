import React, { Component, ReactNode } from "react";
import { Fabric, Stack} from '@fluentui/react'

export class NotFoundError extends Error {

}

export abstract class AdminPage<TProps> extends Component<TProps> {
  
  abstract renderTitle() : ReactNode;
  abstract renderBody() : ReactNode;

    render() {
      return <Fabric className="adminlayout" style={{height: "100vh"}}><Stack verticalFill>
      <Stack.Item styles={{ root: { padding: '6px', backgroundColor: "black", color: "white" } }}><img src="/logo.png" />
          {this.renderTitle()}
      </Stack.Item>
      <Stack.Item grow={1}>
      {this.renderBody()}
      </Stack.Item>
  </Stack></Fabric>
    }
    
  
}