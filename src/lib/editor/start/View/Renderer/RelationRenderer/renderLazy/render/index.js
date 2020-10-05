import JsPlumbConnectionWrapper from './JsPlumbConnectionWrapper'

export default function(
  jsPlumbInstance,
  editor,
  annotationData,
  typeDefinition,
  relation
) {
  const jsPlumbConnection = new JsPlumbConnectionWrapper(
    jsPlumbInstance,
    editor,
    relation,
    annotationData,
    typeDefinition
  )

  // Bind a jsPlumbConnection event.
  jsPlumbConnection
    .bind('mouseenter', () => jsPlumbConnection.pointup())
    .bind('mouseexit', () => jsPlumbConnection.pointdown())
    .bind('click', (_, event) => {
      editor.eventEmitter.emit(
        'textae.editor.jsPlumbConnection.click',
        jsPlumbConnection,
        event
      )
    })

  relation.jsPlumbConnection = jsPlumbConnection
}
