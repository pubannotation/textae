import ModelContainer from './ModelContainer'
import Attribute from './Attribute'

export default class extends ModelContainer {
  constructor(emitter) {
    super(emitter, 'attribute', mappingFunction)
  }

  add(attribute) {
    return super.add(new Attribute(attribute), () => {
      super.emitter.emit(
        'entity.change',
        super.emitter.entity.get(attribute.subj)
      )
    })
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
    super.emitter.emit('entity.change', super.emitter.entity.get(model.subj))

    return model
  }

  remove(id) {
    const instance = super.remove(id)

    console.assert(instance, `There are no attribute ${id} to delete!`)

    super.emitter.emit('entity.change', super.emitter.entity.get(instance.subj))

    return instance
  }
}

function mappingFunction(attributes) {
  attributes = attributes || []
  return attributes.map((a) => new Attribute(a))
}
