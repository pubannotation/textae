import triggerChange from './triggerChange'

export default function(selected, emitter, kindName, id) {
  if (id.forEach) {
    id.forEach((id) => {
      selected.add(id)
      emitter.emit(`textae.selection.${kindName}.select`, id)
      triggerChange(emitter, kindName)
    })
  } else {
    selected.add(id)
    emitter.emit(`textae.selection.${kindName}.select`, id)
    triggerChange(emitter, kindName)
  }
}
