export default class {
  constructor(name, attributes = []) {
    this._name = name
    this._attributes = attributes
  }

  get name() {
    return this._name
  }

  get attributes() {
    return this._attributes
  }
}
