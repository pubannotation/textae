import AttributeModel from './AttributeModel'
import IdIssueContainer from '../IdIssueContainer'

export default class AttributeModelContainer extends IdIssueContainer {
  constructor(emitter, entityContainer) {
    super(emitter, 'attribute', 'A')

    this._entityContainer = entityContainer
  }

  _toModel(attribute) {
    return new AttributeModel(attribute, this._entityContainer)
  }

  add(newValue) {
    // When redoing, the newValue is instance of the AttributeModel already.
    if (newValue instanceof AttributeModel) {
      return super.add(newValue)
    }

    return super.add(this._toModel(newValue))
  }

  change(id, newPred, newObj) {
    const model = this.get(id)

    if (newPred) {
      model.pred = newPred
    }

    if (newObj) {
      model.obj = newObj
    }

    super._emit(`textae-event.annotation-data.attribute.change`, model)

    return model
  }

  remove(id) {
    const instance = super.remove(id)

    console.assert(instance, `There are no attribute ${id} to delete!`)

    super._emit('textae-event.annotation-data.attribute.remove', instance)

    return instance
  }

  getSameDefinitionsAttributes(pred) {
    return this.all.filter((attr) => attr.pred === pred)
  }

  getSameAttributes(pred, obj) {
    return this.all.filter((a) => a.equalsTo(pred, obj))
  }
}
