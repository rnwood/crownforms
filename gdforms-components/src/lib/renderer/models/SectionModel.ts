import { computed, observable } from "mobx";
import {
  TwoChoiceFieldModel,
  ITwoChoiceFieldOptions,
  HtmlFieldModel,
  BooleanValue,
  FieldModel,
  FormComponent,
  FormComponentConstructor,
  FormModel,
  IFieldModelOptions,
  TypedValue,
  ValidationErrorModel,
  DateFieldModel,
  TextFieldModel,
  StringValue,
  SelectOneFieldModel,
  ISelectOneOptions,
  IHtmlFieldModelOptions,
  IDateFieldOptions,
  ITextFieldOptions,
  IRepeatableSubFormFieldOptions,
  RepeatableSubFormFieldModel,
  INumberFieldOptions,
  ISubFormFieldOptions,
  NumberFieldModel,
  SubFormFieldModel,
  SelectSeveralFieldModel,
  UnsupportedFieldModel,
  IUnsupportedFieldModelOptions,
  ISelectSeveralFieldModelOptions,
  SubFormValueArrayValue,
  SubFormValue,
  IRepeatableSubFormFieldState,
  ISubFormFieldState,
  IFormComponentOptions,
  IFormComponentState,
  IFieldModelState,
  LookupButtonModel,
  ILookupButtonOptions,
  AutoLookupModel,
  IAutoLookupOptions,
  IAutoLookupState,
  ISectionValidationRuleModelOptions,
  SectionValidationRuleModel,
} from ".";
import { Expression } from "./expressions";
import { FFConditionParser } from "./conditions";
import { ValidationErrorModelSeverity } from "./ValidationErrorModel";

export interface ISectionModelOptions extends IFormComponentOptions {
  type: "section";
  name: string;
  displayName: string;
  fields: IFieldModelOptions[];
  displayCondition?: string | null;
  hide?: boolean;
  validationRules?: ISectionValidationRuleModelOptions[];
}

export interface ISectionModelState extends IFormComponentState {
  fields: IFieldModelState[];
}

export class SectionModel extends FormComponent<
  ISectionModelOptions,
  ISectionModelState
