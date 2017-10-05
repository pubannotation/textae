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
    change: (id, newType, newPred) => {
      let model = container.get(id)
      if (newType) {
        model.type = newType
      }
      if (newPred) {
        model.pred = newPred
      }
      emitter.emit(container.name + '.change', model)
      return model
    }
  })
}

// Expected an entity like {id: "E21", span: "editor2__S50_54", type: "Protein"}.
let toModel = (editor, attribute) => {
    return {
      id: attribute.id,
      subj: attribute.subj,
      pred: attribute.pred,
      type: attribute.obj
    }
  },
  mappingFunction = (editor, attributions) => {
    attributions = attributions || []
    return attributions.map(_.partial(toModel, editor))
  }
