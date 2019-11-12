import ModelContainer from './ModelContainer'

export default class extends ModelContainer {
  constructor(emitter, prefix, mappingFunction, idPrefix = null) {
    super(emitter, prefix, mappingFunction, idPrefix)
  }

  get entityContainer() {
    return this._emitter.entity
  }

  get attributeContainer() {
    return this._emitter.attribute
  }

  get relationContainer() {
    return this._emitter.relation
  }
}
