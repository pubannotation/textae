import hasSpan from '../hasSpan'
import getFocusNodeParent from '../getFocusNodeParent'

export default function(selection) {
  return hasSpan(getFocusNodeParent(selection))
}
