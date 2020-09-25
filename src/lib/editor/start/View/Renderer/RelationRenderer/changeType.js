import Connect from './Connect'
import LabelOverlay from './LabelOverlay'
import connectorStrokeStyle from './connectorStrokeStyle'
import toLabelString from './toLabelString'

export default function(editor, annotationData, typeDefinition, relation) {
  const connect = new Connect(editor, relation)
  const strokeStyle = connectorStrokeStyle(
    annotationData,
    typeDefinition,
    relation.id
  )

  // The connect may be an object for lazyRender instead of jsPlumb.Connection.
  // This occurs when changing types and deletes was reverted.
  if (connect instanceof jsPlumb.Connection) {
    connect.setPaintStyle(strokeStyle)
    new LabelOverlay(connect).setLabel(
      toLabelString(relation, annotationData, typeDefinition)
    )
  }
}
