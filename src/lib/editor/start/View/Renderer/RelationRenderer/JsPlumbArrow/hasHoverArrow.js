import HOVER_ARROW from './HOVER_ARROW'

export default function(jsPlumbConnection) {
  return jsPlumbConnection.getOverlay(HOVER_ARROW.id)
}
