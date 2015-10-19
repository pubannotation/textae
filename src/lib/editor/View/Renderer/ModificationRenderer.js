const allModificationClasses = 'textae-editor__negation textae-editor__speculation'

export default function(annotationData) {
  return {
    getClasses: (objectId) => getClasses(annotationData, objectId),
    update: (domElement, objectId) => update(annotationData, domElement, objectId)
  }
}

function getClasses(annotationData, objectId) {
  return annotationData.getModificationOf(objectId)
    .map((m) => `textae-editor__${m.pred.toLowerCase()}`)
}

function update(annotationData, domElement, objectId) {
  domElement.classList.remove('textae-editor__negation')
  domElement.classList.remove('textae-editor__speculation')
  getClasses(annotationData, objectId)
    .forEach(c => domElement.classList.add(c))
}
