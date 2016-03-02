import AnnotationData from './AnnotationData'
import Selection from './Selection'
import modelToId from '../modelToId'

export default function(editor) {
  const annotationData = new AnnotationData(editor),
    // A contaier of selection state.
    selectionModel = new Selection(['span', 'entity', 'relation']),
    eventMap = new Map([
      ['all.change', selectionModel.clear],
      ['span.remove', (span) => selectionModel.span.remove(modelToId(span))],
      ['entity.remove', (entity) => selectionModel.entity.remove(modelToId(entity))],
      ['relation.remove', (relation) => selectionModel.relation.remove(modelToId(relation))],
    ])

  // Bind the selection model to the model.
  for (let eventHandler of eventMap) {
    annotationData.on(eventHandler[0], eventHandler[1])
  }

  return {
    annotationData,
    selectionModel
  }
}
