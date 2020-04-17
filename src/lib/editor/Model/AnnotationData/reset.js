import clearAnnotationData from './clearAnnotationData'

export default function(dataStore, editor, annotation) {
  console.assert(annotation.text, 'This is not a json file of anntations.')

  clearAnnotationData(dataStore)
  const result = dataStore.setNewData(annotation)
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
