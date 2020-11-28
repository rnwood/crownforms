import React from "react";
import {observer, useStaticRendering} from "mobx-react"
import { AdminPage } from "../../../shared/AdminPage";
import { FormDesigner, IFormModelOptions, FormDesignerModel, IFormDesignerModelState } from "gdforms-components/dist/cjs/all";
import { FormRecord, ServiceRecord } from "../../../db";
import { IncomingMessage } from "http";
import { observable } from "mobx";
import { ApiClient } from "../../../shared/ApiClient";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

interface ISSRProps {
  type: "ssr";
  result: {
    type: "form",
    options: IFormModelOptions,
    state: IFormDesignerModelState
  } | { type: "error", message: string};
}

type IProps = ISSRProps;

@observer
export default class ServicePage extends AdminPage<IProps> {

  constructor(props: IProps) {
    super(props);

    if (props.result.type === "form"){
      this.designer = FormDesignerModel.continueFromState(props.result.options, props.result.state);
    }
  }
 
renderTitle() {
  return "Edit Service";
}

renderBody() {
    return this.designer ? <FormDesigner designer={this.designer} /> : <div>Loading...</div>;
                        
}

@observable designer: FormDesignerModel|undefined;
@observable error: string|undefined;
  
static async loadService(id: string, context: HTMLDocument|IncomingMessage) : Promise<ServiceRecord> {
    
  return await ApiClient.get<ServiceRecord>(`/api/service/${encodeURIComponent(id)}`, context);
}

}

export async function getServerSideProps(context: GetServerSidePropsContext<{id: string}>) :Promise<GetServerSidePropsResult<IProps>> {
  
  useStaticRendering(true);

  const service = await (await ServicePage.loadService(context.params!.id, context.req));

  if (!service || !service.form) {
    return {notFound: true};
  }

  const formDesigner = await FormDesignerModel.loadAsync(service.form.definition);
  const initialState = formDesigner.getState();

  debugger;
  return {props: {type: "ssr", result:{type: "form", options: service.form.definition, state: initialState}}}
}

