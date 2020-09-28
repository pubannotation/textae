import NORMAL_ARROW from '../NORMAL_ARROW'
import HOVER_ARROW from './HOVER_ARROW'
import addArrow from './addArrow'
import hasNormalArrow from './hasNormalArrow'
import removeArrow from './removeArrow'

export default function(jsPlumbConnection) {
  if (hasNormalArrow(jsPlumbConnection)) {
    return
  }
  removeArrow(HOVER_ARROW.id, jsPlumbConnection)
  addArrow(NORMAL_ARROW.id, jsPlumbConnection)
}
