import setNewData from './setNewData'
import toastr from 'toastr'

export default function reset(dataStore, annotation) {
  if (!annotation.text) {
    toastr.error('This is not a json file of anntations.')
    return null
  }

  clearAnnotationData(dataStore)
  const result = setNewData(dataStore, annotation)
  dataStore.emit('paragraph.change', dataStore.paragraph.all())
  dataStore.emit('all.change', dataStore, result.multitrack, result.rejects)

  return null
}

function clearAnnotationData(dataStore) {
  dataStore.span.clear()
  dataStore.entity.clear()
  dataStore.attribute.clear()
  dataStore.relation.clear()
  dataStore.modification.clear()
  dataStore.paragraph.clear()
  dataStore.namespace.clear()
}
