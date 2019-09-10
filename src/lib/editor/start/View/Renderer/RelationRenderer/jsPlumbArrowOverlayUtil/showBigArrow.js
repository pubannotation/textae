import NORMAL_ARROW from './NORMAL_ARROW'
import HOVER_ARROW from './HOVER_ARROW'
import addArrow from './addArrow'
import hasHoverArrow from './hasHoverArrow'
import removeArrow from './removeArrow'

export default function(js_plumb_conncetion) {
  if (hasHoverArrow(js_plumb_conncetion)) {
    return
  }
  // Remove a normal arrow and add a new big arrow.
  // Because an arrow is out of position if hideOverlay and showOverlay is used.
  removeArrow(NORMAL_ARROW.id, js_plumb_conncetion)
  addArrow(HOVER_ARROW.id, js_plumb_conncetion)
}
