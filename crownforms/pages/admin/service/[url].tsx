import React from "react";
import {observer, useStaticRendering} from "mobx-react"
import { AdminPage } from "../../../shared/AdminPage";
import { FormDesigner, IFormModelOptions, FormDesignerModel, IFormDesignerModelState } from "crownforms-components/dist/cjs/all";
import { IncomingMessage } from "http";
import { observable } from "mobx";
import { ApiClient } from "../../../shared/ApiClient";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { Service, Form } from '@prisma/client'

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
  
static async loadService(url: string, context: HTMLDocument|IncomingMessage) : Promise<Service & {form: Form}> {
    
  return await ApiClient.get<Service & {form: Form}>(`/api/service/${encodeURIComponent(url)}`, context);
}

}

export async function getServerSideProps(context: GetServerSidePropsContext<{url: string}>) :Promise<GetServerSidePropsResult<IProps>> {
  
  useStaticRendering(true);

  const service = await (await ServicePage.loadService(context.params!.url, context.req));

  if (!service || !service.form) {
    return {notFound: true};
  }

  const formDesigner = await FormDesignerModel.loadAsync(service.form.definition as IFormModelOptions);
  const initialState = formDesigner.getState();

  return {props: {type: "ssr", result:{type: "form", options: service.form.definition as IFormModelOptions, state: initialState}}}
}

