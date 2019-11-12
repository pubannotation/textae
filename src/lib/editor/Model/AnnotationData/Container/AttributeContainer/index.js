import AttributeModel from './AttributeModel'
import ContatinerWithEmitter from '../ContatinerWithEmitter'
import mappingFunction from './mappingFunction'

export default class extends ContatinerWithEmitter {
  constructor(emitter) {
    super(emitter, 'attribute', (attribute) =>
      mappingFunction(attribute, emitter.entity)
    )
  }

  add(attribute) {
    return super.add(
      new AttributeModel(attribute, super.emitter.entity),
      (attribute) => super.emitter.emit('entity.change', attribute.entity)
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

    super.emitter.emit(`${this.name}.change`, model)
    super.emitter.emit('entity.change', model.entity)

    return model
  }

  remove(id) {
    const instance = super.remove(id)

    console.assert(instance, `There are no attribute ${id} to delete!`)

    super.emitter.emit('entity.change', instance.entity)

    return instance
  }
}
