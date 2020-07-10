import connectorStrokeStyle from '../../../../connectorStrokeStyle'
import hoverupLabel from './hoverupLabel'
import hoverupLine from './hoverupLine'
import hasClass from './hasClass'
import JsPlumbArrow from '../../../../JsPlumbArrow'

export default function(connect, annotationData, typeDefinition, relationId) {
  if (!hasClass(connect, 'ui-selected')) {
    hoverupLine(connect)
    hoverupLabel(connect)
    connect.setPaintStyle(
      connectorStrokeStyle(annotationData, typeDefinition, relationId)
    )
    new JsPlumbArrow(connect).showBigArrow()
  }
}
