import { computed, observable } from "mobx";
import { FormDesignerModel } from "../../designer";
import {
  FieldModel,
  FormComponent,
  FormComponentConstructor,
  IFieldModelOptions,
  ISectionModelOptions,
  RepeatableSubFormFieldModel,
  SectionModel,
  SubFormFieldModel,
  TypedValue,
  ValidationErrorModel,
  ILookupModelOptions,
  ILookupModelState,
  LookupModel,
  IFormComponentOptions,
  IFormComponentState,
  ITaskModel,
  StringValue,
  ISectionModelState,
} from ".";

export interface IFormModelOptions extends IFormComponentOptions {
  type: "form";
  name: string;
  title: string;
  sections: ISectionModelOptions[];
  lookups?: ILookupModelOptions[];
}

export interface IFormModelState extends IFormComponentState {
  lookups: ILookupModelState[];
  sections: ISectionModelState[];
  queryString: string|null;
}

export class FormModel extends FormComponent<
  IFormModelOptions,
  IFormModelState
> {
  @observable
  currentSection: SectionModel | undefined;

  private queryString: string|undefined;

  private constructor(
    options: IFormModelOptions,
    parent:
      | SubFormFieldModel
      | RepeatableSubFormFieldModel
      | undefined = undefined,
    queryString: string|undefined,
    state?: IFormModelState | undefined
  ) {
    super(parent, options, state);

    this.queryString = state?.queryString ?? queryString;

    this.appendChildren(
      ...this.options.sections.map(
        (s) =>
          new SectionModel(
            this,
            s,
            state?.sections.find((ss) => ss.key === s.name)
          )
      )
    );
    [this.currentSection] = this.sections;

    if (this.options.lookups) {
      this.appendChildren(
        ...this.options.lookups.map(
          (l) =>
            new LookupModel(
              this,
              l,
              state?.lookups.find((ls) => ls.key === l.name)
            )
        )
      );
    }
  }

  getState(): IFormModelState {
    return {
      id: this.id,
      key: this.id,
      lookups: this.lookups.map((l) => l.getState()),
      sections: this.sections.map((s) => s.getState()),
      queryString: this.queryString ?? null
    };
  }

  static continueFromState(
    options: IFormModelOptions,
    parent: SubFormFieldModel | RepeatableSubFormFieldModel | undefined,
    state: IFormModelState
  ) {
    return new FormModel(options, parent, undefined, state);
  }

  static async loadAsync(
    options: IFormModelOptions,
    parent:
      | SubFormFieldModel
      | RepeatableSubFormFieldModel
      | undefined = undefined,
    queryString: string|undefined
  ): Promise<FormModel> {
    let form = new FormModel(options, parent, queryString);
    await form.initAsync();
    return form;
  }

  async initAsync(): Promise<void> {
    await FormComponent.initWithChildrenAsync(this);
  }

  focus(): void {
    this.parent?.focus();
  }

  protected getDesignerLabel(): string {
    return this.options.title;
  }

  canInsert<
    T extends FormComponent<IFormComponentOptions, IFormComponentState>
  >(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type: FormComponentConstructor<T, IFieldModelOptions>
  ): boolean {
    return false;
  }

  async insertAsync<
    T extends FormComponent<IFormComponentOptions, IFormComponentState>
  >(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type: FormComponentConstructor<T, IFieldModelOptions>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    index?: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ...params: unknown[]
  ): Promise<T> {
    throw new Error("Cannot insert here");
  }

  @computed
  get parentFieldNamePrefix(): string {
    if (this.parent && this.parent instanceof RepeatableSubFormFieldModel) {
      return `${this.parent.qualifiedName}[${this.parent.value.value.findIndex(
        (i) => i.value === this
      )}]/`;
    }

    if (this.parent && this.parent instanceof SubFormFieldModel) {
      return `${this.parent.qualifiedName}/`;
    }

    return this.getDefaultParentFieldNamePrefix();
  }

  @computed
  get validationErrors(): ValidationErrorModel[] {
    return this.sections.flatMap((s) => s.validationErrors);
  }

  getSection(sectionName: string): SectionModel | undefined {
    return this.sections.find(
      (s) => s.options.name.toLowerCase() === sectionName.toLowerCase()
    );
  }

  getField(
    fieldName: string,
    useParentIfNotFound = true
  ):
    | FieldModel<TypedValue, IFieldModelOptions>
    | (FieldModel<TypedValue, IFieldModelOptions> | undefined)[]
    | undefined {
    if (fieldName.includes("/")) {
      const [subFormName, rest] = fieldName.split("/", 2);
      const subForm = this.getField(subFormName);

      if (subForm instanceof SubFormFieldModel) {
        return subForm.value.value?.getField(rest, false);
      }
      if (subForm instanceof RepeatableSubFormFieldModel) {
        return (
          subForm.value.value?.flatMap((s) => s.value?.getField(rest, false)) ??
          []
        );
      }

      return undefined;
    }
    const result =
      this.sections
        ?.flatMap((s) => s.fields)
        .find(
          (f) => f.options.name?.toLowerCase() === fieldName.toLowerCase()
        ) ?? undefined;
    if (!result && this.parentForm && useParentIfNotFound) {
      return this.parentForm.getField(fieldName);
    }

    return result;
  }

  getFieldValue(
    fieldNameWithPossibleFormatInfo: string
  ): TypedValue | undefined {
    if (fieldNameWithPossibleFormatInfo.startsWith("querystring:")) {
      return this.topLevelForm?.getQueryStringFieldValue(
        fieldNameWithPossibleFormatInfo
      );
    }

    const [fieldName, formatInfo] = fieldNameWithPossibleFormatInfo.split(
      ":",
      2
    );

    const fieldOrArrayOfFields = this.getField(fieldName);

    if (fieldOrArrayOfFields === undefined) {
      return undefined;
    }
    if (Array.isArray(fieldOrArrayOfFields)) {
      return undefined;
    }

    if (formatInfo) {
      return fieldOrArrayOfFields?.getFormattedValue(formatInfo);
    }

    return fieldOrArrayOfFields?.value;
  }

  private getQueryStringFieldValue(fieldName: string): StringValue {
    const qsKey = fieldName.substring("querystring:".length);
    const currentUrl = new URL("http://base.com/?" + this.queryString ?? "");
    const value = currentUrl.searchParams.get(qsKey);
    return new StringValue(value);
  }

  getFieldValueIncludingRepeatedSubForms(
    fieldName: string
  ): TypedValue | undefined | (TypedValue | undefined)[] {
    if (fieldName.startsWith("querystring:")) {
      return this.topLevelForm?.getQueryStringFieldValue(fieldName);
    }

    const fieldOrArrayOfFields = this.getField(fieldName);

    if (fieldOrArrayOfFields === undefined) {
      return undefined;
    }
    if (Array.isArray(fieldOrArrayOfFields)) {
      return fieldOrArrayOfFields.map((f) => f?.value);
    }

    return fieldOrArrayOfFields?.value;
  }


  @computed get visibleSections(): SectionModel[] {
    return this.sections.filter((f) => f.visible);
  }

  @computed get lookups(): LookupModel[] {
    return this.children.filter(
      (f): f is LookupModel => f instanceof LookupModel
    );
  }

  getLookup(name: string): LookupModel | undefined {
    return (
      this.lookups.find((l) => l.options.name === name) ??
      this.parentForm?.getLookup(name)
    );
  }
}
