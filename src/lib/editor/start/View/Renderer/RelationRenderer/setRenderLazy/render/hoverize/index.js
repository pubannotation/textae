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
  const pointupable = new Pointupable(
    editor,
    annotationData,
    typeDefinition,
    connect,
    relationId
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
