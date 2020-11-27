import {
  ExpressionFieldValidationRuleModel,
  FFConditionParser,
  FieldValidationRuleModel,
  IFieldModelOptions,
  IRepeatableSubFormFieldOptions,
  ISectionModelOptions,
  ITextFieldOptions,
  ITypedValueConverter,
  IUnsupportedFieldModelOptions,
  RegexFieldValidationRuleModel,
  StringValue,
  SubFormValue,
  SubFormValueArrayValue,
  TypedValue,
  VoidValue,
  DateValue,
  IDateFieldOptions,
  IFormModelOptions,
  IHtmlFieldModelOptions,
  INumberFieldOptions,
  ISelectOneOptions,
  NumberValue,
  StringArrayValue,
  ITwoChoiceFieldOptions,
  ILookupModelOptions,
  IFieldValidationRuleModelOptions,
  IRegexFieldValidationRuleModelOptions,
  IExpressionFieldValidationRuleModelOptions,
  ISectionValidationRuleModelOptions,
  IExpressionSectionValidationRuleModelOptions,
  ILookupButtonOptions,
  ISelectSeveralFieldModelOptions,
} from "../../../renderer";
import {
  IFFAutoLookupFieldModel,
  IFFDateFieldModel,
  IFFFieldModel,
  IFFFieldModelProps,
  IFFFormModel,
  IFFHtmlFieldModel,
  IFFNumberFieldModel,
  IFFSectionModel,
  IFFSelectFieldModel,
  IFFSubFormFieldModel,
  IFFTextAreaFieldModel,
  IFFTextFieldModel,
} from ".";
import {
  IFFLookupModel,
  IFFLookupModel_Output_template,
} from "./IFFLookupModel";
import sanitizeHtml from "sanitize-html";

const REGEX_SPLIT = /^\/(.*)\/([^/]*)$/;

export class FFFormConverter {
  static convertFormOptions(source: IFFFormModel): IFormModelOptions {
    return {
      type: "form",
      name: source.props.id,
      title: source.formName,
      sections: source.sections.map((s) => FFFormConverter.section(s, source)),
      lookups: source.props.integrationDefinition
        ? Object.values(source.props.integrationDefinition).map((id) =>
            FFFormConverter.lookup(id, source)
          )
        : [],
    };
  }
  static lookup(
    source: IFFLookupModel,
    sourceForm: IFFFormModel
  ): ILookupModelOptions {
    let sourceTemplate: IFFLookupModel_Output_template = JSON.parse(
      source.Output_template
    );

    if (sourceTemplate.method !== "GET" && sourceTemplate.method !== "POST") {
      throw new Error("Unsupported");
    }

    if (
      sourceTemplate.responseType !== "XML" &&
      sourceTemplate.responseType !== "JSON"
    ) {
      throw new Error("Unsupported");
    }

    let sourceTemplateFields = JSON.parse(sourceTemplate.fields);

    return {
      httpMethod: sourceTemplate.method,
      lookupType: "http",
      type: "lookup",
      name: source.ID,
      url: sourceTemplate.url,
      responseType: sourceTemplate.responseType,
      resultPath: sourceTemplate.path_to_values,
      resultFields: sourceTemplateFields,
    };
  }

  private static textField(source: IFFTextFieldModel): ITextFieldOptions {
    return {
      ...FFFormConverter.field("text", StringValue, "textfield", source),
      width: source.props.width,
    };
  }

