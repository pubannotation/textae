import Api from './Api'
import hoverize from './hoverize'
import createJsPlumbConnect from './createJsPlumbConnect'

export default function(jsPlumbInstance, editor, annotationData, typeContainer, modification, relation, cache) {
  deleteRender(relation)

  const connect = create(jsPlumbInstance, editor, relation, annotationData, typeContainer, modification)
  hoverize(editor, annotationData, typeContainer, connect)
  Object.assign(connect, new Api())

  // Notify to controller that a new jsPlumbConnection is added.
  editor.trigger('textae.editor.jsPlumbConnection.add', connect)
  cache(connect)
}

function deleteRender(relation) {
  delete relation.render
  return relation
}

function create(jsPlumbInstance, editor, relation, annotationData, typeContainer, modification) {
  return Object.assign(createJsPlumbConnect(jsPlumbInstance, editor, relation, annotationData, typeContainer, modification), {
    relationId: relation.id
  })
}


