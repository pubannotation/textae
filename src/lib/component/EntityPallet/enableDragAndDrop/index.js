import enableDrag from './enableDrag'
import enableDrop from './enableDrop'

export default function(el, emitter, pallet) {
  enableDrag(el, pallet)
  enableDrop(el, emitter)
}
