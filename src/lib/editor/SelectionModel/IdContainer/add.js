import triggerChange from './triggerChange'

export default function(selected, emitter, kindName, id) {
  selected.add(id)
  emitter.emit(`textae.selection.${kindName}.select`, id)
  triggerChange(emitter, kindName)
}
