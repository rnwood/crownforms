
export interface IFFModel {
  [x: string]: string|number|boolean|Date|IFFModel|JsonableArray|null|undefined;
}

interface JsonableArray extends Array<null|string|number|boolean|Date|IFFModel|JsonableArray> { }
