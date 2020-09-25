import triggerChange from './triggerChange'

export default function(selected, emitter, kindName, id) {
  if (selected.has(id)) {
    return
  }

  selected.add(id)
  emitter.emit(`textae.selection.${kindName}.select`, id)
  triggerChange(emitter, kindName)
}
