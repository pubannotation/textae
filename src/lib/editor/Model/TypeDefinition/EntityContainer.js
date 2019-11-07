import Container from './Container'

export default class extends Container {
  constructor(annotationDataEntity, lockStateObservable) {
    super(() => annotationDataEntity.all, lockStateObservable, '#77DDDD')
    this._annotationDataEntity = annotationDataEntity
  }

  set definedTypes(value = []) {
    super.definedTypes = value
    this._annotationDataEntity.definedTypes = this.definedTypes
  }

  get definedTypes() {
    return this._definedTypes
  }

  isBlock(typeName) {
    return this._definedTypes.isBlock(typeName)
  }
}
