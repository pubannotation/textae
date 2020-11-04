import triggerChange from './triggerChange'
import remove from './remove'

export default function (selected, emitter, kindName, toModel) {
  if (selected.size === 0) return
  selected.forEach((id) => remove(selected, emitter, kindName, toModel(id)))
  triggerChange(emitter, kindName)
}
