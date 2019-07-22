import ModelContainer from './ModelContainer'
import Attribute from './Attribute'

export default class extends ModelContainer {
  constructor(emitter) {
    super(
      emitter,
      'attribute',
      mappingFunction,
      'A'
    )
    this.emitter = emitter
  }

  add(attribute) {
    return super.add(new Attribute(attribute))
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

    return model
  }
}

function mappingFunction(attributes) {
  attributes = attributes || []
  return attributes.map((a) => new Attribute(a))
}
