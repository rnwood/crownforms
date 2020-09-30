import {
  ASTKinds,
  booleanExpressionTail,
  expression,
  functionCall,
  Parser,
  term,
} from ".";

import { BooleanValue, StringValue } from "../..";
import {
  EqualsExpression,
  LogicalExpression,
  ContainsExpression,
  ComparisonExpressionType,
  ComparisonExpression,
  PlusExpression,
  IfExpression,
  CaseConversionExpression,
  CaseConversionType,
  SummariseExpression,
  SummaryType,
  FieldValueExpression,
  LiteralExpression,
  ArrayAccessExpression,
  ConvertToBooleanValueExpression,
  ConvertToStringValueExpression,
  Expression,
} from "../expressions";

export class FFConditionParser {
  
  static getStringLiteral(content: string): string | undefined {
    return `'${content.replaceAll("\\","\\\\").replaceAll("'", "\\'")}'`
  }

  static parseBooleanExpression(
    expression: string
  ): Expression<BooleanValue> {
    const result = this.parseExpression(expression);

    return new ConvertToBooleanValueExpression(result);
  }

  static parseStringExpression(
    expression: string
  ): Expression<StringValue> {
    const result = this.parseExpression(expression);

    return new ConvertToStringValueExpression(result) ;
  }

  static isValidStringExpression(expression: string) : boolean {
    try {
      FFConditionParser.parseStringExpression(expression);
      return true;
    } catch {
      return false;
    }
  }

  static parseExpression(expression: string): Expression<unknown> {

    try {
      
      var parseResult = new Parser(expression).parse();

      if (parseResult.err) {
        throw `Parse error ${parseResult.err.toString()}`;
      }
    } catch (e) {
      throw `Error parsing FF expression ${expression}\n${e}`;
    }

    return this.visitExpression(parseResult.ast!);
  }

  static visitExpression(e: expression): Expression<unknown> {
    switch (e.kind) {
      case ASTKinds.expression: {
        const left = FFConditionParser.visitTerm(e.head);

        return e.tail.reduce((p, c) => {
          return this.visitTail(p, c);
        }, left);
      }

      default:
        throw `Unhandled expression type: ${JSON.stringify(e)}`;
    }
  }

  static visitTail(left: Expression<unknown>, t: booleanExpressionTail): any {
    const c = t.tail;
    switch (c.kind) {
      case ASTKinds.isExpression:
      case ASTKinds.equalsExpression: {
        const right = FFConditionParser.visitTerm(c.right);

        return new EqualsExpression(left, false, right);
      }
      case ASTKinds.isntExpression:
      case ASTKinds.notEqualsExpression: {
        const right = FFConditionParser.visitTerm(c.right);

        return new EqualsExpression(left, true, right);
      }
      case ASTKinds.andExpression: {
        const right = FFConditionParser.visitExpression(c.right);

        return new LogicalExpression(left, true, right);
      }
      case ASTKinds.orExpression: {
        const right = FFConditionParser.visitExpression(c.right);

        return new LogicalExpression(left, false, right);
      }
      case ASTKinds.containsExpression: {
        const right = FFConditionParser.visitTerm(c.right);

        return new ContainsExpression(left, right, false);
      }
      case ASTKinds.icontainsExpression: {
        const right = FFConditionParser.visitTerm(c.right);

        return new ContainsExpression(left, right, true);
      }
      case ASTKinds.lessThanExpression: {
        const right = FFConditionParser.visitTerm(c.right);

        return new ComparisonExpression(
          left,
          ComparisonExpressionType.LessThan,
          right
        );
      }
      case ASTKinds.lessThanEqualExpression: {
        const right = FFConditionParser.visitTerm(c.right);

        return new ComparisonExpression(
          left,
          ComparisonExpressionType.LessThanEquals,
          right
        );
      }
      case ASTKinds.greaterThanExpression: {
        const right = FFConditionParser.visitTerm(c.right);

        return new ComparisonExpression(
          left,
          ComparisonExpressionType.GreaterThan,
          right
        );
      }
      case ASTKinds.greaterThanEqualExpression: {
        const right = FFConditionParser.visitTerm(c.right);

        return new ComparisonExpression(
          left,
          ComparisonExpressionType.GreaterThanEquals,
          right
        );
      }
      case ASTKinds.addExpression: {
        const right = FFConditionParser.visitTerm(c.right);

        return new PlusExpression(left, right);
      }

      default:
        throw `Unhandled tail type: ${JSON.stringify(c)}`;
    }
  }

