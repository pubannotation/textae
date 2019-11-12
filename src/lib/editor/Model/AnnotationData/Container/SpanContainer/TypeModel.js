import idFactory from '../../../../idFactory'

export default class {
  constructor(name, definedTypes, entity) {
    this._name = name
    this._definedTypes = definedTypes
    this._entity = entity
  }

  get name() {
    return this._name
  }

  get id() {
    return idFactory.makeTypeId(this._entity)
  }

  get attributes() {
    return this._entity ? this._entity.attributes : []
  }

  get isBlock() {
    return this._definedTypes && this._definedTypes.isBlock(this._name)
  }
}
