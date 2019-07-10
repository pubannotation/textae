import EditableContainer from './EditableContainer'

export default class extends EditableContainer {
  constructor(getAllInstanceFunc, defaultColor, lockStateObservable) {
    super(getAllInstanceFunc, defaultColor, lockStateObservable)
  }

  isBlock(type) {
    const definition = this.getDefinedType(type)

    return definition && definition.type && definition.type === 'block'
  }
}
