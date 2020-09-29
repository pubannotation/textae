import HOVER_ARROW from './HOVER_ARROW'
import NORMAL_ARROW from '../../NORMAL_ARROW'

export default function(jsPlumbConnection) {
  if (jsPlumbConnection.getOverlay(HOVER_ARROW.id)) {
    return
  }

  // Remove a normal arrow and add a new big arrow.
  // Because an arrow is out of position if hideOverlay and showOverlay is used.
  jsPlumbConnection.removeOverlay(NORMAL_ARROW.id)
  jsPlumbConnection.addOverlay(['Arrow', HOVER_ARROW])
}
