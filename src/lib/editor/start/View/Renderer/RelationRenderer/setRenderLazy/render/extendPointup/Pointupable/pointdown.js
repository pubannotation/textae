import connectorStrokeStyle from '../../../../connectorStrokeStyle'
import hoverdownLabel from './hoverdownLabel'
import hoverdownLine from './hoverdownLine'
import hasClass from './hasClass'
import JsPlumbArrow from '../../../../JsPlumbArrow'

export default function(connect, annotationData, typeDefinition, relationId) {
  if (!hasClass(connect, 'ui-selected')) {
    hoverdownLine(connect)
    hoverdownLabel(connect)
    connect.setPaintStyle(
      connectorStrokeStyle(annotationData, typeDefinition, relationId)
    )
    new JsPlumbArrow(connect).hideBigArrow()
  }
}
