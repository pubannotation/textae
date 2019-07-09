import Container from './Container'

export default class extends Container {
  constructor(getAllInstanceFunc, defaultColor) {
    super(getAllInstanceFunc, defaultColor)
  }

  isBlock(type) {
    const definition = this.getDefinedType(type)

    return definition && definition.type && definition.type === 'block'
  }
}
