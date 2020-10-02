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

  // Bind a jsPlumbConnection event.
  jsPlumbConnection.bind('click', (_, event) => {
    editor.eventEmitter.emit(
      'textae.editor.jsPlumbConnection.click',
      jsPlumbConnection,
      event
    )
  })

  relation.jsPlumbConnection = jsPlumbConnection
}
