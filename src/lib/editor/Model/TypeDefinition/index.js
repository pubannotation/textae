import Observable from 'observ'
import EntityContainer from './EntityContainer'
import Container from './Container'
import setContainerDefinedTypes from './setContainerDefinedTypes'

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
    return setContainerDefinedTypes(this.entityContainer, newDefinedTypes)
  }

  get relation() {
    return this.relationContaier
  }

  setDefinedRelationTypes(newDefinedTypes) {
    return setContainerDefinedTypes(this.relationContaier, newDefinedTypes)
  }

  get config() {
    return {
      'entity types': this.entityContainer.getDefinedTypes(),
      'relation types': this.relationContaier.getDefinedTypes()
    }
  }
}
