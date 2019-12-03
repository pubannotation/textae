import setWidthWithinWindow from './setWidthWithinWindow'
import setHeightWithinWindow from './setHeightWithinWindow'

export default function(pallet, content) {
  pallet.innerHTML = content
  setWidthWithinWindow(pallet)
  setHeightWithinWindow(pallet)
}
