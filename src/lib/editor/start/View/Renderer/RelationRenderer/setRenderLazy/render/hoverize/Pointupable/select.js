import connectorStrokeStyle from '../../../../connectorStrokeStyle'
import selectLine from './selectLine'
import selectLabel from './selectLabel'
import hoverdownLabel from './hoverdownLabel'
import hoverdownLine from './hoverdownLine'
import JsPlumbArrow from '../../../../JsPlumbArrow'

export default function(
  jsPlumbConnection,
  editor,
  annotationData,
  typeDefinition,
  relationId
) {
  if (!jsPlumbConnection.dead) {
    jsPlumbConnection.setPaintStyle(
      connectorStrokeStyle(annotationData, typeDefinition, relationId)
    )
    selectLine(editor, jsPlumbConnection)
    selectLabel(jsPlumbConnection)
    hoverdownLine(jsPlumbConnection)
    hoverdownLabel(jsPlumbConnection)
    new JsPlumbArrow(jsPlumbConnection).showBigArrow()
  }
}
