import connectorStrokeStyle from '../../../../connectorStrokeStyle'
import POINTUP_LINE_WIDTH from '../../../../POINTUP_LINE_WIDTH'
import selectLine from './selectLine'
import selectLabel from './selectLabel'
import hoverdownLabel from './hoverdownLabel'
import hoverdownLine from './hoverdownLine'
import showBigArrow from '../../../../jsPlumbArrowOverlayUtil/showBigArrow'

export default function(
  connect,
  editor,
  annotationData,
  typeDefinition,
  relationId
) {
  if (!connect.dead) {
    selectLine(editor, connect)
    selectLabel(connect)
    hoverdownLine(connect)
    hoverdownLabel(connect)
    connect.setPaintStyle(
      Object.assign(
        connectorStrokeStyle(annotationData, typeDefinition, relationId),
        {
          lineWidth: POINTUP_LINE_WIDTH
        }
      )
    )
    showBigArrow(connect)
  }
}
