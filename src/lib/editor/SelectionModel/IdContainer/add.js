import triggerChange from './triggerChange'

export default function (selected, emitter, kindName, modelInstance) {
  if (selected.has(modelInstance.id)) {
    return
  }

  selected.add(modelInstance.id)
  modelInstance.select()
  triggerChange(emitter, kindName)
}
