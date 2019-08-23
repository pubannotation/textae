import ModelContainer from './ModelContainer'
import Attribute from './Attribute'

export default class extends ModelContainer {
  constructor(emitter) {
    super(emitter, 'attribute', mappingFunction)
    this.emitter = emitter
  }

  add(attribute) {
    return super.add(new Attribute(attribute), () => {
      this.emitter.emit(
        'entity.change',
        this.emitter.entity.get(attribute.subj)
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

    this.emitter.emit(`${this.name}.change`, model)
    this.emitter.emit('entity.change', this.emitter.entity.get(model.subj))

    return model
  }

  remove(id) {
    const instance = super.remove(id)

    console.assert(instance, `There are no attribute ${id} to delete!`)

    this.emitter.emit('entity.change', this.emitter.entity.get(instance.subj))

    return instance
  }
}

function mappingFunction(attributes) {
  attributes = attributes || []
  return attributes.map((a) => new Attribute(a))
}
