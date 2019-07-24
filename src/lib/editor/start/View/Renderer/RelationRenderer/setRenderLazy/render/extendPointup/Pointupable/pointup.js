import jsPlumbArrowOverlayUtil from '../../../../jsPlumbArrowOverlayUtil'
import connectorStrokeStyle from '../../../../connectorStrokeStyle'
import POINTUP_LINE_WIDTH from '../../../../POINTUP_LINE_WIDTH'
import hoverupLabel from './hoverupLabel'
import hoverupLine from './hoverupLine'
import hasClass from './hasClass'

export default function(connect, annotationData, typeDefinition, relationId) {
  if (!hasClass(connect, 'ui-selected')) {
    hoverupLine(connect)
    hoverupLabel(connect)
    connect.setPaintStyle(
      Object.assign(
        connectorStrokeStyle(annotationData, typeDefinition, relationId),
        {
          lineWidth: POINTUP_LINE_WIDTH
        }
      )
    )
    jsPlumbArrowOverlayUtil.showBigArrow(connect)
  }
}
