import triggerChange from './triggerChange'
import remove from './remove'

export default function(selected, emitter, kindName) {
  if (selected.size === 0) return
  selected.forEach((id) => remove(selected, emitter, kindName, id))
  triggerChange(emitter, kindName)
}
