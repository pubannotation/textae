import connectorStrokeStyle from './connectorStrokeStyle'
import toLabelString from './toLabelString'
import getLabelOverlay from '../../../getLabelOverlay'

export default function(annotationData, typeDefinition, relation) {
  const jsPlumbConnection = relation.jsPlumbConnection
  const strokeStyle = connectorStrokeStyle(
    annotationData,
    typeDefinition,
    relation.id
  )

  jsPlumbConnection.setPaintStyle(strokeStyle)
  getLabelOverlay(jsPlumbConnection).setLabel(
    toLabelString(relation, annotationData, typeDefinition)
  )
}
