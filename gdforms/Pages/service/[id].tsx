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
import { ServiceRecord } from "../../db";
import { ApiClient, NotFoundError } from "../../shared/ApiClient";

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
  id: string;
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
      const options = await (await ServicePage.loadService(this.props.id, document)).form!.definition;
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

  
  static async loadService(id: string, context: HTMLDocument|IncomingMessage) : Promise<ServiceRecord> {
    
    return await ApiClient.get<ServiceRecord>(`/api/service/${encodeURIComponent(id)}`, context);
  }
}

export async function getServerSideProps(context: GetServerSidePropsContext<{id: string}>) :Promise<GetServerSidePropsResult<IProps>> {
  
  useStaticRendering(true);

  const id = context?.params?.id;

  if (!id) {
    context.res.statusCode = 404
    return {props: { type:"ssr", result: {type: "error", message:"Bad request - missing id" }}};
  }

  let url = new URL(context.req.url!, "http://base.com");

  if (!url.searchParams.get("nossr")) {
    try {
    const options = await (await ServicePage.loadService(id, context.req)).form!.definition;

    const queryString = url.search;
    const form = await FormModel.loadAsync({options, queryString});
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
    return {props: { type:"csr", id }}
  }
}


