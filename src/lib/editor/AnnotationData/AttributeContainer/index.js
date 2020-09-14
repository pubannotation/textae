import AttributeModel from './AttributeModel'
import ContainerWithSubContainer from '../ContainerWithSubContainer'
import mappingFunction from './mappingFunction'
import issueId from '../issueId'

export default class extends ContainerWithSubContainer {
  constructor(emitter, parentContainer) {
    super(emitter, parentContainer, 'attribute', (attribute) => {
      const collection = mappingFunction(attribute, parentContainer.entity)

      // Move medols without id behind others, to prevet id duplication generated and exists.
      collection.sort((a, b) => {
        if (!a.id) return 1
        if (!b.id) return -1
        if (a.id < b.id) return -1
        if (a.id > b.id) return 1

        return 0
      })

      return collection
    })
  }

  add(attribute) {
    return super.add(
      new AttributeModel(attribute, super.entityContainer),
      (attribute) =>
        super._emit('textae.annotationData.attribute.add', attribute)
    )
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

  _addToContainer(instance) {
    return super._addToContainer(issueId(instance, this._container, 'A'))
  }
}
