import triggerChange from './triggerChange'

export default function (selected, emitter, kindName, modelInstance) {
  if (selected.has(modelInstance.id)) {
    return
  }

  selected.add(modelInstance.id)
  emitter.emit(`textae.selection.${kindName}.select`, modelInstance)
  triggerChange(emitter, kindName)
}
