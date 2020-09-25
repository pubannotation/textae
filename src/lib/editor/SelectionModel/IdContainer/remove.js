import triggerChange from './triggerChange'

export default function(selected, emitter, kindName, id) {
  if (selected.has(id)) {
    selected.delete(id)
    emitter.emit(`textae.selection.${kindName}.deselect`, id)
    triggerChange(emitter, kindName)
  }
}
