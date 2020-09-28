import getLabelOverlay from '../../../../../../getLabelOverlay'
import Pointupable from './Pointupable'

// Set hover action.
export default function(
  annotationData,
  typeDefinition,
  jsPlumbConnection,
  relationId
) {
  const pointupable = new Pointupable(
    annotationData,
    typeDefinition,
    jsPlumbConnection,
    relationId
  )

  Object.assign(jsPlumbConnection, {
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

  jsPlumbConnection
    .bind('mouseenter', () => jsPlumbConnection.pointup())
    .bind('mouseexit', () => jsPlumbConnection.pointdown())

  getLabelOverlay(jsPlumbConnection)
    .bind('mouseenter', () => jsPlumbConnection.pointup())
    .bind('mouseexit', () => jsPlumbConnection.pointdown())

  return jsPlumbConnection
}
