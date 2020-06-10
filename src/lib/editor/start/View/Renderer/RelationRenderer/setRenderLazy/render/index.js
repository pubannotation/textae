import Api from './Api'
import hoverize from './hoverize'
import createJsPlumbConnect from './createJsPlumbConnect'
import cache from '../cache'

export default function(
  jsPlumbInstance,
  editor,
  annotationData,
  typeDefinition,
  relation
) {
  // Delete reneder method for renderLazy
  delete relation.render

  const connect = createJsPlumbConnect(
    jsPlumbInstance,
    editor,
    relation,
    annotationData,
    typeDefinition
  )

  hoverize(editor, annotationData, typeDefinition, connect, relation.id)
  Object.assign(connect, new Api())

  // Notify to controller that a new jsPlumbConnection is added.
  editor.trigger('textae.editor.jsPlumbConnection.add', connect)
  cache(connect, editor, annotationData)
}
