import idFactory from '../../../../idFactory'

export default class {
  constructor(name, id = null, entity = null) {
    this.name = name
    this._entity = entity

    if (entity) {
      this.entities = [entity]
      this.attributes = entity.attributes
    }
  }

  get id() {
    return idFactory.makeTypeId(this._entity)
  }
}
