import {FFConditionParser} from ".";
import { FormModel } from '..';
import { LogicalExpression } from '../expressions';

describe("FFConditionParser", () => {
  
  test("'string\\'LiteralWithEscapedQuotes'", () => {
    const literal = "string'LiteralWithEscapedQuotes";
    const expresssion = FFConditionParser.parseStringExpression(`'${literal.replaceAll("'", "\\'")}'`);
    const result = expresssion.getResult(undefined as unknown as FormModel);
    expect(result.value).toEqual(literal)
  });

  test("field = stringliteral", () => {
    FFConditionParser.parseBooleanExpression("{a} = '1'");
  });
  test("field = stringliteral<space>", () => {
    FFConditionParser.parseBooleanExpression("{a} = '1' ");
  });
  test("field=stringliteral", () => {
    FFConditionParser.parseBooleanExpression("{a}='1'");
  });
  test("field=field", () => {
    FFConditionParser.parseBooleanExpression("{a}={b}");
  });
  test("field<>field", () => {
    FFConditionParser.parseBooleanExpression("{a}<>{b}");
  });
  test("field!=field", () => {
    FFConditionParser.parseBooleanExpression("{a}!={b}");
  });
  test("a=stringliteral||b=stringliteral", () => {
    FFConditionParser.parseBooleanExpression("{a}='1'||{a}='2'");
  });

  test("a=stringliteral or b=stringliteral", () => {
    const result = FFConditionParser.parseBooleanExpression("{a}='1' or {a}='2'");
    console.log(JSON.stringify(result));
  });

  test("a=stringliteral && b=stringliteral", () => {
    FFConditionParser.parseBooleanExpression("{a}='1'&& {a}='2'");
  });
  test("c=stringliteral&&(a=stringliteral||b=stringliteral)", () => {
    FFConditionParser.parseBooleanExpression("{c}='3'&&({a}='1'||{a}='2')");
  });
  test("c = stringliteral && (a = stringliteral || b = stringliteral)", () => {
    FFConditionParser.parseBooleanExpression(
      "{c} = '3' && ({a} = '1' || {a} = '2')"
    );
  });

  test("({earnings1}='Earnings' && {yourPayslip}!='a') || {yourBS}!=''", () => {
    FFConditionParser.parseBooleanExpression(
      "({earnings1}='Earnings' && {yourPayslip}!='a') || {yourBS}!=''"
    );
  });

  test("{PortalUser_FirstName}", () => {
    FFConditionParser.parseBooleanExpression("{PortalUser_FirstName}");
  });

  test("if({PortalUser_FirstName}!='',{PortalUser_FirstName},{First_Name})", () => {
    FFConditionParser.parseBooleanExpression(
      "if({PortalUser_FirstName}!='',{PortalUser_FirstName},{First_Name})"
    );
  });

  test("('How much? £'+{amount}+'; Last time received on: '+{payment1}+'; Next payment: '+{payment2}) ", () => {
    FFConditionParser.parseBooleanExpression(
      "('How much? £'+{amount}+'; Last time received on: '+{payment1}+'; Next payment: '+{payment2}) "
    );
  });
});
