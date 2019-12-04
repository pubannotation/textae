import ModelContainer from './ModelContainer'

export default class extends ModelContainer {
  constructor(
    emitter,
    parentContainer,
    prefix,
    mappingFunction,
    idPrefix = null
  ) {
    super(emitter, prefix, mappingFunction, idPrefix)
    this._parentContainer = parentContainer
  }

  get entityContainer() {
    return this._parentContainer.entity
  }

  get attributeContainer() {
    return this._parentContainer.attribute
  }

  get relationContainer() {
    return this._parentContainer.relation
  }
}
