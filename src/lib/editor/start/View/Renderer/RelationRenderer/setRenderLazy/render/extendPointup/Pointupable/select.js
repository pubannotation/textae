import connectorStrokeStyle from '../../../../connectorStrokeStyle'
import selectLine from './selectLine'
import selectLabel from './selectLabel'
import hoverdownLabel from './hoverdownLabel'
import hoverdownLine from './hoverdownLine'
import JsPlumbArrow from '../../../../JsPlumbArrow'

export default function(
  connect,
  editor,
  annotationData,
  typeDefinition,
  relationId
) {
  if (!connect.dead) {
    connect.setPaintStyle(
      connectorStrokeStyle(annotationData, typeDefinition, relationId)
    )
    selectLine(editor, connect)
    selectLabel(connect)
    hoverdownLine(connect)
    hoverdownLabel(connect)
    new JsPlumbArrow(connect).showBigArrow()
  }
}
