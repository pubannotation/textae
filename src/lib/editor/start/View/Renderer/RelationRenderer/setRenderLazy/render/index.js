import Api from './Api'
import hoverize from './hoverize'
import createJsPlumbConnecttion from './createJsPlumbConnecttion'

export default function(
  jsPlumbInstance,
  editor,
  annotationData,
  typeDefinition,
  relation
) {
  // Delete reneder method for renderLazy
  delete relation.render

  const jsPlumbConnection = createJsPlumbConnecttion(
    jsPlumbInstance,
    editor,
    relation,
    annotationData,
    typeDefinition
  )

  hoverize(
    editor,
    annotationData,
    typeDefinition,
    jsPlumbConnection,
    relation.id
  )
  Object.assign(jsPlumbConnection, new Api())

  // Notify to controller that a new jsPlumbConnection is added.
  editor.trigger('textae.editor.jsPlumbConnection.add', jsPlumbConnection)

  relation.jsPlumbConnection = jsPlumbConnection
}
