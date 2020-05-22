import enableDrag from './enableDrag'
import enableDrop from './enableDrop'

export default function(el, emitter) {
  enableDrag(el)
  enableDrop(el, emitter)
}
