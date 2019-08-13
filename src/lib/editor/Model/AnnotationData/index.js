import reset from './reset'
import toJson from './toJson'
import Container from './Container'

export default function(editor) {
  const dataStore = new Container(editor)

  return Object.assign(dataStore, {
    reset: (annotation) => reset(dataStore, annotation),
    resetOnlyConfig: () => dataStore.emit('config.change', dataStore),
    toJson: () => toJson(dataStore),
    getModificationOf: (objectId) =>
      dataStore.modification.all().filter((m) => m.obj === objectId)
  })
}
