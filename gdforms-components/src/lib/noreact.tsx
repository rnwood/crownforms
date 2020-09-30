import React from "react";
import ReactDOM from "react-dom";
import { Form, FormModel, IFormModelOptions } from "./renderer";

class EfForms {
  init(elementId: string, options: IFormModelOptions | string): FormModel {
    let formOptions: IFormModelOptions;
    if (typeof options === "string") {
      formOptions = JSON.parse(options);
    } else {
      formOptions = options;
    }

    let formModel = new FormModel(formOptions);

    ReactDOM.render(
      <Form form={formModel} />,
      document.getElementById(elementId)
    );

    return formModel;
  }
}

let instance = new EfForms();

export default instance;
