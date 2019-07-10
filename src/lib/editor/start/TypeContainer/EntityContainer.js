import EditableContainer from './EditableContainer'

export default class extends EditableContainer {
  constructor(getAllInstanceFunc, defaultColor, getLockStateFunc) {
    super(getAllInstanceFunc, defaultColor, getLockStateFunc)
  }

  isBlock(type) {
    const definition = this.getDefinedType(type)

    return definition && definition.type && definition.type === 'block'
  }
}
