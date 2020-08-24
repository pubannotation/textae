export default class {
  constructor(name, entity) {
    this._name = name
    this._entity = entity
  }

  get name() {
    return this._name
  }

  get attributes() {
    return this._entity ? this._entity.attributes : []
  }
}
