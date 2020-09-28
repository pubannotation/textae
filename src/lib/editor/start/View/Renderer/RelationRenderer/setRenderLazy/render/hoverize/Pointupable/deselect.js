import connectorStrokeStyle from '../../../../connectorStrokeStyle'
import deselectLabel from './deselectLabel'
import deselectLine from './deselectLine'
import JsPlumbArrow from '../../../../JsPlumbArrow'

export default function(
  jsPlumbConnection,
  annotationData,
  typeDefinition,
  relationId
) {
  if (!jsPlumbConnection.dead) {
    deselectLine(jsPlumbConnection)
    deselectLabel(jsPlumbConnection)
    jsPlumbConnection.setPaintStyle(
      connectorStrokeStyle(annotationData, typeDefinition, relationId)
    )
    new JsPlumbArrow(jsPlumbConnection).hideBigArrow()
  }
}