> {

  @observable
  readonly fields : FieldModel[] = [];

  protected getChildContainers() {
    return [this.fields];
  }

  @computed
  get validationErrors(): ValidationErrorModel[] {
    let result = this.fields.flatMap((f) => f.validationErrors);
    if (result.length) {
      return result;
    }

    if (this.validationEnabled) {
      result = this.validationRules
        .map((v) => v.validate(this, this.parentForm!))
        .filter((r): r is string => !!r)
        .map(
          (r) =>
            new ValidationErrorModel(
              this,
              r,
              ValidationErrorModelSeverity.Correctable
            )
        );
    }

    return result;
  }

  @computed private get validationRules(): SectionValidationRuleModel<
    ISectionValidationRuleModelOptions
  >[] {
    return (this.options.validationRules ?? []).map((r) =>
      SectionValidationRuleModel.create(r)
    );
  }

  @computed get readOnly() : boolean {
    if (this.parentForm?.readOnly) {
      return true;
    }

    return false;
  }

  getState(): ISectionModelState {
    return {
      id: this.id,
      key: this.options.name,
      fields: this.fields.map((f) => f.getState()),
    };
  }

  protected getDesignerLabel(): string {
    return this.options.displayName;
  }

  protected async initComponentAsync(): Promise<void> {}

  canInsert(
    type: FormComponentConstructor<unknown, IFieldModelOptions>
  ): boolean {
    return type.prototype instanceof FieldModel;
  }

  async insertAsync<
    T extends FormComponent<IFormComponentOptions, IFormComponentState>
  >(
    Type: FormComponentConstructor<unknown, IFieldModelOptions>,
    index?: number,
    options?: IFieldModelOptions
  ): Promise<T> {
    if (Type.prototype instanceof FieldModel) {
      const newField = new Type(this, options) as FieldModel<
        TypedValue,
        IFieldModelOptions
      >;

      await FormComponent.initWithChildrenAsync(newField);

      if (index !== undefined) {
        this.fields.splice(index, 0, newField);
      } else {
        this.fields.push(newField);
      }

      return (newField as unknown) as T;
    }

    throw new Error("Cannot insert here");
  }

  constructor(
    parent: FormModel,
    options?: ISectionModelOptions,
    state?: ISectionModelState | undefined
  ) {
    super(
      parent,
      options ?? {
        fields: [],
        type: "section",
        displayName: "New section",
        name: "section",
      },
      state
    );

    if (options) {
      this.fields.push(
        ...options.fields.map((f) =>
          SectionModel.createFieldFromOptions(
            this,
            f,
            state?.fields.find((fs) => fs.key === f.name)
          )
        )
      );
    }
  }

  static createFieldFromOptions(
    parent: SectionModel,
    options: IFieldModelOptions,
    state: IFieldModelState | undefined
  ): FieldModel<TypedValue, IFieldModelOptions> {
    switch (options.type) {
      case "html":
        return new HtmlFieldModel(
          parent,
          options as IHtmlFieldModelOptions,
          state
        );

      case "selectone":
        return new SelectOneFieldModel(
          parent,
          options as ISelectOneOptions,
          state
        );
      case "date":
        return new DateFieldModel(parent, options as IDateFieldOptions, state);
      case "text":
        return new TextFieldModel(parent, options as ITextFieldOptions, state);
      case "twochoice":
        if (options.valueType === "string") {
          return new TwoChoiceFieldModel(
            StringValue,
            parent,
            new StringValue(""),
            options as ITwoChoiceFieldOptions,
            state
          );
        }
        break;
      case "selectseveral":
        return new SelectSeveralFieldModel(
          parent,
          options as ISelectSeveralFieldModelOptions,
          state
        );
      case "number":
        return new NumberFieldModel(
          parent,
          options as INumberFieldOptions,
          state
        );
      case "subform":
        return new SubFormFieldModel(
          parent,
          options as ISubFormFieldOptions,
          state as ISubFormFieldState
        );
      case "repeatablesubform":
        return new RepeatableSubFormFieldModel(
          parent,
          options as IRepeatableSubFormFieldOptions,
          state as IRepeatableSubFormFieldState
        );
      case "lookupButton":
        return new LookupButtonModel(
          parent,
          options as ILookupButtonOptions,
          state
        );
      case "autoLookup":
        return new AutoLookupModel(
          parent,
          options as IAutoLookupOptions,
          state as IAutoLookupState
        );
      case "unsupported":
      default:
        return new UnsupportedFieldModel(
          parent,
          options as IUnsupportedFieldModelOptions,
          state
        );
    }

    return new UnsupportedFieldModel(
      parent,
      {
        ...options,
        type: "unsupported",
        controlType: "unsupported",
        source: options,
        details: `Unsupported field type ${options.type}, value type ${options.valueType}`,
      },
      state
    );
  }

  focus(): void {
    this.parent?.focus();

    if (this.parentForm) {
      this.parentForm.currentSection = this;
    }
  }

  @observable
  private internalEnableValidation = false;

  @computed
  get validationEnabled(): boolean {
    return this.parentSection
      ? this.parentSection.validationEnabled
      : this.internalEnableValidation;
  }

  set validationEnabled(value: boolean) {
    this.internalEnableValidation = value;
  }

  @computed private get displayCondition() {
    return this.options.displayCondition
      ? FFConditionParser.parseBooleanExpression(this.options.displayCondition)
      : undefined;
  }

  @computed get visible(): boolean {
    if (this.options.hide) {
      return false;
    }

    if (this.options.displayCondition) {
      return (
        (this.parentForm
          ? this.displayCondition?.getResult(this.parentForm).value
          : false) === true
      );
    }

    return true;
  }
}
