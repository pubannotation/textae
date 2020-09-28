import connectorStrokeStyle from '../../../../connectorStrokeStyle'
import hoverupLabel from './hoverupLabel'
import hoverupLine from './hoverupLine'
import hasClass from './hasClass'
import JsPlumbArrow from '../../../../JsPlumbArrow'

export default function(
  jsPlumbConnection,
  annotationData,
  typeDefinition,
  relationId
) {
  if (!hasClass(jsPlumbConnection, 'ui-selected')) {
    hoverupLine(jsPlumbConnection)
    hoverupLabel(jsPlumbConnection)
    jsPlumbConnection.setPaintStyle(
      connectorStrokeStyle(annotationData, typeDefinition, relationId)
    )
    new JsPlumbArrow(jsPlumbConnection).showBigArrow()
  }
}
