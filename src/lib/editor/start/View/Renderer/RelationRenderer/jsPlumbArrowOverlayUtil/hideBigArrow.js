import NORMAL_ARROW from '../NORMAL_ARROW'
import HOVER_ARROW from './HOVER_ARROW'
import addArrow from './addArrow'
import hasNormalArrow from './hasNormalArrow'
import removeArrow from './removeArrow'

export default function(js_plumb_conncetion) {
  if (hasNormalArrow(js_plumb_conncetion)) {
    return
  }
  removeArrow(HOVER_ARROW.id, js_plumb_conncetion)
  addArrow(NORMAL_ARROW.id, js_plumb_conncetion)
}
