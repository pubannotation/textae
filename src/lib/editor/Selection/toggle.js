import add from './add'
import remove from './remove'

export default function(selected, emitter, kindName, id) {
  if (selected.has(id)) {
    remove(selected, emitter, kindName, id)
  } else {
    add(selected, emitter, kindName, id)
  }
}
