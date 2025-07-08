import diffOfAnnotation from './diffOfAnnotation'

export default function filterIfModified(initialAnnotation) {
  let previous = initialAnnotation

  return function (currentAnnotation, callback) {
    if (
      diffOfAnnotation(previous, currentAnnotation) ||
      currentAnnotation.selectedText.status !== 'unselected'
    ) {
      previous = currentAnnotation
      callback(currentAnnotation)
    }
  }
}
