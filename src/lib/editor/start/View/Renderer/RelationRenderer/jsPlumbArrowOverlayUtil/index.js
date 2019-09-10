import NORMAL_ARROW from './NORMAL_ARROW'
import HOVER_ARROW from './HOVER_ARROW'
import addArrow from './addArrow'
import hasNormalArrow from './hasNormalArrow'
import hasHoverArrow from './hasHoverArrow'
import removeArrow from './removeArrow'
import resetArrows from './resetArrows'

export default {
  NORMAL_ARROW,
  resetArrows(connect) {
    resetArrows(connect)
  },
  showBigArrow(connect) {
    if (hasHoverArrow(connect)) {
      return connect
    }

    // Remove a normal arrow and add a new big arrow.
    // Because an arrow is out of position if hideOverlay and showOverlay is used.
    removeArrow(NORMAL_ARROW.id, connect)
    addArrow(HOVER_ARROW.id, connect)

    return connect
  },
  hideBigArrow(connect) {
    if (hasNormalArrow(connect)) {
      return connect
    }

    removeArrow(HOVER_ARROW.id, connect)
    addArrow(NORMAL_ARROW.id, connect)

    return connect
  }
}
