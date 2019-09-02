import ModelContainer from './ModelContainer'

export default class extends ModelContainer {
  constructor(emitter, prefix, mappingFunction, idPrefix = null) {
    super(emitter, prefix, mappingFunction, idPrefix)
  }

  get emitter() {
    return this._emitter
  }
}
