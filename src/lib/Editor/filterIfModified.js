import diffOfAnnotation from './diffOfAnnotation'

export default function filterIfModified(initialAnnotation) {
  let previous = initialAnnotation

  return (currentAnnotation, callback) => {
    if (diffOfAnnotation(previous, currentAnnotation)) {
      previous = currentAnnotation
      callback(currentAnnotation)
    }
  }
}
