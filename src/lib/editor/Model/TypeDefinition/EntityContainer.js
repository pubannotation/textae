import Container from './Container'

export default class extends Container {
  constructor(getAllInstanceFunc, defaultColor, lockStateObservable) {
    super(getAllInstanceFunc, defaultColor, lockStateObservable)
  }

  isBlock(typeName) {
    const definition = super.get(typeName)

    return definition && definition.type && definition.type === 'block'
  }
}
