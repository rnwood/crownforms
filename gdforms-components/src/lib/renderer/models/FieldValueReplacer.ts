import { StringValue, FormModel } from ".";
import { FFConditionParser } from "./conditions";

const EXPRESSIONREGEX = /\{\((.+?)\)\}/gi;
const REGEX = /\{([^}]+)\}/gi;

export class FieldValueReplacer {
  static replace(input: string, data: FormModel): string {
    return input
      ?.replaceAll(EXPRESSIONREGEX, (m: string, g1: string) => {
        return (
          FFConditionParser.parseStringExpression(g1)?.getResult(data).value ??
          ""
        );
      })
      ?.replaceAll(REGEX, (m: string, g1: string) => {
        return (
          StringValue.convertFrom(data.getFieldValue(g1)?.value).value ?? ""
        );
      });
  }
}