  private static field<
    TField extends string,
    T extends TypedValue,
    TControl extends string
  >(
    type: TField,
    valueType: ITypedValueConverter<T>,
    controlType: TControl,
    source: IFFFieldModel
  ): IFieldModelOptions & { type: TField; controlType: TControl } {
    const validationRules: IFieldValidationRuleModelOptions[] = [];

    if (source.props.validationMask) {
      const regexAndFlags =
        source.props.validationMask === "_custom_regex_"
          ? source.props._custom_regex_
          : source.props.validationMask;
      const message =
        source.props.validationMaskMessage &&
        source.props.validationMaskMessageValue !== "Custom Regex"
          ? source.props.validationMaskMessage.replaceAll(
              "_validation_mask_",
              source.props.validationMaskMessageValue ??
                `${source.props.label ?? "The value"} is invalid`
            )
          : `${source.props.label ?? "The value"} is invalid`;

      if (regexAndFlags) {
        const regex = regexAndFlags.replace(REGEX_SPLIT, "$1");
        validationRules.push({
          type: "regex",
          errorMessage: message,
          regex: regex,
        } as IRegexFieldValidationRuleModelOptions);
      }
    }

    if (source.props.validationCondition) {
      validationRules.push({
        type: "expression",
        expression: source.props.validationCondition,
        errorMessage: source.props.validationConditionMessage,
      } as IExpressionFieldValidationRuleModelOptions);
    }

    return {
      type,
      controlType,
      valueType: valueType.key,
      name: source.props.dataName ?? "fieldnamemissing",
      displayName: source.props.label,
      hideLabel: source.props.labelPosition === "hideLabel",
      hide: source.props.hidden ?? false,
      alwaysRequired: !!source.props.mandatory,
      requiredErrorMessage:
        source.props.mandatoryMessage &&
        source.props.mandatoryMessage !== "This field is required"
          ? source.props.mandatoryMessage
          : null,
      defaultValueExpression:
        source.props.defaultValue &&
        (source.props.defaultType === "specific" ||
          !FFConditionParser.isValidStringExpression(source.props.defaultValue))
          ? FFConditionParser.getStringLiteral(source.props.defaultValue)
          : source.props.defaultValue ?? null,
      defaultValueFromTextExpression:
        source.props.defaultValueText &&
        (source.props.defaultType === "specific" ||
          !FFConditionParser.isValidStringExpression(
            source.props.defaultValueText
          ))
          ? FFConditionParser.getStringLiteral(source.props.defaultValueText)
          : source.props.defaultValueText ?? null,
      hintText: source.props.helpText ?? null,
      displayCondition: source.props.displayCondition ?? null,
      requiredCondition: source.props.mandatoryCondition || null,
      metadata: {
        firmstep: source,
      },
      validationRules
    };
  }

  private static unsupported(
    source: IFFFieldModel,
    details: string
  ): IUnsupportedFieldModelOptions {
    return {
      ...FFFormConverter.field("unsupported", VoidValue, "unsupported", source),
      source,
      details,
    };
  }

  static date(source: IFFDateFieldModel): IDateFieldOptions {
    return {
      ...FFFormConverter.field("date", DateValue, "datefield", source),
    };
  }

  private static section(
    source: IFFSectionModel,
    sourceForm: IFFFormModel
  ): ISectionModelOptions {

    let validationRules : ISectionValidationRuleModelOptions[] = [];

    if (source.props.validation) {
      validationRules.push({
        type: "expression",
        expression: source.props.validation,
        errorMessage: source.props.validationMessage
      } as IExpressionSectionValidationRuleModelOptions)
    }

    return {
      type: "section",
      name: source.id,
      displayName: source.name,
      hide: false,
      displayCondition: source.props.displayCondition ?? null,
      validationRules,
      fields: source.fields
        .map((field) => {
          if (field.type === "button") {
            return FFFormConverter.lookupButton(
              field as IFFFieldModel,
              sourceForm
            );
          }
          if (field.type === "autoLookup") {
            return FFFormConverter.autoLookup(
              field as IFFAutoLookupFieldModel,
              sourceForm
            );
          }
          if (field.type === "text") {
            return FFFormConverter.textField(field as IFFTextFieldModel);
          }
          if (field.type === "textarea") {
            return FFFormConverter.textArea(field as IFFTextAreaFieldModel);
          }
          if (field.type === "radio") {
            return FFFormConverter.selectone(
              field as IFFSelectFieldModel,
              "radiofield"
            );
          }
          if (field.type === "checkbox") {
            if ((<IFFSelectFieldModel>field).props.listOfValues?.length === 1) {
              return FFFormConverter.singleCheckbox(
                field as IFFSelectFieldModel
              );
            }

            return FFFormConverter.selectseveral(field as IFFSelectFieldModel);
          }
          if (field.type === "subform") {
            const subFormField = field as IFFSubFormFieldModel;

            if (subFormField.props.subformDefinition.sections.length !== 1) {
              return FFFormConverter.unsupported(
                field,
                "Unsupported subform field - does not contain exactly 1 section"
              );
            }
            if (subFormField.props.repeatable) {
              return FFFormConverter.repeatableSubform(
                field as IFFSubFormFieldModel
              );
            }

            return FFFormConverter.subform(field as IFFSubFormFieldModel);
          }
          if (field.type === "select") {
            return FFFormConverter.selectone(
              field as IFFSelectFieldModel,
              "selectfield"
            );
          }
          if (field.type === "date") {
            return FFFormConverter.date(field as IFFDateFieldModel);
          }
          if (field.type === "number") {
            return FFFormConverter.number(field as IFFNumberFieldModel);
          }

          if (field.type === "html" || field.type === "staticText") {
            return FFFormConverter.html(field as IFFHtmlFieldModel);
          }

          if (field.type === "line") {
            return undefined;
          }

          return FFFormConverter.unsupported(
            field,
            `Unsupported field type '${field.type}'`
          );
        })
        .filter((f) => f !== undefined) as IFieldModelOptions[],
    };
  }
  static lookupButton(
    source: IFFFieldModel,
    sourceForm: IFFFormModel
  ): ILookupButtonOptions {
    return {
      ...FFFormConverter.field(
        "lookupButton",
        VoidValue,
        "lookupButton",
        source
      ),
      lookup: sourceForm.sections
        .flatMap((s) =>
          s.fields.filter((f): f is IFFSelectFieldModel => f.type === "select")
        )
        .find((f) => f.props.lookupButton === source.props.dataName)?.props
        .lookup,
    };
  }

