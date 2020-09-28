import NORMAL_ARROW from '../NORMAL_ARROW'
import HOVER_ARROW from './HOVER_ARROW'

export default function(id, jsPlumbConnection) {
  if (id === NORMAL_ARROW.id) {
    jsPlumbConnection.addOverlay(['Arrow', NORMAL_ARROW])
  } else if (id === HOVER_ARROW.id) {
    jsPlumbConnection.addOverlay(['Arrow', HOVER_ARROW])
  }
}
