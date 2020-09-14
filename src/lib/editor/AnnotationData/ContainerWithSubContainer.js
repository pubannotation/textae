import ModelContainer from './ModelContainer'

export default class extends ModelContainer {
  constructor(emitter, parentContainer, name, idPrefix = null) {
    super(emitter, name, idPrefix)
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
