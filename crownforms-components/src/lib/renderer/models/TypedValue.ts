/* eslint-disable max-classes-per-file */
import { observable } from "mobx";
import { FormModel } from ".";

export interface ITypedValue {
  hasValue: boolean;
  kind: string;
}

function staticImplements<T>() {
  return <U extends T>(constructor: U) => {
    constructor;
  };
}

export interface ITypedArrayValue<T extends TypedValue> extends ITypedValue {
  value: { [index: number]: T };
}

@staticImplements<IJsonableValueConverter<BooleanValue>>()
export class BooleanValue implements ITypedValue {
  constructor(value: boolean | null) {
    this.value = value;
  }

  get hasValue(): boolean {
    return this.value === true;
  }

  readonly kind: "boolean" = "boolean";

  static get defaultValue() {
    return new BooleanValue(null);
  }

  static toJson(value: BooleanValue) {
    return value.value;
  }

  static key: "boolean" = "boolean";

  readonly value: boolean | null;

  static convertFrom(value: any): BooleanValue {
    if (
      value !== null &&
      value !== undefined &&
      typeof value === "object" &&
      "value" in value
    ) {
      value = value.value;
    }
    if (value === null || typeof value === "boolean") {
      return new BooleanValue(value);
    }

    return new BooleanValue(!!value);
  }
}

@staticImplements<ITypedValueConverter<VoidValue>>()
export class VoidValue implements ITypedValue {
  constructor(value: void) {}

  get hasValue(): boolean {
    return false;
  }

  readonly kind: "void" = "void";

  static get defaultValue() {
    return new VoidValue();
  }

  static key: "void" = "void";

  readonly value: void;

  static convertFrom(value: any): VoidValue {
    return new VoidValue();
  }
}

@staticImplements<IJsonableValueConverter<NumberValue>>()
export class NumberValue implements ITypedValue {
  constructor(value: number | null) {
    this.value = value;
  }

  get hasValue(): boolean {
    return this.value !== null && !isNaN(this.value);
  }

  readonly kind: "number" = "number";

  static get defaultValue() {
    return new NumberValue(null);
  }

  static toJson(value: NumberValue) {
    return value.value;
  }

  static key: "number" = "number";

  readonly value: number | null;

  static convertFrom(value: any): NumberValue {
    if (
      value !== null &&
      value !== undefined &&
      typeof value === "object" &&
      "value" in value
    ) {
      value = value.value;
    }

    if (value === null || typeof value === "number") {
      return new NumberValue(value);
    }

    return new NumberValue(Number(value));
  }
}

@staticImplements<IJsonableValueConverter<StringValue>>()
export class StringValue implements ITypedValue {
  constructor(value: string | null) {
    this.value = value;
  }

  get hasValue(): boolean {
    return this.value !== null && this.value !== "";
  }

  readonly kind: "string" = "string";

  static key: "string" = "string";

  static get defaultValue() {
    return new StringValue(null);
  }

  readonly value: string | null;

  static toJson(value: StringValue) {
    return value.value;
  }

  static convertFrom(value: any): StringValue {
    if (
      value !== null &&
      value !== undefined &&
      typeof value === "object" &&
      "value" in value
    ) {
      value = value.value;
    }

    if (value === null || typeof value === "string") {
      return new StringValue(value);
    }

    return new StringValue(value !== undefined ? String(value) : null);
  }
}

@staticImplements<ITypedValueConverter<SubFormValue>>()
export class SubFormValue implements ITypedValue {
  constructor(value: FormModel | null) {
    this.value = value;
  }

  get hasValue(): boolean {
    return this.value !== null;
  }

  readonly kind: "subform" = "subform";

  static key: "subform" = "subform";

  static get defaultValue() {
    return new SubFormValue(null);
  }

  readonly value: FormModel | null;

  static convertFrom(value: any): SubFormValue {
    if (
      value !== null &&
      value !== undefined &&
      typeof value === "object" &&
      "value" in value
    ) {
      value = value.value;
    }

    if (value === null || value instanceof FormModel) {
      return new SubFormValue(value);
    }

    return new SubFormValue(null);
  }
}

@staticImplements<IJsonableValueConverter<StringArrayValue>>()
export class StringArrayValue implements ITypedArrayValue<StringValue> {
  constructor(value: StringValue[]) {
    this.value = value;
  }

  get hasValue(): boolean {
    return this.value.length > 0;
  }

  readonly kind: "string[]" = "string[]";

  static key: "string[]" = "string[]";

