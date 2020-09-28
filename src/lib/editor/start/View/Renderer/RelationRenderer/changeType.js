import connectorStrokeStyle from './connectorStrokeStyle'
import toLabelString from './toLabelString'
import getLabelOverlay from '../../../getLabelOverlay'

export default function(annotationData, typeDefinition, relation) {
  const connect = relation.connect
  const strokeStyle = connectorStrokeStyle(
    annotationData,
    typeDefinition,
    relation.id
  )

  connect.setPaintStyle(strokeStyle)
  getLabelOverlay(connect).setLabel(
    toLabelString(relation, annotationData, typeDefinition)
  )
}
