import HOVER_ARROW from "./HOVER_ARROW"

export default function(connect) {
  return connect.getOverlay(HOVER_ARROW.id)
}
