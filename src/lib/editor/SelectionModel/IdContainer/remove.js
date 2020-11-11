import triggerChange from './triggerChange'

export default function remove(selected, emitter, kindName, modelInstance) {
  if (selected.has(modelInstance.id)) {
    selected.delete(modelInstance.id)
    modelInstance.deselect()
    triggerChange(emitter, kindName)
  }
}