  static visitFunctionCall(f: functionCall): Expression<unknown> {
    const args = f.args.tail.reduce(
      (p, c) => [...p, this.visitExpression(c.e)],
      [this.visitExpression(f.args.e)]
    );

    switch (f.name.toLowerCase()) {
      case "if": {
        if (args.length !== 2 && args.length !== 3) {
          throw `IF requires 2-3 arguments ${JSON.stringify(f)}`;
        }

        return new IfExpression(args[0], args[1], args[2] ?? null);
      }
      case "upperstr": {
        if (args.length !== 1) {
          throw `UPPERSTR requires 1 argument: ${JSON.stringify(f)}`;
        }

        return new CaseConversionExpression(args[0], CaseConversionType.Upper);
      }
      case "lowerstr": {
        if (args.length !== 1) {
          throw `UPPERSTR requires 1 argument: ${JSON.stringify(f)}`;
        }

        return new CaseConversionExpression(args[0], CaseConversionType.Lower);
      }
      case "ucfirst": {
        if (args.length !== 1) {
          throw `UCFIRST requires 1 argument: ${JSON.stringify(f)}`;
        }

        return new CaseConversionExpression(
          args[0],
          CaseConversionType.UpperFirst
        );
      }
      case "lcfirst": {
        if (args.length !== 1) {
          throw `LCFIRST requires 1 argument: ${JSON.stringify(f)}`;
        }

        return new CaseConversionExpression(
          args[0],
          CaseConversionType.LowerFirst
        );
      }
      case "max": {
        if (args.length !== 1) {
          throw `MAX requires 1 argument: ${JSON.stringify(f)}`;
        }

        return new SummariseExpression(args[0], SummaryType.Max);
      }
      case "min": {
        if (args.length !== 1) {
          throw `MIN requires 1 argument: ${JSON.stringify(f)}`;
        }

        return new SummariseExpression(args[0], SummaryType.Min);
      }
      case "sum": {
        if (args.length !== 1) {
          throw `SUM requires 1 argument: ${JSON.stringify(f)}`;
        }

        return new SummariseExpression(args[0], SummaryType.Sum);
      }
      case "count": {
        if (args.length !== 1) {
          throw `COUNT requires 1 argument: ${JSON.stringify(f)}`;
        }

        return new SummariseExpression(args[0], SummaryType.Count);
      }
      case "entry": {
        if (args.length !== 2) {
          throw `ENTRY requires 2 argument: ${JSON.stringify(f)}`;
        }

        return new ArrayAccessExpression(args[0], args[1]);
      }

      default:
        throw `Unhandled function: ${JSON.stringify(f)}`;
    }
  }

  static visitTerm(f: term): Expression<unknown> {
    switch (f.kind) {
      case ASTKinds.term_$0:
        return this.visitExpression(f.expression);
      case ASTKinds.fieldName:
        return new FieldValueExpression(f.fieldName);
      case ASTKinds.stringLiteral:
        return new LiteralExpression(f.value.replaceAll("\\'", "'").replaceAll("\\\\", "\\"));
      case ASTKinds.numberLiteral:
        return new LiteralExpression(parseFloat(f.value));
      case ASTKinds.functionCall:
        return this.visitFunctionCall(f);
      default:
        throw "Unhandled term type";
    }
  }
}
