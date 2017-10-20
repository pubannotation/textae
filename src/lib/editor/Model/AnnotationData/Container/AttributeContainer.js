import idFactory from '../../../idFactory'
import ModelContainer from './ModelContainer'
import _ from 'underscore'

export default function(editor, emitter) {
  let container = new ModelContainer(
    emitter,
    'attribute',
    _.partial(mappingFunction, editor),
    'A'
  )

  return _.extend(container, {
    change: (id, newPred, newValue) => {
      let model = container.get(id)
      if (newPred) {
        model.pred = newPred
      }
      if (newValue) {
        model.value = newValue
      }
      emitter.emit(container.name + '.change', model)
      return model
    }
  })
}

// Expected an attribute like {id: "A1", subj: "T1", pred: "example_predicate_1", obj: "attr1"}.
let toModel = (editor, attribute) => {
    return {
      id: attribute.id,
      subj: attribute.subj,
      pred: attribute.pred,
      value: attribute.obj
    }
  },
  mappingFunction = (editor, attributions) => {
    attributions = attributions || []
    return attributions.map(_.partial(toModel, editor))
  }
