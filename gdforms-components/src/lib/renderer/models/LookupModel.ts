import {
  FieldModel,
  IFieldModelOptions,
  FieldValueReplacer,
  FormComponent,
  IFormComponentOptions,
  FormModel,
  FormComponentConstructor,
  StringValue,
  TypedValue,
  IOptions,
} from ".";

import { DOMParser } from "xmldom";
import xpath from "xpath";
import { observable } from "mobx";
import { IFormModelState } from "./FormModel";
import { IFormComponentState } from "./FormComponent";

export interface ILookupModelOptions extends IFormComponentOptions {
  type: "lookup";
  lookupType: "http";
  httpMethod: "GET" | "POST";
  responseType: "XML" | "JSON";
  url: string;
  resultPath: string;
  resultFields: Record<string, string>;
}

export interface ILookupModelState extends IFormComponentState {
  results: Record<string, string | null>[] | null;
}

export class LookupResult {
  constructor(values: Record<string, string | null>) {
    this.values = values;
  }

  readonly values: Record<string, string | null>;

  populate(form: FormModel) {
    for (const [fieldName, value] of Object.entries(this.values)) {
      const field = form.getField(fieldName);
      if (field && !Array.isArray(field)) {
        field.value = field.valueType.convertFrom(value);
      }
    }
  }
}

export class LookupModel extends FormComponent<
  ILookupModelOptions,
  ILookupModelState
> {

  constructor(parent: FormComponent<IFormComponentOptions, IFormComponentState> | undefined, options: ILookupModelOptions, state: ILookupModelState | undefined) {
    super(parent, options, state);

    this.results = state?.results?.map(r => new LookupResult(r))
    }

  getState(): ILookupModelState {
    return {
      id: this.id,
      key: this.options.name,
      results: this.results?.map((r) => r.values) ?? null,
    };
  }

  async insertAsync<
    T extends FormComponent<IFormComponentOptions, IFormComponentState>
  >(
    type: FormComponentConstructor<T, IFieldModelOptions>,
    index?: number,
    ...params: unknown[]
  ): Promise<T> {
    throw new Error("Method not implemented.");
  }
  protected getDesignerLabel(): string {
    return `Lookup: ${this.options.name}`;
  }
  focus(): void {}
  canInsert<
    T extends FormComponent<IFormComponentOptions, IFormComponentState>
  >(type: FormComponentConstructor<T, IFormComponentOptions>): boolean {
    return false;
  }

  @observable results: readonly LookupResult[] | undefined;

  getResultsAsync = async (
    form: FormModel
  ): Promise<readonly LookupResult[]> => {
    this.results = await this.getResultsAsyncInternal(form);
    return this.results;
  };

  private getResultsAsyncInternal = async (
    form: FormModel
  ): Promise<readonly LookupResult[]> => {
    switch (this.options.httpMethod) {
      case "GET":
        const url = FieldValueReplacer.replace(this.options.url, form);
        const response = await fetch(url);

        if (this.options.responseType === "JSON") {
          return await this.extractJsonResultsAsync(response);
        } else if (this.options.responseType === "XML") {
          return await this.extractXmlResultsAsync(response);
        }
        throw new Error(
          `Response type ${this.options.resultPath} not implemented`
        );

      default:
        throw new Error(
          `HTTP method ${this.options.httpMethod} not implemented`
        );
    }
  };

  private async extractJsonResultsAsync(response: Response) {
    const responseBody = await response.json();

    const newResult: Record<string, string | null> = {};

    for (let [resultProp, fieldName] of Object.entries(
      this.options.resultFields
    )) {
      let value: string | null = null;

      if (resultProp in responseBody) {
      }

      newResult[fieldName] = value;
    }

    return [new LookupResult(newResult)];
  }

  private async extractXmlResultsAsync(
    response: Response
  ): Promise<readonly LookupResult[]> {
    const responseBody = await response.text();
    const xmlDoc = new DOMParser().parseFromString(responseBody);
    const lookupResults = xpath.select(this.options.resultPath, xmlDoc);

    const results = [];

    for (let lookupResult of lookupResults) {
      const newResult = {} as Record<string, string | null>;
      results.push(newResult);
      if (
        typeof lookupResult === "object" &&
        lookupResult.nodeType === Node.ELEMENT_NODE
      ) {
        const resultElement = lookupResult as Element;

        for (const [resultProp, fieldName] of Object.entries(
          this.options.resultFields
        )) {
          const lookupResultFieldElement = xpath.select(
            resultProp,
            resultElement
          )[0];
          let value: string | null = null;
          if (typeof lookupResultFieldElement === "string") {
            value = lookupResultFieldElement;
          } else if (
            typeof lookupResultFieldElement === "object" &&
            lookupResultFieldElement.nodeType === Node.ELEMENT_NODE
          ) {
            value = lookupResultFieldElement.textContent;
          }

          newResult[fieldName] = value;
        }
      }
    }

    return results.map((r) => new LookupResult(r));
  }
}
