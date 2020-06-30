import AttributeModel from './AttributeModel'
import ContainerWithSubContainer from '../ContainerWithSubContainer'
import mappingFunction from './mappingFunction'

export default class extends ContainerWithSubContainer {
  constructor(emitter, parentContainer) {
    super(emitter, parentContainer, 'attribute', (attribute) =>
      mappingFunction(attribute, parentContainer.entity)
    )
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
}
