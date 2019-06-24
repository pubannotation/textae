import Api from './Api'
import hoverize from './hoverize'
import createJsPlumbConnect from './createJsPlumbConnect'
import cache from '../cache'

export default function(jsPlumbInstance, editor, annotationData, typeContainer, modificationRenderer, relation) {
  // Delete reneder method for renderLazy
  delete relation.render

  const connect = createJsPlumbConnect(jsPlumbInstance, editor, relation, annotationData, typeContainer, modificationRenderer)

  hoverize(editor, annotationData, typeContainer, connect, relation.id)
  Object.assign(connect, new Api())

  // Notify to controller that a new jsPlumbConnection is added.
  editor.trigger('textae.editor.jsPlumbConnection.add', connect)
  cache(connect, editor, annotationData)
}
