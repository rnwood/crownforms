import React from "react";
import ReactDOM from "react-dom";
import { Form, FormModel, IFormModelOptions } from "./renderer";

class GdForms {
  async init(elementId: string, options: IFormModelOptions | string): Promise<FormModel> {
    let formOptions: IFormModelOptions;
    if (typeof options === "string") {
      formOptions = JSON.parse(options);
    } else {
      formOptions = options;
    }

    let formModel = await FormModel.loadAsync(formOptions, undefined, document.location.search);

    ReactDOM.render(
      <Form form={formModel} />,
      document.getElementById(elementId)
    );

    return formModel;
  }
}

let instance = new GdForms();

export default instance;
