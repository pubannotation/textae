import NORMAL_ARROW from '../NORMAL_ARROW'
import HOVER_ARROW from './HOVER_ARROW'

export default function(id, js_plumb_conncetion) {
  if (id === NORMAL_ARROW.id) {
    js_plumb_conncetion.addOverlay(['Arrow', NORMAL_ARROW])
  } else if (id === HOVER_ARROW.id) {
    js_plumb_conncetion.addOverlay(['Arrow', HOVER_ARROW])
  }
}
