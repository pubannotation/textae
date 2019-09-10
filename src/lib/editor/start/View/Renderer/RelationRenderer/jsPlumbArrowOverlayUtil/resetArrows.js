import addArrow from './addArrow'
import getArrowIds from './getArrowIds'

export default function(connect) {
  for (const id of getArrowIds(connect)) {
    connect.removeOverlays(id)
    addArrow(id, connect)
  }
}
