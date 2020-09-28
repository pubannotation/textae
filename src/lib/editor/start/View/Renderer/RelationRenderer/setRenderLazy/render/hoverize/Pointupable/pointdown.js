import connectorStrokeStyle from '../../../../connectorStrokeStyle'
import hoverdownLabel from './hoverdownLabel'
import hoverdownLine from './hoverdownLine'
import hasClass from './hasClass'
import JsPlumbArrow from '../../../../JsPlumbArrow'

export default function(
  jsPlumbConnection,
  annotationData,
  typeDefinition,
  relationId
) {
  if (!hasClass(jsPlumbConnection, 'ui-selected')) {
    hoverdownLine(jsPlumbConnection)
    hoverdownLabel(jsPlumbConnection)
    jsPlumbConnection.setPaintStyle(
      connectorStrokeStyle(annotationData, typeDefinition, relationId)
    )
    new JsPlumbArrow(jsPlumbConnection).hideBigArrow()
  }
}
