import AttributeModel from './AttributeModel'
import ContatinerWithSubContainer from '../ContatinerWithSubContainer'
import mappingFunction from './mappingFunction'

export default class extends ContatinerWithSubContainer {
  constructor(emitter, parentContainer) {
    super(emitter, parentContainer, 'attribute', (attribute) =>
      mappingFunction(attribute, parentContainer.entity)
    )
  }

  add(attribute) {
    return super.add(
      new AttributeModel(attribute, super.entityContainer),
      (attribute) =>
        super._emit('textae.annotationData.entity.change', attribute.entity)
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

    super._emit(`textae.annotationData.${this.name}.change`, model)
    super._emit('textae.annotationData.entity.change', model.entity)

    return model
  }

  remove(id) {
    const instance = super.remove(id)

    console.assert(instance, `There are no attribute ${id} to delete!`)

    super._emit('textae.annotationData.entity.change', instance.entity)

    return instance
  }
}
