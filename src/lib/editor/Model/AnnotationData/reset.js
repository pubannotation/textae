import setNewData from './setNewData'

export default function reset(dataStore, annotation) {
  try {
    clearAnnotationData(dataStore)

    if (!annotation.text) {
      throw new Error('read failed.')
    }

    const result = setNewData(dataStore, annotation)

    dataStore.emit('paragraph.change', dataStore.paragraph.all())
    dataStore.emit('all.change', dataStore, result.multitrack, result.rejects)

    return result.rejects
  } catch (error) {
    console.error(error, error.stack)
  }
}

function clearAnnotationData(dataStore) {
  dataStore.span.clear()
  dataStore.entity.clear()
  dataStore.relation.clear()
  dataStore.modification.clear()
  dataStore.paragraph.clear()
}
