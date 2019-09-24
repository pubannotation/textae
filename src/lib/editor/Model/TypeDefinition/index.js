import Observable from 'observ'
import EntityContainer from './EntityContainer'
import Container from './Container'

export default class {
  constructor(annotationData) {
    this.lockStateObservable = new Observable(false)
    this.entityContainer = new EntityContainer(
      () => annotationData.entity.all,
      '#77DDDD',
      this.lockStateObservable
    )
    this.relationContaier = new Container(
      () => annotationData.relation.all,
      '#555555',
      this.lockStateObservable
    )
  }

  isLock() {
    return this.lockStateObservable()
  }

  lockEdit() {
    this.lockStateObservable.set(true)
  }
  unlockEdit() {
    this.lockStateObservable.set(false)
  }

  get entity() {
    return this.entityContainer
  }

  setDefinedEntityTypes(newDefinedTypes) {
    this.entityContainer.definedTypes = newDefinedTypes
  }

  get relation() {
    return this.relationContaier
  }

  setDefinedRelationTypes(newDefinedTypes) {
    this.relationContaier.definedTypes = newDefinedTypes
  }

  get config() {
    const ret = {}

    if (this.entityContainer.config.length) {
      ret['entity types'] = this.entityContainer.config
    }

    if (this.relationContaier.config.length) {
      ret['relation types'] = this.relationContaier.config
    }

    return ret
  }
}
