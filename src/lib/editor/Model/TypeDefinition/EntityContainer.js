import Container from './Container'

export default class extends Container {
  constructor(getAllInstanceFunc, defaultColor, lockStateObservable) {
    super(getAllInstanceFunc, defaultColor, lockStateObservable)
  }

  isBlock(type) {
    const definition = this.get(type.name)

    return definition && definition.type && definition.type === 'block'
  }
}