  @observable
  readonly value: StringValue[];

  static get defaultValue() {
    return new StringArrayValue([]);
  }

  static toJson(value: StringArrayValue) {
    return value.value.map((v) => v.value);
  }

  static convertFrom(value: any): StringArrayValue {
    if (
      value !== null &&
      value !== undefined &&
      typeof value === "object" &&
      "value" in value
    ) {
      value = value.value;
    }

    if (Array.isArray(value)) {
      return new StringArrayValue(value.map((v) => StringValue.convertFrom(v)));
    }

    return new StringArrayValue([StringValue.convertFrom(value)]);
  }
}

@staticImplements<IJsonableValueConverter<NumberArrayValue>>()
export class NumberArrayValue implements ITypedArrayValue<NumberValue> {
  constructor(value: NumberValue[]) {
    this.value = value;
  }

  get hasValue(): boolean {
    return this.value.length > 0;
  }

  readonly kind: "number[]" = "number[]";

  static key: "number[]" = "number[]";

  @observable
  readonly value: NumberValue[];

  static toJson(value: NumberArrayValue) {
    return value.value.map((v) => v.value);
  }

  static get defaultValue() {
    return new NumberArrayValue([]);
  }

  static convertFrom(value: any): NumberArrayValue {
    if (
      value !== null &&
      value !== undefined &&
      typeof value === "object" &&
      "value" in value
    ) {
      value = value.value;
    }

    if (Array.isArray(value)) {
      return new NumberArrayValue(value.map((v) => NumberValue.convertFrom(v)));
    }

    return new NumberArrayValue([NumberValue.convertFrom(value)]);
  }
}

@staticImplements<ITypedValueConverter<SubFormValueArrayValue>>()
export class SubFormValueArrayValue implements ITypedArrayValue<SubFormValue> {
  constructor(value: SubFormValue[]) {
    this.value = value;
  }

  get hasValue(): boolean {
    return this.value.length > 0;
  }

  readonly kind: "subform[]" = "subform[]";

  static key: "subform[]" = "subform[]";

  static get defaultValue() {
    return new SubFormValueArrayValue([]);
  }

  @observable
  readonly value: SubFormValue[];

  readonly defaultValue = new SubFormValue(null);

  static convertFrom(value: any): SubFormValueArrayValue {
    if (
      value !== null &&
      value !== undefined &&
      typeof value === "object" &&
      "value" in value
    ) {
      value = value.value;
    }

    if (Array.isArray(value)) {
      return new SubFormValueArrayValue(
        value.map((v) => SubFormValue.convertFrom(v))
      );
    }

    return new SubFormValueArrayValue([SubFormValue.convertFrom(value)]);
  }
}

@staticImplements<IJsonableValueConverter<DateValue>>()
export class DateValue {
  constructor(value: Date | null) {
    this.value = value;
  }

  get hasValue(): boolean {
    return this.value !== null;
  }

  readonly kind: "date" = "date";

  static key: "date" = "date";

  static get defaultValue() {
    return new DateValue(null);
  }

  readonly value: Date | null;

  static convertFrom(value: any): DateValue {
    if (
      value !== null &&
      value !== undefined &&
      typeof value === "object" &&
      "value" in value
    ) {
      value = value.value;
    }

    if (value === null || value === undefined || value instanceof Date) {
      return new DateValue(value ?? null);
    }

    if (typeof value === "string") {
      if (value === "") {
        return new DateValue(null);
      }
      return new DateValue(new Date(value));
    }

    if (typeof value === "number") {
      if (isNaN(value)) {
        return new DateValue(null);
      }
      return new DateValue(new Date(value));
    }

    return new DateValue(new Date(Number(value)));
  }

  static toJson(value: DateValue) {
    return value.value?.toJSON();
  }
}

export type TypedArrayValue =
  | StringArrayValue
  | SubFormValueArrayValue
  | NumberArrayValue;

export type TypedValue =
  | StringValue
  | NumberValue
  | DateValue
  | NumberValue
  | VoidValue
  | SubFormValue
  | BooleanValue
  | TypedArrayValue;

export interface ITypedValueConverter<T extends TypedValue> {
  convertFrom(value: any): T;
  key: string;
  defaultValue: T;
}

export interface IJsonableValueConverter<T extends TypedValue>
  extends ITypedValueConverter<T> {
  toJson(
    value: T
  ):
    | string
    | undefined
    | null
    | boolean
    | number
    | (string | null)[]
    | (number | null)[];
}
