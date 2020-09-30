import React from "react";
import ReactDOM from "react-dom";
import { FormDesigner } from "./designer";
import { FormModel, IFormModelOptions } from "./renderer";

class EfFormsDesigner {
  init(elementId: string, options: IFormModelOptions | string): FormModel {
    let formOptions: IFormModelOptions;
    if (typeof options === "string") {
      formOptions = JSON.parse(options) as IFormModelOptions;
    } else {
      formOptions = options;
    }

    const formModel = new FormModel(formOptions);

    ReactDOM.render(
      <FormDesigner form={formModel} />,
      document.getElementById(elementId)
    );

    return formModel;
  }
}

const instance = new EfFormsDesigner();

export default instance;
