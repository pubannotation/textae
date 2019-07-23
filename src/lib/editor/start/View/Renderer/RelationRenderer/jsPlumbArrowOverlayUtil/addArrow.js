import NORMAL_ARROW from "./NORMAL_ARROW"
import HOVER_ARROW from "./HOVER_ARROW"

export default function(id, connect) {
  if (id === NORMAL_ARROW.id) {
    connect.addOverlay(['Arrow', NORMAL_ARROW])
  } else if (id === HOVER_ARROW.id) {
    connect.addOverlay(['Arrow', HOVER_ARROW])
  }
  return connect
}
