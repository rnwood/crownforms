import React from "react";
import {
  FormModel,
  Form,
  IFormModelOptions,
  IFormModelState
} from "gdforms-components";
import {observer, useStaticRendering} from "mobx-react"
import {observable} from "mobx"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { IncomingMessage } from "http";
import { PublicPage } from "../../shared/PublicPage";
import { ApiClient, NotFoundError } from "../../shared/ApiClient";
import { Service, Form as FormRecord } from "@prisma/client";

interface ISSRProps {
  type: "ssr";
  result: {
    type: "form",
    options: IFormModelOptions,
    state: IFormModelState
  } | { type: "error", message: string};
}

interface ICSRProps {
  type: "csr";
  url: string;
}
type IProps = ISSRProps|ICSRProps;

@observer
export default class ServicePage extends PublicPage<IProps> {

  constructor(props: IProps) {
    super(props);

    if (props.type === "ssr") {
            
      if (props.result.type === "error") {
        this.error = props.result.message;
    } else {
        this.form = FormModel.continueFromState(props.result.options, undefined, props.result.state);
      }
    }
    
  }

  async componentDidMount() {
    if (this.props.type === "csr") {
      try {
      const options = await (await ServicePage.loadService(this.props.url, document)).form!.definition as IFormModelOptions;
      this.form = await FormModel.loadAsync({options, queryString: document.location.search})
      } catch (e) {
        if (e instanceof Error) {
          this.error = e.message;
        } else {
          this.error = String(e)
        }
      }
    }
  }

  @observable
  private form: FormModel|undefined;

  @observable
  private error: string|undefined;

renderTitle() {
  return this.form?.options.title;
}

renderBody() {
                    return <div className="govuk-grid-row">
                        <div className="govuk-grid-column-full">
                            { this.error ? 
                              this.error
                              : this.form ?
                              this.renderForm() 
                              : "Loading..."
                            }
                        </div>
                    </div>
               
}

  renderForm() {

      return <Form hooks={{}} form={this.form!} hideTitle />;
 }

  
  static async loadService(url: string, context: HTMLDocument|IncomingMessage) : Promise<Service & {form: FormRecord}> {
    
    return await ApiClient.get<Service & {form: FormRecord}>(`/api/service/${encodeURIComponent(url)}`, context);
  }
}

export async function getServerSideProps(context: GetServerSidePropsContext<{url: string}>) :Promise<GetServerSidePropsResult<IProps>> {
  
  useStaticRendering(true);

  const url = context?.params?.url;

  if (!url) {
    context.res.statusCode = 404
    return {props: { type:"ssr", result: {type: "error", message:"Bad request - missing id" }}};
  }

  let requestUrl = new URL(context.req.url!, "http://base.com");

  if (!requestUrl.searchParams.get("nossr")) {
    try {
    const service  = await ServicePage.loadService(url, context.req);
    const options = service.form.definition as IFormModelOptions;

    const queryString = requestUrl.search;
    const form = await FormModel.loadAsync({options: options, queryString: queryString});
    const state = form.getState();

    return {props: { type:"ssr", result: {type:"form", options: options, state:state}}}
    } catch (e) {
      if (e instanceof NotFoundError) {
        return {notFound: true};
      } else {
        throw e;
      }
    }
  } else {
    return {props: { type:"csr", url: url }}
  }
}


