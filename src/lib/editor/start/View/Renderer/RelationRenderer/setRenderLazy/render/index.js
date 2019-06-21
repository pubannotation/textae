import Api from './Api'
import hoverize from './hoverize'
import createJsPlumbConnect from './createJsPlumbConnect'
import cache from '../cache'

export default function(jsPlumbInstance, editor, annotationData, typeContainer, modificationRenderer, relation) {
  // Delete reneder method for renderLazy
  delete relation.render

  const connect = createJsPlumbConnect(jsPlumbInstance, editor, relation, annotationData, typeContainer, modificationRenderer)

  extendRelationId(connect, relation)

  hoverize(editor, annotationData, typeContainer, connect)
  Object.assign(connect, new Api())

  // Notify to controller that a new jsPlumbConnection is added.
  editor.trigger('textae.editor.jsPlumbConnection.add', connect)
  cache(connect, editor, annotationData)
}

// The relation id needs to be embedded in the jsPlumb connector instance.
//
// When hovering the relation, the connector of the relationship is broadened.
// At that time, the color of the connector is required.
// Colors are obtained by type from the type container.
// Type is obtained from the model by the relation ID.
function extendRelationId(connect, relation) {
  return Object.assign(connect, {
    relationId: relation.id
  })
}
