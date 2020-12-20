import React from "react";
import ReactDOM from "react-dom";
import { FormDesigner } from "./designer";
import { FormModel, IFormModelOptions } from "./renderer";

class GdFormsDesigner {
  async init(elementId: string, options: IFormModelOptions | string): Promise<FormModel> {
    let formOptions: IFormModelOptions;
    if (typeof options === "string") {
      formOptions = JSON.parse(options) as IFormModelOptions;
    } else {
      formOptions = options;
    }

    const formModel = await FormModel.loadAsync(formOptions, undefined, document.location.search);

    ReactDOM.render(
      <FormDesigner form={formModel} />,
      document.getElementById(elementId)
    );

    return formModel;
  }
}

const instance = new GdFormsDesigner();

export default instance;
