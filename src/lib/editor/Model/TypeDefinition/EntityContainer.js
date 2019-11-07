import Container from './Container'

export default class extends Container {
  constructor(getAllInstanceFunc, defaultColor, lockStateObservable) {
    super(getAllInstanceFunc, defaultColor, lockStateObservable)
  }

  isBlock(typeName) {
    return this._definedTypes.isBlock(typeName)
  }
}
