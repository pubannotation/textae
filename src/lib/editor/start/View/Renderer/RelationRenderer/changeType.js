import Connect from './Connect'
import LabelOverlay from './LabelOverlay'
import connectorStrokeStyle from './connectorStrokeStyle'
import POINTUP_LINE_WIDTH from './POINTUP_LINE_WIDTH'

export default function changeType(
  editor,
  annotationData,
  typeDefinition,
  selectionModel,
  relation
) {
  const connect = new Connect(editor, annotationData, relation.id)
  const strokeStyle = connectorStrokeStyle(
    annotationData,
    typeDefinition,
    relation.id
  )

  // The connect may be an object for lazyRender instead of jsPlumb.Connection.
  // This occurs when changing types and deletes was reverted.
  if (connect instanceof jsPlumb.Connection) {
    if (selectionModel.relation.has(relation.id)) {
      // Re-set style of the line and arrow if selected.
      strokeStyle.lineWidth = POINTUP_LINE_WIDTH
    }
    connect.setPaintStyle(strokeStyle)
    new LabelOverlay(connect).setLabel('[' + relation.id + '] ' + relation.type)
  }
}
