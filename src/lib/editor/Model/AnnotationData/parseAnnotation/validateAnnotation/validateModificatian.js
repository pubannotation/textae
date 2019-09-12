import validate from './validate'
import isContains from './isContains'

export default function(denotations, relations, modifications) {
  const resultModification = validate(modifications, isContains, {
    property: 'obj',
    dictionary: denotations.concat(relations)
  })

  return {
    accept: resultModification.accept,
    reject: {
      modification: resultModification.reject,
      hasError: resultModification.reject.length !== 0
    }
  }
}
