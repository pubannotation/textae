import addArrow from './addArrow'
import getArrowIds from './getArrowIds'

export default function(js_plumb_conncetion) {
  for (const id of getArrowIds(js_plumb_conncetion)) {
    js_plumb_conncetion.removeOverlays(id)
    addArrow(id, js_plumb_conncetion)
  }
}
