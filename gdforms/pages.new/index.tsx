import { Service } from "@prisma/client";
import { useStaticRendering } from "mobx-react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import React from "react";
import { ApiClient } from "../shared/ApiClient";
import { PublicPage } from "../shared/PublicPage";


interface IProps  {
  services: Service[];
}

export default class ServiceIndexPage extends PublicPage<IProps> {
  

  renderTitle() {
    return "Services";
  }

  renderBody() {
    return <div>
      <h1 className="govuk-heading-xl">Services</h1>

      <ul className="govuk-list">
      {this.props.services.map(s => 
        <li key={s.id} className="govuk-link"><a href={`/service/${s.url}`} >{s.name}</a> <a href={`/admin/service/${s.url}`}>[Design]</a></li>
      )}
      </ul>
    </div>
  }
}

  export async function getServerSideProps(context: GetServerSidePropsContext<{}>) :Promise<GetServerSidePropsResult<IProps>> {
  
    useStaticRendering(true);

    const services = await ApiClient.get<Service[]>("/api/service", context.req);
    return {props:{services}};
  
}