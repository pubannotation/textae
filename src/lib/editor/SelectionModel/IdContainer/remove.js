import triggerChange from './triggerChange'

export default function remove(selected, emitter, kindName, modelInstance) {
  if (selected.has(modelInstance.id)) {
    selected.delete(modelInstance.id)
    emitter.emit(`textae.selection.${kindName}.deselect`, modelInstance)
    triggerChange(emitter, kindName)
  }
}
