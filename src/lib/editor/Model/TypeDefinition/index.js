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
    return {
      'entity types': this.entityContainer.definedTypes,
      'relation types': this.relationContaier.definedTypes
    }
  }
}
