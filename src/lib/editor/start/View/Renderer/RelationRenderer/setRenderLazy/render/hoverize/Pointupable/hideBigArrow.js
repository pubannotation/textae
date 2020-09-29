import HOVER_ARROW from './HOVER_ARROW'
import NORMAL_ARROW from '../../NORMAL_ARROW'

export default function(jsPlumbConnection) {
  if (jsPlumbConnection.getOverlay(NORMAL_ARROW.id)) {
    return
  }

  jsPlumbConnection.removeOverlay(HOVER_ARROW.id)
  jsPlumbConnection.addOverlay(['Arrow', NORMAL_ARROW])
}
