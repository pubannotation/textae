import add from './add'
import remove from './remove'

export default function (selected, emitter, kindName, modelInstance) {
  if (selected.has(modelInstance.id)) {
    remove(selected, emitter, kindName, modelInstance)
  } else {
    add(selected, emitter, kindName, modelInstance)
  }
}
