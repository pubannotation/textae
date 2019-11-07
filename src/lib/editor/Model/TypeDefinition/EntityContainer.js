import Container from './Container'

export default class extends Container {
  constructor(annotationDataEntity, defaultColor, lockStateObservable) {
    super(() => annotationDataEntity.all, defaultColor, lockStateObservable)
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
