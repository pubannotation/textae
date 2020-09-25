import LabelOverlay from './LabelOverlay'
import connectorStrokeStyle from './connectorStrokeStyle'
import toLabelString from './toLabelString'

export default function(annotationData, typeDefinition, relation) {
  const connect = relation.connect
  const strokeStyle = connectorStrokeStyle(
    annotationData,
    typeDefinition,
    relation.id
  )

  connect.setPaintStyle(strokeStyle)
  new LabelOverlay(connect).setLabel(
    toLabelString(relation, annotationData, typeDefinition)
  )
}
