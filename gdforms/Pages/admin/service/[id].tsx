import React from "react";
import {observer, useStaticRendering} from "mobx-react"
import { AdminPage } from "../../../shared/AdminPage";
import { FormDesigner, FormModel } from "gdforms-components/dist/cjs/all";
import { FormRecord, ServiceRecord } from "../../../db";
import { IncomingMessage } from "http";
import { observable } from "mobx";
import { ApiClient } from "../../../shared/ApiClient";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";


interface IProps {
  form: FormRecord
}

@observer
export default class ServicePage extends AdminPage<IProps> {

 
renderTitle() {
  return "Edit Service";
}

renderBody() {
    return this.form ? <FormDesigner form={this.form} /> : <div>Loading...</div>;
                        
}

@observable form: FormModel|undefined;
@observable error: string|undefined;
  
static async loadService(id: string, context: HTMLDocument|IncomingMessage) : Promise<ServiceRecord> {
    
  return await ApiClient.get<ServiceRecord>(`/api/service/${encodeURIComponent(id)}`, context);
}

async componentDidMount() {
  
    try {
    const options =this.props.form.definition;
    this.form = await FormModel.loadAsync(options, undefined, "")
    } catch (e) {
      if (e instanceof Error) {
        this.error = e.message;
      } else {
        this.error = String(e)
      }
    }
  }
}


export async function getServerSideProps(context: GetServerSidePropsContext<{id: string}>) :Promise<GetServerSidePropsResult<IProps>> {
  
  useStaticRendering(true);

  const service = await (await ServicePage.loadService(context.params!.id, context.req));

  if (!service || !service.form) {
    return {notFound: true};
  }

  return {props: {form: service.form}}
}

