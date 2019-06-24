import jsPlumbArrowOverlayUtil from '../../../../jsPlumbArrowOverlayUtil'
import connectorStrokeStyle from '../../../../connectorStrokeStyle'
import deselectLabel from './deselectLabel'
import deselectLine from './deselectLine'

export default function(connect, annotationData, typeContainer, relationId) {
  if (!connect.dead) {
    deselectLine(connect)
    deselectLabel(connect)
    connect.setPaintStyle(connectorStrokeStyle(annotationData, typeContainer, relationId))
    jsPlumbArrowOverlayUtil.hideBigArrow(connect)
  }
}
