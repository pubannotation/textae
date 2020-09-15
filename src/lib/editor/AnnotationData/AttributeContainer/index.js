import AttributeModel from './AttributeModel'
import IdIssueContainer from '../IdIssueContainer'

export default class extends IdIssueContainer {
  constructor(emitter, parentContainer) {
    super(emitter, 'attribute', 'A')

    // Since the attribute container and the entity container are cross-referenced,
    // the entity container is retrieved dynamically.
    this._parentContainer = parentContainer
  }

  get _entityContainer() {
    return this._parentContainer.entity
  }

  _toModel(attribute) {
    return new AttributeModel(attribute, this._entityContainer)
  }

  add(attribute) {
    return super.add(this._toModel(attribute))
  }

  change(id, newPred, newObj) {
    const model = this.get(id)

    if (newPred) {
      model.pred = newPred
    }

    if (newObj) {
      model.obj = newObj
    }

    super._emit(`textae.annotationData.attribute.change`, model)

    return model
  }

  remove(id) {
    const instance = super.remove(id)

    console.assert(instance, `There are no attribute ${id} to delete!`)

    super._emit('textae.annotationData.attribute.remove', instance)

    return instance
  }

  getSameAttributes(pred, obj) {
    return this.all.filter((a) => a.pred === pred && a.obj === obj)
  }
}
