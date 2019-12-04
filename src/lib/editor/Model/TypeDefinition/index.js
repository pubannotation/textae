import Observable from 'observ'
import EntityContainer from './EntityContainer'
import Container from './Container'

export default class {
  constructor(editor, annotationData) {
    this._lockStateObservable = new Observable(false)
    this._entityContainer = new EntityContainer(
      editor,
      annotationData.entity,
      this._lockStateObservable
    )
    this._relationContainer = new Container(
      editor,
      'relation',
      () => annotationData.relation.all,
      this._lockStateObservable
    )
  }

  isLock() {
    return this._lockStateObservable()
  }

  lockEdit() {
    this._lockStateObservable.set(true)
  }
  unlockEdit() {
    this._lockStateObservable.set(false)
  }

  get entity() {
    return this._entityContainer
  }

  setDefinedEntityTypes(newDefinedTypes) {
    this._entityContainer.definedTypes = newDefinedTypes
  }

  get relation() {
    return this._relationContainer
  }

  setDefinedRelationTypes(newDefinedTypes) {
    this._relationContainer.definedTypes = newDefinedTypes
  }

  get config() {
    const ret = {}

    if (this._entityContainer.config.length) {
      ret['entity types'] = this._entityContainer.config
    }

    if (this._relationContainer.config.length) {
      ret['relation types'] = this._relationContainer.config
    }

    return ret
  }
}
