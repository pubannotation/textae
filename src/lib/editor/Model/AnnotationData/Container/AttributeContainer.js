import ModelContainer from './ModelContainer'

export default class extends ModelContainer {
  constructor(editor, emitter) {
    super(
      emitter,
      'attribute',
      mappingFunction,
      'A'
    )
    this.emitter = emitter
  }

  change(id, newPred, newValue) {
    const model = this.get(id)

    if (newPred) {
      model.pred = newPred
    }

    if (newValue) {
      model.value = newValue
    }

    this.emitter.emit(`${this.name}.change`, model)

    return model
  }
}

// Expected an attribute like {id: "A1", subj: "T1", pred: "example_predicate_1", obj: "attr1"}.
function toModel(attribute) {
  return {
    id: attribute.id,
    subj: attribute.subj,
    pred: attribute.pred,
    value: attribute.obj
  }
}

function mappingFunction(attributes) {
  attributes = attributes || []
  return attributes.map(toModel)
}