  static autoLookup(
    source: IFFAutoLookupFieldModel,
    sourceForm: IFFFormModel
  ): ILookupButtonOptions {
    return {
      ...FFFormConverter.field("autoLookup", VoidValue, "autoLookup", source),
      lookup: source.props.lookup,
    };
  }

  static html(source: IFFHtmlFieldModel): IHtmlFieldModelOptions {
    let content = sanitizeHtml(source.props.content);

    return {
      ...FFFormConverter.field("html", StringValue, "renderhtml", source),
      defaultValueExpression: FFConditionParser.getStringLiteral(content),
    };
  }

  static selectseveral(
    source: IFFSelectFieldModel
  ): ISelectSeveralFieldModelOptions {
    return {
      ...FFFormConverter.field(
        "selectseveral",
        StringArrayValue,
        "multicheckboxfield",
        source
      ),
      ...FFFormConverter.selectcommon(source, StringValue),
    };
  }

  private static selectcommon<
    TValue extends TypedValue,
    TChoices extends TypedValue
  >(source: IFFSelectFieldModel, choiceType: ITypedValueConverter<TChoices>) {
    if (source.props.lookup) {
      return {
        choices: { lookup: source.props.lookup },
      };
    }

    return {
      choices:
        source.props.listOfValues?.map((i) => {
          return {
            value: i.value,
            label: i.label,
          };
        }) ?? [],
    };
  }

  static selectone(
    source: IFFSelectFieldModel,
    controlType: "selectfield" | "radiofield"
  ): ISelectOneOptions {
    return {
      ...FFFormConverter.field("selectone", StringValue, controlType, source),
      nullText: source.props.selectLabel ?? null,
      ...FFFormConverter.selectcommon(source, StringValue),
    };
  }

  private static repeatableSubform(
    source: IFFSubFormFieldModel
  ): IRepeatableSubFormFieldOptions {
    return {
      ...FFFormConverter.field(
        "repeatablesubform",
        SubFormValueArrayValue,
        "inline",
        source
      ),
      form: FFFormConverter.convertFormOptions(source.props.subformDefinition),
    };
  }

  static number(source: IFFNumberFieldModel): INumberFieldOptions {
    return {
      ...FFFormConverter.field("number", NumberValue, "numberfield", source),
      prefix: source.props.prefix,
      suffix: source.props.suffix,
      decimalPlaces: source.props.decimalPlaces,
      width: source.props.width,
    };
  }

  private static subform(source: IFFSubFormFieldModel) {
    return {
      ...FFFormConverter.field("subform", SubFormValue, "inline", source),
      form: FFFormConverter.convertFormOptions(source.props.subformDefinition),
    };
  }

  private static textArea(source: IFFTextAreaFieldModel): ITextFieldOptions {
    return {
      ...FFFormConverter.field("text", StringValue, "textareafield", source),
    };
  }

  private static singleCheckbox(
    source: IFFSelectFieldModel
  ): ITwoChoiceFieldOptions {
    return {
      ...FFFormConverter.field(
        "twochoice",
        StringValue,
        "checkboxfield",
        source
      ),
      trueLabel: source.props.listOfValues?.[0].label ?? "",
      trueValue: source.props.listOfValues?.[0].value ?? "",
      falseValue: "",
      falseLabel: "",
    };
  }
}
