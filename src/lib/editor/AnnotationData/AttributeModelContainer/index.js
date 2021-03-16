import AttributeModel from './AttributeModel'
import IdIssueContainer from '../IdIssueContainer'

export default class AttributeModelContainer extends IdIssueContainer {
  constructor(emitter, entityContainer, namespace, definitionContainer) {
    super(emitter, 'attribute', 'A')

    this._entityContainer = entityContainer
    this._namespace = namespace
    this._definitionContainer = definitionContainer
  }

  _toModel(attribute) {
    return new AttributeModel(
      attribute,
      this._entityContainer,
      this._namespace,
      this._definitionContainer
    )
  }

  add(newValue) {
    // When redoing, the newValue is instance of the AttributeModel already.
    newValue =
      newValue instanceof AttributeModel ? newValue : this._toModel(newValue)

    super.add(newValue)

    newValue.subjectModel.updateElement()

    return newValue
  }

  change(id, newPred, newObj) {
    const model = this.get(id)

    if (newPred) {
      model.pred = newPred
    }

    if (newObj !== undefined) {
      model.obj = newObj
    }

    super._emit(`textae-event.annotation-data.attribute.change`, model)

    return model
  }

  remove(id) {
    const instance = super.remove(id)

    console.assert(instance, `There are no attribute ${id} to delete!`)

    instance.subjectModel.updateElement()

    super._emit('textae-event.annotation-data.attribute.remove', instance)

    return instance
  }

  getSameDefinitionsAttributes(pred) {
    return this.all.filter((attr) => attr.pred === pred)
  }

  getSameAttributes(pred, obj) {
    return this.all.filter((a) => a.equalsTo(pred, obj))
  }

  getAttributesFor(subj) {
    return this.all
      .filter((a) => a.subj === subj)
      .sort((a, b) => this._definitionContainer.attributeCompareFunction(a, b))
  }
}
