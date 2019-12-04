import setNewData from './setNewData'
import toastr from 'toastr'

export default function reset(dataStore, editor, annotation) {
  console.assert(annotation.text, 'This is not a json file of anntations.')

  clearAnnotationData(dataStore)
  const result = setNewData(dataStore, annotation)
  editor.eventEmitter.emit(
    'textae.annotationData.paragraph.change',
    dataStore.paragraph.all
  )
  editor.eventEmitter.emit(
    'textae.annotationData.all.change',
    dataStore,
    result.multitrack,
    result.rejects
  )

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
