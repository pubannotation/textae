import getLabelOverlay from '../../../../../../getLabelOverlay'
import Pointupable from './Pointupable'

// Set hover action.
export default function(
  editor,
  annotationData,
  typeDefinition,
  connect,
  relationId
) {
  // The relation id needs to be embedded in the jsPlumb connector instance.
  //
  // When hovering the relation, the connector of the relationship is broadened.
  // At that time, the color of the connector is required.
  // Colors are obtained by type from the type container.
  // Type is obtained from the model by the relation ID.
  Object.assign(connect, {
    relationId
  })

  const pointupable = new Pointupable(
    editor,
    annotationData,
    typeDefinition,
    connect
  )

  Object.assign(connect, {
    pointup() {
      pointupable.pointup()
    },
    pointdown() {
      pointupable.pointdown()
    },
    select() {
      pointupable.select()
    },
    deselect() {
      pointupable.deselect()
    }
  })

  connect
    .bind('mouseenter', () => connect.pointup())
    .bind('mouseexit', () => connect.pointdown())

  getLabelOverlay(connect)
    .bind('mouseenter', () => connect.pointup())
    .bind('mouseexit', () => connect.pointdown())

  return connect
}
