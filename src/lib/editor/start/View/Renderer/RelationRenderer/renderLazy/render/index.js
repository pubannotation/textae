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
  const jsPlumbConnection = createJsPlumbConnecttion(
    jsPlumbInstance,
    editor,
    relation,
    annotationData,
    typeDefinition
  )

  hoverize(annotationData, typeDefinition, jsPlumbConnection, relation.id)
  Object.assign(jsPlumbConnection, new Api())

  // Notify to controller that a new jsPlumbConnection is added.
  editor.eventEmitter.emit(
    'textae.editor.jsPlumbConnection.add',
    jsPlumbConnection
  )

  relation.jsPlumbConnection = jsPlumbConnection
}
